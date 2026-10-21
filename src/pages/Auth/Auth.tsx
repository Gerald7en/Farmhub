
import { useState } from "react"
import { supabase } from "../../services/supabase"
import { useNavigate } from "react-router-dom"


function Auth() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const navigate = useNavigate()


  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name.trim(),
            },
          },
        })

        if (error) throw error

        if (data.session) {
          setMessage("Account created successfully!")
        } else {
          setMessage(
            "Account created. Check your email to confirm your account."
          )
        }
      } else {
   const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
})

if (error) throw error

if (data.session) {
  navigate("/home", { replace: true })
} else {
  setMessage("Sign-in succeeded, but no session was returned.")
}

      }
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
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
        <p className="eyebrow">YOUR FARM, CONNECTED</p>

        <h1>
          {isSignUp ? "Create your account." : "Welcome back."}
        </h1>

        <p>
          {isSignUp
            ? "Let's bring your farm into one place."
            : "Everything about your farm, right where you need it."}
        </p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        {isSignUp && (
          <div className="form-field">
            <label htmlFor="full-name">Full name</label>

            <input
              id="full-name"
              type="text"
              autoComplete="name"
              placeholder="Your name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>
        )}

        <div className="form-field">
          <label htmlFor="email">Email address</label>

          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="password">Password</label>

          <input
            id="password"
            type="password"
            autoComplete={
              isSignUp ? "new-password" : "current-password"
            }
            placeholder={
              isSignUp ? "At least 8 characters" : "Your password"
            }
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        {message && (
          <p className="auth-message" role="status">
            {message}
          </p>
        )}

        <button
          className="auth-submit"
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Please wait..."
            : isSignUp
              ? "Create account"
              : "Sign in"}
        </button>
      </form>

      <div className="auth-switch">
        <span>
          {isSignUp
            ? "Already have an account?"
            : "New to FarmHub?"}
        </span>

        <button
          type="button"
          onClick={() => {
            setIsSignUp(!isSignUp)
            setMessage("")
          }}
        >
          {isSignUp ? "Sign in" : "Create account"}
        </button>
      </div>

      <p className="auth-footer">
        A little closer to everything happening on your farm.
      </p>
    </div>
  )
}

export default Auth
