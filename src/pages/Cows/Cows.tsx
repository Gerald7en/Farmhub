import { useNavigate } from "react-router-dom"

const cows = [
  {
    id: "daisy",
    name: "Daisy",
    breed: "Friesian",
    colour: "Black & White",
    milk: "9 L today",
  },
  {
    id: "bella",
    name: "Bella",
    breed: "Friesian",
    colour: "Black & White",
    milk: "11 L today",
  },
  {
    id: "rose",
    name: "Rose",
    breed: "Jersey",
    colour: "Brown",
    milk: "10 L today",
  },
]

function Cows() {
  const navigate = useNavigate()

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
          <strong>{cows.length}</strong>
        </div>

        <div>
          <span>PRODUCTION TODAY</span>
          <strong>30 L</strong>
        </div>
      </div>

      <section className="cows-section">
        <div className="section-header">
          <div>
            <span className="section-label">HERD</span>
            <h2>All cows</h2>
          </div>
        </div>

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
                  {cow.breed} · {cow.colour}
                </p>
              </div>

              <div className="all-cow-right">
                <strong>{cow.milk}</strong>
                <span>›</span>
              </div>
            </button>
          ))}
        </div>
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