import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Login.css'

function Login() {
  const { login, signup, forgotPassword } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [error, setError] = useState('')
  const [forgotSent, setForgotSent] = useState(false)

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault(); setError('')
    const { name, email, phone, password } = form
    if (!email || !password) { setError('Email and password are required.'); return }
    if (mode === 'signup' && (!name || !phone)) { setError('Please fill in all fields.'); return }
    const result = mode === 'login' ? login(email, password) : signup(name, email, phone, password)
    if (!result.ok) { setError(result.error); return }
    navigate('/account')
  }

  const handleForgot = (e) => {
    e.preventDefault(); setError('')
    if (!form.email) { setError('Please enter your email.'); return }
    const result = forgotPassword(form.email)
    if (!result.ok) { setError(result.error); return }
    setForgotSent(true)
  }

  return (
    <div className="login-page">
      <section className="section">
        <div className="container">
          <div className="login-card fade-in">
            <h1 className="login-title">{mode === 'forgot' ? 'Forgot Password' : mode === 'login' ? 'Welcome Back' : 'Create Account'}</h1>
            <p className="login-subtitle">
              {mode === 'forgot' ? 'Enter your email to receive a reset link.' : mode === 'login' ? 'Sign in to your Brew & Bean account.' : 'Quick sign-up — just a few details.'}
            </p>

            {mode !== 'forgot' && (
              <div className="login-tabs">
                <button className={`login-tab ${mode === 'login' ? 'active' : ''}`} onClick={() => { setMode('login'); setError(''); setForgotSent(false) }}>Sign In</button>
                <button className={`login-tab ${mode === 'signup' ? 'active' : ''}`} onClick={() => { setMode('signup'); setError(''); setForgotSent(false) }}>Sign Up</button>
              </div>
            )}

            <form onSubmit={mode === 'forgot' ? handleForgot : handleSubmit}>
              {mode === 'signup' && (
                <div className="lo-fg">
                  <label>Full Name</label>
                  <input type="text" name="name" value={form.name} onChange={update} placeholder="Jane Doe" required />
                </div>
              )}
              <div className="lo-fg">
                <label>Email Address</label>
                <input type="email" name="email" value={form.email} onChange={update} placeholder="jane@example.com" required />
              </div>
              {mode === 'signup' && (
                <div className="lo-fg">
                  <label>Phone Number</label>
                  <input type="tel" name="phone" value={form.phone} onChange={update} placeholder="(555) 123-4567" required />
                </div>
              )}
              {mode !== 'forgot' && (
                <div className="lo-fg">
                  <label>Password</label>
                  <input type="password" name="password" value={form.password} onChange={update} placeholder="••••••••" required />
                </div>
              )}
              {error && <p className="lo-error">{error}</p>}
              {forgotSent && <p className="lo-success">✓ Password reset link sent to your email.</p>}
              <div className="lo-actions">
                {mode === 'login' && (
                  <button type="button" className="lo-link-btn" onClick={() => { setMode('forgot'); setError(''); setForgotSent(false) }}>Forgot Password?</button>
                )}
                <button type="submit" className="btn btn-primary">
                  {mode === 'forgot' ? 'Send Reset Link' : mode === 'login' ? 'Sign In' : 'Create Account'}
                </button>
              </div>
              {mode === 'forgot' && (
                <button type="button" className="lo-link-btn" onClick={() => setMode('login')}>Back to Sign In</button>
              )}
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Login
