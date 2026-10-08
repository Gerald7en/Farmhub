import { useNavigate, useParams } from "react-router-dom"

const cowData: Record<
  string,
  {
    name: string
    breed: string
    colour: string
    age: string
    calves: number
    milk: string
    gestation: string
  }
> = {
  daisy: {
    name: "Daisy",
    breed: "Friesian",
    colour: "Black & White",
    age: "4 years",
    calves: 2,
    milk: "9 L",
    gestation: "Not pregnant",
  },

  bella: {
    name: "Bella",
    breed: "Friesian",
    colour: "Black & White",
    age: "5 years",
    calves: 3,
    milk: "11 L",
    gestation: "Pregnant",
  },

  rose: {
    name: "Rose",
    breed: "Jersey",
    colour: "Brown",
    age: "3 years",
    calves: 1,
    milk: "10 L",
    gestation: "Not pregnant",
  },
}

function CowDetails() {
  const navigate = useNavigate()
  const { name } = useParams()

  const cow = name ? cowData[name] : undefined

  if (!cow) {
    return (
      <div className="page">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <h1 className="page-title">Cow not found</h1>
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
          <p className="cow-profile-breed">
            {cow.breed} · Female
          </p>
        </div>
      </div>

      <section className="cow-highlight">
        <span className="card-label">TODAY'S MILK</span>

        <strong>{cow.milk}</strong>

        <p>Current production</p>
      </section>

      <section className="cow-details-grid">
        <div className="cow-detail-card">
          <span>AGE</span>
          <strong>{cow.age}</strong>
        </div>

        <div className="cow-detail-card">
          <span>COLOUR</span>
          <strong>{cow.colour}</strong>
        </div>

        <div className="cow-detail-card">
          <span>CALVES</span>
          <strong>{cow.calves}</strong>
        </div>

        <div className="cow-detail-card">
          <span>GESTATION</span>
          <strong>{cow.gestation}</strong>
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

      <button className="dairy-add-button">
        Edit cow
      </button>
    </div>
  )
}

export default CowDetails