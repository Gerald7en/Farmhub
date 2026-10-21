
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../../services/supabase"

type Session = "MORNING" | "EVENING"

type Cow = {
  id: string
  name: string
}

type MilkRecord = {
  cow_id: string
  quantity_litres: number | string
}

type MovementRecord = {
  quantity_sold_litres: number | string
}

function getLocalDate() {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

function RecordMilk() {
  const navigate = useNavigate()

  const [session, setSession] = useState<Session>("MORNING")
  const [cows, setCows] = useState<Cow[]>([])
  const [production, setProduction] = useState<Record<string, string>>({})
  const [sold, setSold] = useState("")
  const [farmId, setFarmId] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    let cancelled = false

    async function loadRecords() {
      setLoading(true)
      setError("")
      setMessage("")

      try {
        const {
          data: { session: authSession },
          error: authError,
        } = await supabase.auth.getSession()

        if (authError) throw authError

        if (!authSession) {
          throw new Error("Your session has expired. Please sign in again.")
        }

        const { data: currentFarmId, error: farmError } =
          await supabase.rpc("get_my_farm_id")

        if (farmError) throw farmError

        if (!currentFarmId) {
          throw new Error("No farm is linked to your account.")
        }

        const today = getLocalDate()

        const { data: cowData, error: cowError } = await supabase
          .from("cows")
          .select("id, name")
          .eq("farm_id", currentFarmId)
          .eq("status", "ACTIVE")
          .order("created_at", { ascending: true })

        if (cowError) throw cowError

        const { data: milkData, error: milkError } = await supabase
          .from("milk_production")
          .select("cow_id, quantity_litres")
          .eq("farm_id", currentFarmId)
          .eq("production_date", today)
          .eq("session", session)

        if (milkError) throw milkError

        const { data: movementData, error: movementError } = await supabase
          .from("milk_movements")
          .select("quantity_sold_litres")
          .eq("farm_id", currentFarmId)
          .eq("movement_date", today)
          .eq("session", session)
          .maybeSingle()

        if (movementError) throw movementError

        if (cancelled) return

        const savedProduction: Record<string, string> = {}

        for (const record of (milkData ?? []) as MilkRecord[]) {
          savedProduction[record.cow_id] = String(record.quantity_litres)
        }

        const movement = movementData as MovementRecord | null

        setFarmId(currentFarmId)
        setCows((cowData ?? []) as Cow[])
        setProduction(savedProduction)
        setSold(
          movement ? String(movement.quantity_sold_litres) : ""
        )
      } catch (err) {
        if (cancelled) return

        console.error("LOAD MILK RECORDS ERROR:", err)
        setError(
          err instanceof Error
            ? err.message
            : "Couldn't load milk records. Please try again."
        )
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void loadRecords()

    return () => {
      cancelled = true
    }
  }, [session])

  const totalProduced = cows.reduce(
    (total, cow) => total + (Number(production[cow.id]) || 0),
    0
  )

  const totalSold = Number(sold) || 0
  const remaining = totalProduced - totalSold

  const handleProductionChange = (cowId: string, value: string) => {
    setProduction((current) => ({
      ...current,
      [cowId]: value,
    }))
  }

  async function handleSave() {
    setError("")
    setMessage("")

    if (loading || saving) return

    if (!farmId) {
      setError("Your farm could not be identified. Please reload the screen.")
      return
    }

    if (cows.length === 0) {
      setError("Add an active cow before recording milk.")
      return
    }

    for (const cow of cows) {
      const value = production[cow.id] ?? ""

      if (
        value.trim() !== "" &&
        (!Number.isFinite(Number(value)) || Number(value) < 0)
      ) {
        setError(`Enter a valid milk quantity for ${cow.name}.`)
        return
      }

      if (
        value.trim() !== "" &&
        !/^\d+(\.\d{1,2})?$/.test(value.trim())
      ) {
        setError("Milk quantities can have up to two decimal places.")
        return
      }
    }

    if (
      sold.trim() !== "" &&
      (!Number.isFinite(Number(sold)) || Number(sold) < 0)
    ) {
      setError("Enter a valid quantity of milk sold.")
      return
    }

    if (
      sold.trim() !== "" &&
      !/^\d+(\.\d{1,2})?$/.test(sold.trim())
    ) {
      setError("Milk sold can have up to two decimal places.")
      return
    }

    if (totalSold > totalProduced) {
      setError("Milk sold cannot exceed the production for this session.")
      return
    }

    setSaving(true)

    try {
      const {
        data: { session: authSession },
        error: authError,
      } = await supabase.auth.getSession()

      if (authError) throw authError

      if (!authSession) {
        throw new Error("Your session has expired. Please sign in again.")
      }

      const today = getLocalDate()

      const productionRows = cows.map((cow) => ({
        farm_id: farmId,
        cow_id: cow.id,
        production_date: today,
        session,
        quantity_litres: Number(production[cow.id] || 0),
        recorded_by: authSession.user.id,
      }))

      const { error: productionError } = await supabase
        .from("milk_production")
        .upsert(productionRows, {
          onConflict: "cow_id,production_date,session",
        })

      if (productionError) throw productionError

      const { error: movementError } = await supabase
        .from("milk_movements")
        .upsert(
          {
            farm_id: farmId,
            movement_date: today,
            session,
            quantity_sold_litres: totalSold,
            recorded_by: authSession.user.id,
          },
          {
            onConflict: "farm_id,movement_date,session",
          }
        )

      if (movementError) {
        throw new Error(
          `Production was saved, but milk sold could not be saved: ${movementError.message}`
        )
      }

      setMessage("Milk production and sales saved successfully.")
      navigate("/dairy")
    } catch (err) {
      console.error("SAVE MILK ERROR:", err)
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't save the milk record. Please try again."
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="page record-milk-page">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="record-milk-heading">
        <p className="eyebrow">DAIRY</p>

        <h1 className="page-title">Record milk</h1>

        <p className="page-description">
          Record production for each cow and track milk sold.
        </p>
      </div>

      <section className="milk-session-selector">
        <button
          type="button"
          className={session === "MORNING" ? "selected" : ""}
          disabled={loading || saving}
          onClick={() => setSession("MORNING")}
        >
          Morning
        </button>

        <button
          type="button"
          className={session === "EVENING" ? "selected" : ""}
          disabled={loading || saving}
          onClick={() => setSession("EVENING")}
        >
          Evening
        </button>
      </section>

      {loading ? (
        <p className="page-description">Loading your cows and records...</p>
      ) : error && cows.length === 0 ? (
        <p className="page-description" role="alert">{error}</p>
      ) : (
        <>
          <section className="record-section">
            <div className="section-header">
              <div>
                <span className="section-label">PRODUCTION</span>
                <h2>Milk per cow</h2>
              </div>
            </div>

            <div className="milk-input-list">
              {cows.map((cow) => (
                <div className="milk-input-card" key={cow.id}>
                  <div className="milk-cow-icon">🐄</div>

                  <div className="milk-cow-name">
                    <strong>{cow.name}</strong>
                    <span>{session === "MORNING" ? "Morning" : "Evening"} production</span>
                  </div>

                  <div className="litre-input">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      inputMode="decimal"
                      placeholder="0"
                      value={production[cow.id] ?? ""}
                      disabled={saving}
                      onChange={(event) =>
                        handleProductionChange(cow.id, event.target.value)
                      }
                    />
                    <span>L</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="milk-total-card">
            <div>
              <span>TOTAL PRODUCED</span>
              <strong>{totalProduced.toFixed(1)} L</strong>
            </div>
            <div className="milk-total-icon">∑</div>
          </section>

          <section className="record-section">
            <div className="section-header">
              <div>
                <span className="section-label">MILK MOVEMENT</span>
                <h2>What happened to the milk?</h2>
              </div>
            </div>

            <div className="milk-movement-card">
              <label htmlFor="sold">Milk sold</label>

              <div className="movement-input">
                <input
                  id="sold"
                  type="number"
                  min="0"
                  step="0.01"
                  inputMode="decimal"
                  placeholder="0"
                  value={sold}
                  disabled={saving}
                  onChange={(event) => setSold(event.target.value)}
                />
                <span>Litres</span>
              </div>
            </div>
          </section>

          <section className="milk-summary-card">
            <div>
              <span>PRODUCED</span>
              <strong>{totalProduced.toFixed(1)} L</strong>
            </div>
            <div>
              <span>SOLD</span>
              <strong>{totalSold.toFixed(1)} L</strong>
            </div>
            <div>
              <span>REMAINING</span>
              <strong>{remaining.toFixed(1)} L</strong>
            </div>
          </section>
        </>
      )}

      {error && cows.length > 0 && (
        <p className="page-description" role="alert">{error}</p>
      )}

      {message && (
        <p className="page-description" role="status">{message}</p>
      )}

      <button
        className="save-milk-button"
        onClick={() => void handleSave()}
        disabled={loading || saving || !!error || cows.length === 0}
      >
        {saving ? "Saving milk record..." : "Save milk record"}
      </button>
    </div>
  )
}

export default RecordMilk
