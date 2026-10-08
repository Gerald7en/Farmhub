import { useEffect, useRef, useState } from "react"

type Companion = {
  name: string
  type: string
  age: string
  emoji: string
  description: string
}

const companions: Companion[] = [
  {
    name: "Bruno",
    type: "Dog",
    age: "3 years old",
    emoji: "🐕",
    description: "Always watching over the farm.",
  },
  {
    name: "Max",
    type: "Dog",
    age: "2 years old",
    emoji: "🐕",
    description: "A playful companion around home.",
  },
  {
    name: "Milo",
    type: "Cat",
    age: "1 year old",
    emoji: "🐈",
    description: "Quiet, curious and always nearby.",
  },
]

function Home() {
  const [activeCompanion, setActiveCompanion] = useState(0)
  const touchStartX = useRef<number | null>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveCompanion((current) => (current + 1) % companions.length)
    }, 3000)

    return () => clearInterval(timer)
  }, [])

  const goToCompanion = (index: number) => {
    setActiveCompanion(index)
  }

  const nextCompanion = () => {
    setActiveCompanion((current) => (current + 1) % companions.length)
  }

  const previousCompanion = () => {
    setActiveCompanion(
      (current) => (current - 1 + companions.length) % companions.length
    )
  }

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0].clientX
  }

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return

    const touchEndX = event.changedTouches[0].clientX
    const distance = touchStartX.current - touchEndX

    if (Math.abs(distance) > 45) {
      if (distance > 0) {
        nextCompanion()
      } else {
        previousCompanion()
      }
    }

    touchStartX.current = null
  }

  const companion = companions[activeCompanion]

  return (
    <div className="app">
      <main className="app-content">
        <section className="welcome">
          <p className="eyebrow">MUM'S FARM</p>

          <h1>
            Good morning,
            <br />
            Mum <span>👋</span>
          </h1>

          <p className="subtitle">
            Here’s what’s happening around the farm today.
          </p>
        </section>

        <section className="overview-card">
          <div>
            <span className="card-label">TODAY'S FARM</span>
            <h2>Everything looks good.</h2>
          </div>

          <div className="overview-icon">✦</div>
        </section>

        <section className="section">
          <div className="section-header">
            <div>
              <span className="section-label">OVERVIEW</span>
              <h2>Farm at a glance</h2>
            </div>

            <button className="see-all">View all</button>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-icon">🐄</span>
              <span className="stat-label">COWS</span>
              <strong>0</strong>
              <p>Active cows</p>
            </div>

            <div className="stat-card">
              <span className="stat-icon">🥛</span>
              <span className="stat-label">MILK</span>
              <strong>0L</strong>
              <p>Produced today</p>
            </div>

            <div className="stat-card">
              <span className="stat-icon">🐔</span>
              <span className="stat-label">POULTRY</span>
              <strong>0</strong>
              <p>Total birds</p>
            </div>

            <div className="stat-card">
              <span className="stat-icon">🌱</span>
              <span className="stat-label">GARDEN</span>
              <strong>0</strong>
              <p>Plants & trees</p>
            </div>
          </div>
        </section>

        {/* =========================
            COMPANIONS
        ========================= */}

        <section className="companions-section">
          <div className="section-header">
            <div>
              <span className="section-label">AT HOME</span>
              <h2>Companions</h2>
            </div>

            <button className="see-all">View all</button>
          </div>

          <div
            className="companion-carousel"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className="companion-card">
              <div className="companion-image">
                <span>{companion.emoji}</span>
              </div>

              <div className="companion-info">
                <div>
                  <span className="companion-type">
                    {companion.type.toUpperCase()}
                  </span>

                  <h3>{companion.name}</h3>

                  <p className="companion-age">{companion.age}</p>
                </div>

                <p className="companion-description">
                  {companion.description}
                </p>
              </div>
            </div>
          </div>

          <div className="carousel-controls">
            <button
              className="carousel-arrow"
              onClick={previousCompanion}
              aria-label="Previous companion"
            >
              ‹
            </button>

            <div className="carousel-dots">
              {companions.map((item, index) => (
                <button
                  key={item.name}
                  className={`carousel-dot ${
                    index === activeCompanion ? "active" : ""
                  }`}
                  onClick={() => goToCompanion(index)}
                  aria-label={`Show ${item.name}`}
                />
              ))}
            </div>

            <button
              className="carousel-arrow"
              onClick={nextCompanion}
              aria-label="Next companion"
            >
              ›
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Home