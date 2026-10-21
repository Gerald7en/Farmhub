
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../../services/supabase"

function SetupFarm() {
  const navigate = useNavigate()

  const [farmName, setFarmName] = useState("")
  const [purpose, setPurpose] = useState("MIXED")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession()

      if (sessionError) throw sessionError

      if (!sessionData.session) {
        setMessage("Please sign in before creating your farm.")
        navigate("/auth")
        return
      }

      const { data, error } = await supabase.rpc(
        "create_farm_for_current_user",
        {
          p_name: farmName.trim(),
          p_purpose: purpose,
        }
      )

      if (error) throw error

      console.log("Farm created:", data)
      navigate("/home", { replace: true })
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not create the farm. Please try again."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-brand">
        <div className="auth-logo">F</div>
        <span>FARMHUB</span>
      </div>

      <div className="auth-heading">
        <p className="eyebrow">LET'S GET STARTED</p>
        <h1>Set up your farm.</h1>
        <p>Give your farm a name and tell us how it's used.</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="farm-name">Farm name</label>
          <input
            id="farm-name"
            value={farmName}
            onChange={(event) => setFarmName(event.target.value)}
            placeholder="e.g. Mum's Farm"
            maxLength={100}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="farm-purpose">Farm purpose</label>
          <select
            id="farm-purpose"
            value={purpose}
            onChange={(event) => setPurpose(event.target.value)}
          >
            <option value="DOMESTIC">
              Domestic / family use
            </option>
            <option value="INCOME_GENERATING">
              Income generating
            </option>
            <option value="MIXED">
              Family use and income
            </option>
          </select>
        </div>

        {message && (
          <p className="auth-message" role="alert">
            {message}
          </p>
        )}

        <button
          className="auth-submit"
          type="submit"
          disabled={loading}
        >
          {loading ? "Creating farm..." : "Create farm"}
        </button>
      </form>
    </div>
  )
}

export default SetupFarm
