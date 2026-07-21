import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import './Checkout.css'

const STEPS = ['Cart', 'Login', 'Delivery', 'Review', 'Payment', 'Confirmation']
const PICKUP_INFO = {
  address: '42 Brew Street, Bean City, BC 12345',
  hours: 'Mon–Sun: 7:00 AM – 9:00 PM',
  prepTime: '15–20 minutes',
}

const SVG_ICONS = {
  home: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  truck: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
  cash: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>,
  card: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  zap: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  dollar: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  check: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  plus: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  trash: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  truckArrive: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/><line x1="23" y1="13" x2="16" y2="13"/></svg>,
}

function Checkout() {
  const { cartItems, updateQuantity, removeItem, subtotal, clearCart } = useCart()
  const { currentUser, login, signup, forgotPassword, addAddress, removeAddress, setDefaultAddress, addOrder } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)

  /* ── Auth state ── */
  const [authMode, setAuthMode] = useState('login')
  const [authForm, setAuthForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [authError, setAuthError] = useState('')
  const [forgotSent, setForgotSent] = useState(false)

  /* ── Delivery state ── */
  const [method, setMethod] = useState('pickup')
  const [selectedAddrId, setSelectedAddrId] = useState(null)
  const [showNewAddr, setShowNewAddr] = useState(false)
  const [newAddr, setNewAddr] = useState({ label: '', street: '', city: '', zip: '', instructions: '', setAsDefault: false })

  /* ── Payment state ── */
  const [payment, setPayment] = useState('')
  const [cardForm, setCardForm] = useState({ number: '', expiry: '', cvv: '' })

  /* ── Order state ── */
  const [orderNum, setOrderNum] = useState('')
  const [placed, setPlaced] = useState(false)

  /* Derived */
  const deliveryFee = method === 'delivery' ? 3.50 : 0
  const tax = subtotal * 0.08
  const total = subtotal + tax + deliveryFee
  const savedAddresses = currentUser?.addresses || []

  /* Skip auth step if already logged in */
  useEffect(() => {
    if (currentUser && step === 0) setStep(1)
  }, [currentUser])

  const getSelectedAddress = () => {
    if (method !== 'delivery') return null
    return savedAddresses.find(a => a.id === selectedAddrId) || null
  }

  const updateField = (obj, setter) => (e) => setter({ ...obj, [e.target.name]: e.target.value })

  /* ── Auth handlers ── */
  const handleAuth = (e) => {
    e.preventDefault(); setAuthError('')
    const { name, email, phone, password } = authForm
    if (!email || !password) { setAuthError('Email and password are required.'); return }
    if (authMode === 'signup' && (!name || !phone)) { setAuthError('Please fill in all fields.'); return }
    const result = authMode === 'login' ? login(email, password) : signup(name, email, phone, password)
    if (!result.ok) { setAuthError(result.error); return }
    if (authMode === 'signup') authForm.name = ''; authForm.phone = ''
    setStep(1)
  }

  const handleForgotPassword = (e) => {
    e.preventDefault(); setAuthError('')
    const { email } = authForm
    if (!email) { setAuthError('Please enter your email.'); return }
    const result = forgotPassword(email)
    if (!result.ok) { setAuthError(result.error); return }
    setForgotSent(true)
  }

  const switchAuthMode = (mode) => {
    setAuthMode(mode); setAuthError(''); setForgotSent(false)
  }

  /* ── Address handlers ── */
  const handleAddAddress = (e) => {
    e.preventDefault()
    if (!newAddr.street || !newAddr.city || !newAddr.zip) return
    const addr = addAddress({
      label: `${newAddr.street}, ${newAddr.city}`,
      street: newAddr.street,
      city: newAddr.city,
      zip: newAddr.zip,
      instructions: newAddr.instructions,
    })
    if (newAddr.setAsDefault) setDefaultAddress(addr.id)
    setSelectedAddrId(addr.id)
    setShowNewAddr(false)
    setNewAddr({ label: '', street: '', city: '', zip: '', instructions: '', setAsDefault: false })
  }

  const handleSelectAddress = (id) => {
    setSelectedAddrId(id)
  }

  /* ── Navigation ── */
  const goNext = () => {
    if (step === 0 && !currentUser) return
    setStep(s => Math.min(s + 1, STEPS.length - 1))
  }
  const goBack = () => setStep(s => Math.max(s - 1, 0))

  const isStepComplete = () => {
    switch (step) {
      case 0: return !!currentUser
      case 1: return true
      case 2: return method === 'pickup' || !!getSelectedAddress()
      case 3: return cartItems.length > 0
      case 4: return !!payment
      default: return true
    }
  }

  /* ── Place Order ── */
  const handlePlaceOrder = () => {
    const num = 'BB' + Date.now().toString().slice(-8)
    setOrderNum(num)
    setPlaced(true)
    const address = getSelectedAddress()
    addOrder({
      orderNumber: num,
      items: cartItems,
      subtotal,
      tax,
      deliveryFee,
      total,
      method,
      payment,
      address,
      status: 'confirmed',
      estimatedTime: method === 'pickup' ? PICKUP_INFO.prepTime : '30–45 minutes',
    })
    clearCart()
    setStep(5)
  }

  const handleNewOrder = () => {
    clearCart(); navigate('/menu')
  }

  /* ── Empty cart ── */
  if (cartItems.length === 0 && !placed) {
    return (
      <div className="checkout-page">
        <div className="section">
          <div className="container checkout-empty">
            <div className="checkout-empty-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            </div>
            <h2>Your cart is empty</h2>
            <p>Add some items from our menu before checking out.</p>
            <button className="btn btn-primary" onClick={() => navigate('/menu')}>Browse Menu</button>
          </div>
        </div>
      </div>
    )
  }

  /* ── Progress ── */
  const renderProgress = () => (
    <div className="co-progress">
      {STEPS.map((label, i) => {
        let cls = 'co-step'
        const activeProgress = step + 1
        if (i === 0 && cartItems.length > 0) cls += ' done'
        else if (i === 0 && step === 0) cls += ' active'
        if (i === 1 && currentUser) cls += ' done'
        else if (i === 1 && step === 0) cls += ' active'
        if (i > 1) {
          if (i < activeProgress) cls += ' done'
          else if (i === activeProgress) cls += ' active'
        }
        return (
          <div className={cls} key={i}>
            <div className="co-step-dot">
              {cls.includes('done') ? SVG_ICONS.check : <span>{i + 1}</span>}
            </div>
            <span className="co-step-label">{label}</span>
          </div>
        )
      })}
    </div>
  )

  /* ── Step Renderers ── */

  const renderAuth = () => (
    <div className="co-card fade-in">
      <h2 className="co-title">{authMode === 'forgot' ? 'Forgot Password' : authMode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
      <p className="co-subtitle">{authMode === 'forgot' ? 'Enter your email to receive a reset link.' : authMode === 'login' ? 'Sign in to continue your order.' : 'Quick sign-up — just a few details.'}</p>

      {authMode !== 'forgot' && (
        <div className="co-auth-tabs">
          <button className={`co-auth-tab ${authMode === 'login' ? 'active' : ''}`} onClick={() => switchAuthMode('login')}>Sign In</button>
          <button className={`co-auth-tab ${authMode === 'signup' ? 'active' : ''}`} onClick={() => switchAuthMode('signup')}>Sign Up</button>
        </div>
      )}

      <form className="co-form" onSubmit={authMode === 'forgot' ? handleForgotPassword : handleAuth}>
        {authMode === 'signup' && (
          <div className="co-fg">
            <label>Full Name</label>
            <input type="text" name="name" value={authForm.name} onChange={updateField(authForm, setAuthForm)} placeholder="Jane Doe" required />
          </div>
        )}
        <div className="co-fg">
          <label>Email Address</label>
          <input type="email" name="email" value={authForm.email} onChange={updateField(authForm, setAuthForm)} placeholder="jane@example.com" required />
        </div>
        {authMode === 'signup' && (
          <div className="co-fg">
            <label>Phone Number</label>
            <input type="tel" name="phone" value={authForm.phone} onChange={updateField(authForm, setAuthForm)} placeholder="(555) 123-4567" required />
          </div>
        )}
        {authMode !== 'forgot' && (
          <div className="co-fg">
            <label>Password</label>
            <input type="password" name="password" value={authForm.password} onChange={updateField(authForm, setAuthForm)} placeholder="••••••••" required />
          </div>
        )}
        {authError && <p className="co-error">{authError}</p>}
        {forgotSent && <p className="co-success">✓ Password reset link sent to your email.</p>}
        <div className="co-actions">
          {authMode === 'login' && (
            <button type="button" className="co-link-btn" onClick={() => switchAuthMode('forgot')}>Forgot Password?</button>
          )}
          <button type="submit" className="btn btn-primary">
            {authMode === 'forgot' ? 'Send Reset Link' : authMode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </div>
        {authMode === 'forgot' && (
          <button type="button" className="co-link-btn" onClick={() => switchAuthMode('login')}>Back to Sign In</button>
        )}
      </form>
    </div>
  )

  const renderDeliveryMethod = () => (
    <div className="co-card fade-in">
      <h2 className="co-title">Delivery Method</h2>
      <p className="co-subtitle">Choose how you'd like to receive your order.</p>
      <div className="co-delivery-options">
        <button className={`co-delivery-card ${method === 'pickup' ? 'active' : ''}`} onClick={() => setMethod('pickup')}>
          {SVG_ICONS.home}
          <div><strong>Pickup</strong><span>Free · Ready in {PICKUP_INFO.prepTime}</span></div>
        </button>
        <button className={`co-delivery-card ${method === 'delivery' ? 'active' : ''}`} onClick={() => setMethod('delivery')}>
          {SVG_ICONS.truck}
          <div><strong>Delivery</strong><span>$3.50 · 30–45 min</span></div>
        </button>
      </div>
      <div className="co-actions" style={{ marginTop: '1.75rem' }}>
        <button className="btn btn-primary" onClick={goNext}>Continue</button>
      </div>
    </div>
  )

  const renderDetails = () => {
    if (method === 'pickup') {
      return (
        <div className="co-card fade-in">
          <h2 className="co-title">Pickup Details</h2>
          <p className="co-subtitle">Come grab your order at our café.</p>
          <div className="co-pickup-card">
            <div className="co-pickup-row">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-secondary)" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>{PICKUP_INFO.address}</span>
            </div>
            <div className="co-pickup-row">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-secondary)" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span>{PICKUP_INFO.hours}</span>
            </div>
            <div className="co-pickup-row">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-secondary)" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              <span>Estimated preparation: {PICKUP_INFO.prepTime}</span>
            </div>
          </div>
          <div className="co-actions">
            <button className="btn btn-outline" onClick={goBack}>Back</button>
            <button className="btn btn-primary" onClick={goNext}>Continue</button>
          </div>
        </div>
      )
    }

    return (
      <div className="co-card fade-in">
        <h2 className="co-title">Delivery Address</h2>
        <p className="co-subtitle">Where should we deliver your order?</p>

        {savedAddresses.length > 0 && (
          <div className="co-saved-addresses">
            {savedAddresses.map(addr => (
              <button key={addr.id} className={`co-addr-card ${selectedAddrId === addr.id ? 'active' : ''}`} onClick={() => handleSelectAddress(addr.id)}>
                <div className="co-addr-info">
                  <strong>{addr.label || `${addr.street}, ${addr.city}`}</strong>
                  <span>{addr.street}, {addr.city} {addr.zip}</span>
                  {addr.instructions && <span className="co-addr-instr">{addr.instructions}</span>}
                </div>
                {selectedAddrId === addr.id && <span className="co-addr-check">{SVG_ICONS.check}</span>}
              </button>
            ))}
          </div>
        )}

        <button className="co-new-addr-btn" onClick={() => setShowNewAddr(!showNewAddr)}>
          {SVG_ICONS.plus} {showNewAddr ? 'Cancel' : 'Add New Address'}
        </button>

        {showNewAddr && (
          <form className="co-form" onSubmit={handleAddAddress}>
            <div className="co-profile-banner">
              <div className="co-profile-banner-avatar">{currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : currentUser?.email?.charAt(0).toUpperCase()}</div>
              <div className="co-profile-banner-info">
                <strong>{currentUser?.name || 'User'}</strong>
                <span>{currentUser?.phone || 'No phone on file'} · {currentUser?.email}</span>
              </div>
            </div>
            <div className="co-fg">
              <label>Street Address</label>
              <input type="text" name="street" value={newAddr.street} onChange={updateField(newAddr, setNewAddr)} placeholder="123 Coffee Lane" required />
            </div>
            <div className="co-form-row">
              <div className="co-fg">
                <label>City</label>
                <input type="text" name="city" value={newAddr.city} onChange={updateField(newAddr, setNewAddr)} placeholder="Bean City" required />
              </div>
              <div className="co-fg">
                <label>Postal Code</label>
                <input type="text" name="zip" value={newAddr.zip} onChange={updateField(newAddr, setNewAddr)} placeholder="12345" required />
              </div>
            </div>
            <div className="co-fg">
              <label>Delivery Instructions <span className="co-optional">(optional)</span></label>
              <textarea name="instructions" value={newAddr.instructions} onChange={updateField(newAddr, setNewAddr)} rows={2} placeholder="Gate code, landmark, etc." />
            </div>
            <label className="co-checkbox">
              <input type="checkbox" checked={newAddr.setAsDefault} onChange={e => setNewAddr({ ...newAddr, setAsDefault: e.target.checked })} />
              <span>Set as default address</span>
            </label>
            <button type="submit" className="btn btn-primary">Save Address</button>
          </form>
        )}

        <div className="co-actions">
          <button className="btn btn-outline" onClick={goBack}>Back</button>
          <button className="btn btn-primary" onClick={goNext} disabled={!getSelectedAddress()}>Continue</button>
        </div>
      </div>
    )
  }

  const renderReview = () => (
    <div className="co-card fade-in">
      <h2 className="co-title">Order Review</h2>
      <p className="co-subtitle">Adjust quantities or remove items before proceeding.</p>
      <div className="co-review-items">
        {cartItems.map(item => (
          <div className="co-review-item" key={item.id}>
            <img src={item.image} alt={item.name} />
            <div className="co-review-info">
              <h4>{item.name}</h4>
              {item.isOffer && <span className="co-offer-badge">Today's Special</span>}
              <span className="co-unit-price">${item.priceNum.toFixed(2)} each</span>
            </div>
            <div className="co-review-qty">
              <button className="co-qty-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>−</button>
              <span>{item.quantity}</span>
              <button className="co-qty-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
            </div>
            <span className="co-review-total">${(item.priceNum * item.quantity).toFixed(2)}</span>
            <button className="co-review-remove" onClick={() => removeItem(item.id)} title="Remove item">{SVG_ICONS.trash}</button>
          </div>
        ))}
      </div>
      <div className="co-summary">
        <div className="co-summary-row">
          <div className="co-summary-info">
            <span className="co-summary-label">Contact</span>
            <span className="co-summary-value">{currentUser?.name || currentUser?.email}</span>
          </div>
        </div>
        <div className="co-summary-row">
          <div className="co-summary-info">
            <span className="co-summary-label">Method</span>
            <span className="co-summary-value">{method === 'pickup' ? 'Pickup' : 'Delivery'}</span>
          </div>
        </div>
        {method === 'delivery' && getSelectedAddress() && (
          <div className="co-summary-row">
            <div className="co-summary-info">
              <span className="co-summary-label">Deliver to</span>
              <span className="co-summary-value">{getSelectedAddress().street}, {getSelectedAddress().city} {getSelectedAddress().zip}</span>
            </div>
          </div>
        )}
      </div>
      <div className="co-totals">
        <div className="co-total-row"><span>Subtotal</span><strong>${subtotal.toFixed(2)}</strong></div>
        <div className="co-total-row"><span>Tax (8%)</span><strong>${tax.toFixed(2)}</strong></div>
        <div className="co-total-row"><span>Delivery</span><strong>{deliveryFee === 0 ? 'Free' : `$${deliveryFee.toFixed(2)}`}</strong></div>
        <div className="co-total-row co-total-grand"><span>Total</span><strong>${total.toFixed(2)}</strong></div>
      </div>
      <div className="co-actions">
        <button className="btn btn-outline" onClick={goBack}>Back</button>
        <button className="btn btn-primary" onClick={goNext} disabled={cartItems.length === 0}>Continue to Payment</button>
      </div>
    </div>
  )

  const renderPayment = () => {
    const isDelivery = method === 'delivery'
    const cashLabel = isDelivery ? 'Cash on Delivery' : 'Cash on Pickup'
    const cashDesc = isDelivery ? 'Pay when your order arrives' : 'Pay when you pick up'

    const paymentOptions = [
      { id: 'cash', label: cashLabel, desc: cashDesc, icon: SVG_ICONS.cash },
      { id: 'card', label: 'Credit / Debit Card', desc: 'Secure payment via card', icon: SVG_ICONS.card },
      { id: 'jazzcash', label: 'JazzCash', desc: 'Pay with your JazzCash account', icon: SVG_ICONS.zap },
      { id: 'easypaisa', label: 'EasyPaisa', desc: 'Pay with your EasyPaisa account', icon: SVG_ICONS.dollar },
    ]

    return (
      <div className="co-card fade-in">
        <h2 className="co-title">Payment Method</h2>
        <p className="co-subtitle">Select how you'd like to pay.</p>
        <div className="co-payment-options">
          {paymentOptions.map(opt => (
            <button key={opt.id} className={`co-payment-card ${payment === opt.id ? 'active' : ''}`} onClick={() => setPayment(opt.id)}>
              {opt.icon}
              <div><strong>{opt.label}</strong><span>{opt.desc}</span></div>
              {payment === opt.id && <span className="co-pay-check">{SVG_ICONS.check}</span>}
            </button>
          ))}
        </div>
        {payment === 'card' && (
          <div className="co-card-form fade-in">
            <h3 className="co-card-form-title">Card Details</h3>
            <div className="co-form">
              <div className="co-fg">
                <label>Card Number</label>
                <input type="text" value={cardForm.number} onChange={e => setCardForm({ ...cardForm, number: e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19) })} placeholder="4242 4242 4242 4242" />
              </div>
              <div className="co-form-row">
                <div className="co-fg">
                  <label>Expiry Date</label>
                  <input type="text" value={cardForm.expiry} onChange={e => { let v = e.target.value.replace(/\D/g, '').slice(0, 4); if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2); setCardForm({ ...cardForm, expiry: v }) }} placeholder="MM/YY" />
                </div>
                <div className="co-fg">
                  <label>CVV</label>
                  <input type="text" value={cardForm.cvv} onChange={e => setCardForm({ ...cardForm, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) })} placeholder="123" />
                </div>
              </div>
            </div>
          </div>
        )}
        {payment && (
          <div className="co-actions">
            <button className="btn btn-outline" onClick={goBack}>Back</button>
            <button className="btn btn-primary" onClick={goNext}>Review Order</button>
          </div>
        )}
      </div>
    )
  }

  const renderConfirmation = () => {
    if (!placed) {
      return (
        <div className="co-card fade-in">
          <h2 className="co-title">Order Summary</h2>
          <p className="co-subtitle">Please review before placing your order.</p>
          <div className="co-summary-card">
            <h3>Items</h3>
            {cartItems.map(item => (
              <div className="co-summary-line" key={item.id}>
                <span>{item.name} × {item.quantity}</span>
                <strong>${(item.priceNum * item.quantity).toFixed(2)}</strong>
              </div>
            ))}
          </div>
          <div className="co-summary-card">
            <h3>Details</h3>
            <div className="co-summary-line"><span>Contact</span><strong>{currentUser?.name || currentUser?.email}</strong></div>
            <div className="co-summary-line"><span>Method</span><strong>{method === 'pickup' ? 'Pickup' : 'Delivery'}</strong></div>
            {method === 'delivery' && getSelectedAddress() && (
              <div className="co-summary-line"><span>Address</span><strong>{getSelectedAddress().street}, {getSelectedAddress().city} {getSelectedAddress().zip}</strong></div>
            )}
            <div className="co-summary-line"><span>Payment</span><strong>{paymentOptions.find(p => p.id === payment)?.label || payment}</strong></div>
          </div>
          <div className="co-totals">
            <div className="co-total-row"><span>Subtotal</span><strong>${subtotal.toFixed(2)}</strong></div>
            <div className="co-total-row"><span>Tax</span><strong>${tax.toFixed(2)}</strong></div>
            <div className="co-total-row"><span>Delivery</span><strong>{deliveryFee === 0 ? 'Free' : `$${deliveryFee.toFixed(2)}`}</strong></div>
            <div className="co-total-row co-total-grand"><span>Total</span><strong>${total.toFixed(2)}</strong></div>
          </div>
          <div className="co-actions">
            <button className="btn btn-outline" onClick={goBack}>Back</button>
            <button className="btn btn-primary co-place-btn" onClick={handlePlaceOrder}>Place Order — ${total.toFixed(2)}</button>
          </div>
        </div>
      )
    }

    const address = getSelectedAddress()
    return (
      <div className="co-card co-confirmation fade-in">
        <div className="co-confirm-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        </div>
        <h2 className="co-title">Order Confirmed</h2>
        <p className="co-subtitle">Thank you for your order. Our team will contact you shortly.</p>
        <div className="co-order-num">
          <span>Order Number</span>
          <strong>{orderNum}</strong>
        </div>
        <div className="co-confirm-details">
          <div className="co-confirm-row">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-secondary)" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <div><span>Name</span><strong>{currentUser?.name || currentUser?.email}</strong></div>
          </div>
          <div className="co-confirm-row">
            {method === 'pickup' ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-secondary)" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            ) : SVG_ICONS.truckArrive}
            <div><span>Method</span><strong>{method === 'pickup' ? 'Pickup' : 'Delivery'}</strong></div>
          </div>
          {method === 'pickup' ? (
            <div className="co-confirm-row">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-secondary)" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <div><span>Estimated</span><strong>{PICKUP_INFO.prepTime}</strong></div>
            </div>
          ) : (
            <>
              <div className="co-confirm-row">
                {SVG_ICONS.truckArrive}
                <div><span>Estimated</span><strong>30–45 minutes</strong></div>
              </div>
              <div className="co-confirm-row">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-secondary)" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <div><span>Address</span><strong>{address?.street}, {address?.city} {address?.zip}</strong></div>
              </div>
            </>
          )}
          <div className="co-confirm-row">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-secondary)" strokeWidth="1.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            <div><span>Total Charged</span><strong>${total.toFixed(2)}</strong></div>
          </div>
        </div>
        <button className="btn btn-primary" onClick={handleNewOrder}>Place New Order</button>
      </div>
    )
  }

  const paymentOptions = [
    { id: 'cash', label: 'Cash', desc: '' },
    { id: 'card', label: 'Card', desc: '' },
    { id: 'jazzcash', label: 'JazzCash', desc: '' },
    { id: 'easypaisa', label: 'EasyPaisa', desc: '' },
  ]

  return (
    <div className="checkout-page">
      <section className="section section--compact">
        <div className="container">
          {renderProgress()}
          <div className="co-content">
            {step === 0 && !currentUser && renderAuth()}
            {step >= 1 && currentUser && step === 1 && renderDeliveryMethod()}
            {step >= 1 && currentUser && step === 2 && renderDetails()}
            {step >= 1 && currentUser && step === 3 && renderReview()}
            {step >= 1 && currentUser && step === 4 && renderPayment()}
            {step >= 1 && currentUser && step >= 5 && renderConfirmation()}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Checkout
