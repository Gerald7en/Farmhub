import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { supabase } from "../../services/supabase"

type Cow = {
  id: string
  name: string
  breed: string | null
  colour: string | null
  gender: string | null
}

function CowDetails() {
  const navigate = useNavigate()
  const { name: cowId } = useParams()
  const [cow, setCow] = useState<Cow | null>(null)
  const [milkToday, setMilkToday] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let cancelled = false
    async function loadCow() {
      setLoading(true)
      setError("")
      try {
        const { data: farmId, error: farmError } = await supabase.rpc("get_my_farm_id")
        if (farmError) throw farmError
        if (!farmId || !cowId) throw new Error("This cow could not be found in your farm.")

        const { data: cowRow, error: cowError } = await supabase
          .from("cows")
          .select("id, name, breed, colour, gender")
          .eq("farm_id", farmId)
          .eq("id", cowId)
          .maybeSingle()
        if (cowError) throw cowError
        if (!cowRow) throw new Error("This cow could not be found in your farm.")

        const date = new Date()
        const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
        const { data: records, error: milkError } = await supabase
          .from("milk_production")
          .select("quantity_litres")
          .eq("farm_id", farmId)
          .eq("cow_id", cowId)
          .eq("production_date", today)
        if (milkError) throw milkError
        if (cancelled) return
        setCow(cowRow as Cow)
        setMilkToday((records ?? []).reduce((total, row) => total + (Number(row.quantity_litres) || 0), 0))
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Couldn't load this cow.")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void loadCow()
    return () => { cancelled = true }
  }, [cowId])

  if (loading || !cow) {
    return (
      <div className="page">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1 className="page-title">{loading ? "Loading cow..." : error || "Cow not found"}</h1>
        {!loading && error && <p className="page-description" role="alert">{error}</p>}
      </div>
    )
  }

  return (
    <div className="page cow-details-page">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="cow-profile">
        <div className="cow-profile-image">🐄</div>

        <div>
          <p className="eyebrow">COW PROFILE</p>
          <h1 className="page-title">{cow.name}</h1>
          <p className="cow-profile-breed">{cow.breed || "Breed not recorded"} · {cow.gender || "Gender not recorded"}</p>
        </div>
      </div>

      <section className="cow-highlight">
        <span className="card-label">TODAY'S MILK</span>

        <strong>{milkToday.toLocaleString()} L</strong>

        <p>Current production</p>
      </section>

      <section className="cow-details-grid">
        <div className="cow-detail-card">
          <span>AGE</span>
          <strong>—</strong>
        </div>

        <div className="cow-detail-card">
          <span>COLOUR</span>
          <strong>{cow.colour || "—"}</strong>
        </div>

        <div className="cow-detail-card">
          <span>CALVES</span>
          <strong>—</strong>
        </div>

        <div className="cow-detail-card">
          <span>GESTATION</span>
          <strong>—</strong>
        </div>
      </section>

      <section className="dairy-section">
        <div className="section-header">
          <div>
            <span className="section-label">MONITORING</span>
            <h2>Health & records</h2>
          </div>
        </div>

        <div className="cow-record-card">
          <div className="record-icon">♡</div>

          <div>
            <h3>Health</h3>
            <p>Health checks and treatment history</p>
          </div>

          <span>›</span>
        </div>

        <div className="cow-record-card">
          <div className="record-icon">＋</div>

          <div>
            <h3>Vaccinations</h3>
            <p>Vaccination records and upcoming doses</p>
          </div>

          <span>›</span>
        </div>

        <div className="cow-record-card">
          <div className="record-icon">◌</div>

          <div>
            <h3>Milk history</h3>
            <p>View this cow's production over time</p>
          </div>

          <span>›</span>
        </div>
      </section>

      <button className="dairy-add-button" onClick={() => navigate("/dairy/record-milk")}>
        Record milk
      </button>
    </div>
  )
}

export default CowDetails
