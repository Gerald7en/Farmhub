
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../../services/supabase"

type Cow = {
  id: string
  name: string
  breed: string | null
  colour: string | null
  status: string
}

type MilkRecord = {
  cow_id: string
  quantity_litres: number | string
}

function getLocalDate() {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

function Cows() {
  const navigate = useNavigate()

  const [cows, setCows] = useState<Cow[]>([])
  const [milkByCow, setMilkByCow] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let cancelled = false

    async function loadCows() {
      setLoading(true)
      setError("")

      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError) throw sessionError

        if (!session) {
          throw new Error("Your session has expired. Please sign in again.")
        }

        const { data: farmId, error: farmError } =
          await supabase.rpc("get_my_farm_id")

        if (farmError) throw farmError

        if (!farmId) {
          throw new Error("No farm is linked to your account.")
        }

        const { data: cowData, error: cowError } = await supabase
          .from("cows")
          .select("id, name, breed, colour, status")
          .eq("farm_id", farmId)
          .eq("status", "ACTIVE")
          .order("created_at", { ascending: true })

        if (cowError) throw cowError

        const { data: milkData, error: milkError } = await supabase
          .from("milk_production")
          .select("cow_id, quantity_litres")
          .eq("farm_id", farmId)
          .eq("production_date", getLocalDate())

        if (milkError) throw milkError

        if (cancelled) return

        const activeCows = (cowData ?? []) as Cow[]
        const milkRecords = (milkData ?? []) as MilkRecord[]

        const milkTotals: Record<string, number> = {}

        for (const record of milkRecords) {
          milkTotals[record.cow_id] =
            (milkTotals[record.cow_id] ?? 0) +
            Number(record.quantity_litres)
        }

        setCows(activeCows)
        setMilkByCow(milkTotals)
      } catch (err) {
        if (cancelled) return

        console.error("LOAD COWS ERROR:", err)

        setError(
          err instanceof Error
            ? err.message
            : "Couldn't load your cows. Please try again."
        )
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void loadCows()

    return () => {
      cancelled = true
    }
  }, [])

  const productionToday = cows.reduce(
    (total, cow) => total + (milkByCow[cow.id] ?? 0),
    0
  )

  return (
    <div className="page cows-page">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="cows-heading">
        <p className="eyebrow">DAIRY</p>

        <h1 className="page-title">Your cows</h1>

        <p className="page-description">
          Manage your herd and keep track of each cow.
        </p>
      </div>

      <div className="cows-summary">
        <div>
          <span>ACTIVE COWS</span>
          <strong>{loading ? "—" : cows.length}</strong>
        </div>

        <div>
          <span>PRODUCTION TODAY</span>
          <strong>
            {loading ? "—" : `${productionToday.toLocaleString()} L`}
          </strong>
        </div>
      </div>

      <section className="cows-section">
        <div className="section-header">
          <div>
            <span className="section-label">HERD</span>
            <h2>All cows</h2>
          </div>
        </div>

        {loading ? (
          <p className="page-description">Loading your cows...</p>
        ) : error ? (
          <div>
            <p className="page-description" role="alert">
              {error}
            </p>
            <button
              className="add-cow-button"
              onClick={() => window.location.reload()}
            >
              Try again
            </button>
          </div>
        ) : cows.length === 0 ? (
          <p className="page-description">
            No active cows yet. Add your first cow to start building your herd.
          </p>
        ) : (
          <div className="all-cows-list">
            {cows.map((cow) => (
              <button
                className="all-cow-card"
                key={cow.id}
                onClick={() => navigate(`/dairy/cow/${cow.id}`)}
              >
                <div className="all-cow-avatar">🐄</div>

                <div className="all-cow-info">
                  <h3>{cow.name}</h3>
                  <p>
                    {cow.breed || "Breed not recorded"}
                    {" · "}
                    {cow.colour || "Colour not recorded"}
                  </p>
                </div>

                <div className="all-cow-right">
                  <strong>
                    {(milkByCow[cow.id] ?? 0).toLocaleString()} L today
                  </strong>
                  <span>›</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      <button
        className="add-cow-button"
        onClick={() => navigate("/dairy/cows/add")}
      >
        <span>+</span>
        Add cow
      </button>
    </div>
  )
}

export default Cows
