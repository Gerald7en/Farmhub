
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../../services/supabase"

function AddCow() {
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [colour, setColour] = useState("")
  const [breed, setBreed] = useState("")
  const [age, setAge] = useState("")
  const [calves, setCalves] = useState("0")
  const [gestation, setGestation] = useState("NOT_PREGNANT")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  function ageToMonths(value: string): number | null {
    if (!value.trim()) return null

    const match = value.trim().match(
      /^(\d+(?:\.\d+)?)\s*(years?|yrs?|months?|mos?)?$/i
    )

    if (!match) {
      throw new Error(
        "Enter age like '4 years' or '18 months'."
      )
    }

    const amount = Number(match[1])
    const unit = (match[2] || "years").toLowerCase()

    if (!Number.isFinite(amount) || amount < 0) {
      throw new Error("Please enter a valid age.")
    }

    const months = unit.startsWith("y")
      ? amount * 12
      : amount

    return Math.round(months)
  }

  async function handleSave() {

    if (!name.trim()) {
      setMessage("Please enter the cow's name.")
      return
    }

    const calvesCount = Number(calves)

    if (
      !Number.isInteger(calvesCount) ||
      calvesCount < 0
    ) {
      setMessage("Enter a valid number of calves.")
      return
    }

    setLoading(true)

    try {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession()

      if (sessionError) throw sessionError

      if (!sessionData.session) {
        setMessage("Your session has expired. Please sign in again.")
        return
      }

      const { data: farmId, error: farmError } =
        await supabase.rpc("get_my_farm_id")

      if (farmError) throw farmError

      if (!farmId) {
        setMessage(
          "No farm is linked to your account. Please complete farm setup first."
        )
        return
      }

      const approximateAgeMonths = ageToMonths(age)

      const { error: insertError } = await supabase
        .from("cows")
        .insert({
          farm_id: farmId,
          name: name.trim(),
          breed: breed.trim() || null,
          colour: colour.trim() || null,
          approximate_age_months: approximateAgeMonths,
          number_of_calves: calvesCount,
          gestation_status: gestation,
        })

      if (insertError) throw insertError

      navigate("/dairy/cows", { replace: true })
    } catch (error) {
  console.error("ADD COW ERROR:", error)

  if (error && typeof error === "object" && "message" in error) {
    setMessage(String(error.message))
  } else {
    setMessage(JSON.stringify(error))
  }

    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page add-cow-page">
      <button
        className="back-button"
        onClick={() => navigate(-1)}
        disabled={loading}
      >
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
        <div className="cow-photo-placeholder">🐄</div>
        <button className="photo-button" type="button" disabled>
          Photo upload coming next
        </button>
        <p>A photo makes it easier to identify each cow.</p>
      </section>

     <form
  className="cow-form-section"
  onSubmit={(event) => {
    event.preventDefault()
    void handleSave()
  }}
>
        <div className="form-field">
          <label htmlFor="cow-name">Cow name</label>
          <input
            id="cow-name"
            type="text"
            placeholder="e.g. Daisy"
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={100}
            required
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
            placeholder="e.g. 4 years or 18 months"
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
            step="1"
            inputMode="numeric"
            value={calves}
            onChange={(event) => setCalves(event.target.value)}
            required
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

        {message && (
          <p className="auth-message" role="alert">
            {message}
          </p>
        )}

        <button
          className="save-cow-button"
          type="submit"
          disabled={loading}
        >
          {loading ? "Saving cow..." : "Save cow"}
        </button>
      </form>
    </div>
  )
}

export default AddCow
