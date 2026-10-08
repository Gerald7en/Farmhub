import { useNavigate } from "react-router-dom"
import { useState } from "react"

function AddCow() {
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [colour, setColour] = useState("")
  const [breed, setBreed] = useState("")
  const [age, setAge] = useState("")
  const [calves, setCalves] = useState("0")
  const [gestation, setGestation] = useState("NOT_PREGNANT")

  const handleSave = () => {
    if (!name.trim()) {
      alert("Please enter the cow's name.")
      return
    }

    console.log({
      name,
      colour,
      breed,
      age,
      calves,
      gestation,
    })

    alert("Cow added successfully.")

    navigate("/dairy/cows")
  }

  return (
    <div className="page add-cow-page">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="add-cow-heading">
        <p className="eyebrow">DAIRY</p>

        <h1 className="page-title">Add cow</h1>

        <p className="page-description">
          Add a new cow to Mum's herd.
        </p>
      </div>

      <section className="cow-photo-area">
        <div className="cow-photo-placeholder">
          🐄
        </div>

        <button className="photo-button">
          Add photo
        </button>

        <p>
          A photo makes it easier to identify each cow.
        </p>
      </section>

      <section className="cow-form-section">
        <div className="form-field">
          <label htmlFor="cow-name">Cow name</label>

          <input
            id="cow-name"
            type="text"
            placeholder="e.g. Daisy"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>

        <div className="form-field">
          <label htmlFor="cow-breed">Breed</label>

          <input
            id="cow-breed"
            type="text"
            placeholder="e.g. Friesian"
            value={breed}
            onChange={(event) => setBreed(event.target.value)}
          />
        </div>

        <div className="form-field">
          <label htmlFor="cow-colour">Colour</label>

          <input
            id="cow-colour"
            type="text"
            placeholder="e.g. Black & White"
            value={colour}
            onChange={(event) => setColour(event.target.value)}
          />
        </div>

        <div className="form-field">
          <label htmlFor="cow-age">Age</label>

          <input
            id="cow-age"
            type="text"
            placeholder="e.g. 4 years"
            value={age}
            onChange={(event) => setAge(event.target.value)}
          />
        </div>

        <div className="form-field">
          <label htmlFor="cow-calves">Number of calves</label>

          <input
            id="cow-calves"
            type="number"
            min="0"
            inputMode="numeric"
            value={calves}
            onChange={(event) => setCalves(event.target.value)}
          />
        </div>

        <div className="form-field">
          <label htmlFor="cow-gestation">Gestation</label>

          <select
            id="cow-gestation"
            value={gestation}
            onChange={(event) => setGestation(event.target.value)}
          >
            <option value="NOT_PREGNANT">Not pregnant</option>
            <option value="PREGNANT">Pregnant</option>
          </select>
        </div>
      </section>

      <button className="save-cow-button" onClick={handleSave}>
        Save cow
      </button>
    </div>
  )
}

export default AddCow