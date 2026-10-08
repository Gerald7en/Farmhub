import { useNavigate } from "react-router-dom"

type Cow = {
  name: string
  breed: string
  production: string
  emoji: string
}

const cows: Cow[] = [
  {
    name: "Daisy",
    breed: "Friesian · Female",
    production: "9 L today",
    emoji: "🐄",
  },
  {
    name: "Bella",
    breed: "Friesian · Female",
    production: "11 L today",
    emoji: "🐄",
  },
  {
    name: "Rose",
    breed: "Jersey · Female",
    production: "10 L today",
    emoji: "🐄",
  },
]

function Dairy() {
  const navigate = useNavigate()

  return (
    <div className="page dairy-page">
      <p className="eyebrow">DAIRY</p>

      <h1 className="page-title">Dairy</h1>

      <p className="page-description">
        Your herd, milk production and dairy performance.
      </p>

      {/* HERD SUMMARY */}

      <section className="herd-card">
        <div>
          <span className="card-label">HERD</span>

          <strong>3</strong>

          <p>Active cows</p>
        </div>

        <div className="herd-icon">🐄</div>
      </section>

      {/* MILK SUMMARY */}

      <section className="dairy-stats">
        <div className="dairy-stat-card">
          <span className="stat-label">MILK</span>

          <strong>30 L</strong>

          <p>Produced today</p>
        </div>

        <div className="dairy-stat-card">
          <span className="stat-label">SOLD</span>

          <strong>22 L</strong>

          <p>Sold today</p>
        </div>

        <div className="dairy-stat-card">
          <span className="stat-label">REMAINING</span>

          <strong>8 L</strong>

          <p>Remaining</p>
        </div>

        <div className="dairy-stat-card">
          <span className="stat-label">INCOME</span>

          <strong>KSh 1,100</strong>

          <p>Milk sales</p>
        </div>
      </section>

      {/* MILK SESSIONS */}

      <section className="dairy-section">
        <div className="section-header">
          <div>
            <span className="section-label">TODAY</span>
            <h2>Milk production</h2>
          </div>
        </div>

        <div className="milk-sessions">
          <div className="milk-session">
            <div className="session-top">
              <span>Morning</span>
              <span className="session-badge">16 L</span>
            </div>

            <div className="session-details">
              <div>
                <span>Produced</span>
                <strong>16 L</strong>
              </div>

              <div>
                <span>Sold</span>
                <strong>12 L</strong>
              </div>

              <div>
                <span>Left</span>
                <strong>4 L</strong>
              </div>
            </div>
          </div>

          <div className="milk-session">
            <div className="session-top">
              <span>Evening</span>
              <span className="session-badge">14 L</span>
            </div>

            <div className="session-details">
              <div>
                <span>Produced</span>
                <strong>14 L</strong>
              </div>

              <div>
                <span>Sold</span>
                <strong>10 L</strong>
              </div>

              <div>
                <span>Left</span>
                <strong>4 L</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COWS */}

      <section className="dairy-section">
        <div className="section-header">
          <div>
            <span className="section-label">YOUR HERD</span>
            <h2>Cows</h2>
          </div>

          <button className="see-all">View all</button>
        </div>

        <div className="cow-list">
          {cows.map((cow) => (
            <button 
            className="cow-card" 
            key={cow.name}
            onClick={() => navigate(`/dairy/cows/${cow.name.toLowerCase()}`)}>
              <div className="cow-avatar">{cow.emoji}</div>

              <div className="cow-info">
                <h3>{cow.name}</h3>

                <p>{cow.breed}</p>
              </div>

              <div className="cow-production">
                <strong>{cow.production}</strong>
                <span>›</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* QUICK ACTION */}

      <button className="dairy-add-button">
        <span>+</span>
        Record milk
      </button>
    </div>
  )
}

export default Dairy