import { useNavigate } from "react-router-dom"
import { useState } from "react"

const cows = [
  { id: 1, name: "Daisy" },
  { id: 2, name: "Bella" },
  { id: 3, name: "Rose" },
]

function RecordMilk() {
  const navigate = useNavigate()

  const [session, setSession] = useState<"MORNING" | "EVENING">("MORNING")

  const [production, setProduction] = useState<Record<number, string>>({
    1: "",
    2: "",
    3: "",
  })

  const [sold, setSold] = useState("")

  const totalProduced = Object.values(production).reduce(
    (total, value) => total + (Number(value) || 0),
    0
  )

  const totalSold = Number(sold) || 0

  const remaining = Math.max(totalProduced - totalSold, 0)

  const handleProductionChange = (cowId: number, value: string) => {
    setProduction((current) => ({
      ...current,
      [cowId]: value,
    }))
  }

  const handleSave = () => {
    console.log({
      session,
      production,
      totalProduced,
      totalSold,
      remaining,
    })

    alert("Milk record saved successfully.")

    navigate("/dairy")
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
          Record today's production for each cow.
        </p>
      </div>

      <section className="milk-session-selector">
        <button
          className={session === "MORNING" ? "selected" : ""}
          onClick={() => setSession("MORNING")}
        >
          Morning
        </button>

        <button
          className={session === "EVENING" ? "selected" : ""}
          onClick={() => setSession("EVENING")}
        >
          Evening
        </button>
      </section>

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
                <span>Today's production</span>
              </div>

              <div className="litre-input">
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  inputMode="decimal"
                  placeholder="0"
                  value={production[cow.id]}
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
              step="0.1"
              inputMode="decimal"
              placeholder="0"
              value={sold}
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

      <button className="save-milk-button" onClick={handleSave}>
        Save milk record
      </button>
    </div>
  )
}

export default RecordMilk