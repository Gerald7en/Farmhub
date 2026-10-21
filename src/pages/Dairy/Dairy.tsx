
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../../services/supabase"

type Cow = {
  id: string
  name: string
  breed: string | null
  gender: string
  status: string
}

type MilkRecord = {
  cow_id: string
  session: "MORNING" | "EVENING"
  quantity_litres: number | string
}

type MilkMovement = {
  session: "MORNING" | "EVENING"
  quantity_sold_litres: number | string
}

type SessionTotals = {
  produced: number
  sold: number
}

function getLocalDate() {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

function formatLitres(value: number) {
  return `${Number(value.toFixed(2)).toLocaleString()} L`
}

function Dairy() {
  const navigate = useNavigate()

  const [cows, setCows] = useState<Cow[]>([])
  const [milkByCow, setMilkByCow] = useState<Record<string, number>>({})
  const [sessions, setSessions] = useState<Record<string, SessionTotals>>({
    MORNING: { produced: 0, sold: 0 },
    EVENING: { produced: 0, sold: 0 },
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let cancelled = false

    async function loadDairyData() {
      setLoading(true)
      setError("")

      try {
        const {
          data: { session },
          error: authError,
        } = await supabase.auth.getSession()

        if (authError) throw authError

        if (!session) {
          throw new Error("Your session has expired. Please sign in again.")
        }

        const { data: farmId, error: farmError } =
          await supabase.rpc("get_my_farm_id")

        if (farmError) throw farmError

        if (!farmId) {
          throw new Error("No farm is linked to your account.")
        }

        const today = getLocalDate()

        const [
          { data: cowData, error: cowError },
          { data: milkData, error: milkError },
          { data: movementData, error: movementError },
        ] = await Promise.all([
          supabase
            .from("cows")
            .select("id, name, breed, gender, status")
            .eq("farm_id", farmId)
            .eq("status", "ACTIVE")
            .order("created_at", { ascending: true }),

          supabase
            .from("milk_production")
            .select("cow_id, session, quantity_litres")
            .eq("farm_id", farmId)
            .eq("production_date", today),

          supabase
            .from("milk_movements")
            .select("session, quantity_sold_litres")
            .eq("farm_id", farmId)
            .eq("movement_date", today),
        ])

        if (cowError) throw cowError
        if (milkError) throw milkError
        if (movementError) throw movementError

        if (cancelled) return

        const activeCows = (cowData ?? []) as Cow[]
        const productionRecords = (milkData ?? []) as MilkRecord[]
        const movementRecords = (movementData ?? []) as MilkMovement[]

        const cowTotals: Record<string, number> = {}

        const sessionTotals: Record<string, SessionTotals> = {
          MORNING: { produced: 0, sold: 0 },
          EVENING: { produced: 0, sold: 0 },
        }

        for (const record of productionRecords) {
          const quantity = Number(record.quantity_litres) || 0

          sessionTotals[record.session].produced += quantity
          cowTotals[record.cow_id] =
            (cowTotals[record.cow_id] ?? 0) + quantity
        }

        for (const record of movementRecords) {
          sessionTotals[record.session].sold +=
            Number(record.quantity_sold_litres) || 0
        }

        setCows(activeCows)
        setMilkByCow(cowTotals)
        setSessions(sessionTotals)
      } catch (err) {
        if (cancelled) return

        console.error("LOAD DAIRY DASHBOARD ERROR:", err)

        setError(
          err instanceof Error
            ? err.message
            : "Couldn't load dairy information. Please try again."
        )
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void loadDairyData()

    return () => {
      cancelled = true
    }
  }, [])

  const morning = sessions.MORNING
  const evening = sessions.EVENING

  const totalProduced = morning.produced + evening.produced
  const totalSold = morning.sold + evening.sold
  const remaining = totalProduced - totalSold

  const sessionCard = (
    title: string,
    totals: SessionTotals
  ) => (
    <div className="milk-session">
      <div className="session-top">
        <span>{title}</span>
        <span className="session-badge">
          {formatLitres(totals.produced)}
        </span>
      </div>

      <div className="session-details">
        <div>
          <span>Produced</span>
          <strong>{formatLitres(totals.produced)}</strong>
        </div>

        <div>
          <span>Sold</span>
          <strong>{formatLitres(totals.sold)}</strong>
        </div>

        <div>
          <span>Left</span>
          <strong>
            {formatLitres(totals.produced - totals.sold)}
          </strong>
        </div>
      </div>
    </div>
  )

  return (
    <div className="page dairy-page">
      <p className="eyebrow">DAIRY</p>

      <h1 className="page-title">Dairy</h1>

      <p className="page-description">
        Your herd, milk production and dairy performance.
      </p>

      {error && (
        <p className="page-description" role="alert">
          {error}
        </p>
      )}

      <section className="herd-card">
        <div>
          <span className="card-label">HERD</span>
          <strong>{loading ? "—" : cows.length}</strong>
          <p>Active cows</p>
        </div>

        <div className="herd-icon">🐄</div>
      </section>

      <section className="dairy-stats">
        <div className="dairy-stat-card">
          <span className="stat-label">MILK</span>
          <strong>{loading ? "—" : formatLitres(totalProduced)}</strong>
          <p>Produced today</p>
        </div>

        <div className="dairy-stat-card">
          <span className="stat-label">SOLD</span>
          <strong>{loading ? "—" : formatLitres(totalSold)}</strong>
          <p>Sold today</p>
        </div>

        <div className="dairy-stat-card">
          <span className="stat-label">REMAINING</span>
          <strong>{loading ? "—" : formatLitres(remaining)}</strong>
          <p>Remaining today</p>
        </div>

        <div className="dairy-stat-card">
          <span className="stat-label">INCOME</span>
          <strong>—</strong>
          <p>Not connected yet</p>
        </div>
      </section>

      <section className="dairy-section">
        <div className="section-header">
          <div>
            <span className="section-label">TODAY</span>
            <h2>Milk production</h2>
          </div>
        </div>

        {loading ? (
          <p className="page-description">Loading milk records...</p>
        ) : (
          <div className="milk-sessions">
            {sessionCard("Morning", morning)}
            {sessionCard("Evening", evening)}
          </div>
        )}
      </section>

      <section className="dairy-section">
        <div className="section-header">
          <div>
            <span className="section-label">YOUR HERD</span>
            <h2>Cows</h2>
          </div>

          <button
            className="see-all"
            onClick={() => navigate("/dairy/cows")}
          >
            View all
          </button>
        </div>

        {loading ? (
          <p className="page-description">Loading your herd...</p>
        ) : cows.length === 0 ? (
          <p className="page-description">
            No active cows yet. Add a cow to get started.
          </p>
        ) : (
          <div className="cow-list">
            {cows.slice(0, 3).map((cow) => (
              <button
                className="cow-card"
                key={cow.id}
                onClick={() => navigate(`/dairy/cow/${cow.id}`)}
              >
                <div className="cow-avatar">🐄</div>

                <div className="cow-info">
                  <h3>{cow.name}</h3>
                  <p>
                    {cow.breed || "Breed not recorded"}
                    {" · "}
                    {cow.gender === "FEMALE" ? "Female" : "Male"}
                  </p>
                </div>

                <div className="cow-production">
                  <strong>
                    {formatLitres(milkByCow[cow.id] ?? 0)} today
                  </strong>
                  <span>›</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      <button
        className="dairy-add-button"
        onClick={() => navigate("/dairy/record-milk")}
      >
        <span>+</span>
        Record milk
      </button>
    </div>
  )
}

export default Dairy
