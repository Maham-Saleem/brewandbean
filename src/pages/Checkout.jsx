import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import './Checkout.css'

const STEPS = ['Cart', 'Login', 'Delivery', 'Payment', 'Confirmation']

function Checkout() {
  const { cartItems, updateQuantity, removeItem, subtotal, clearCart } = useCart()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)

  const [auth, setAuth] = useState({ email: '', password: '', name: '', phone: '' })
  const [authMode, setAuthMode] = useState('login')
  const [loggedIn, setLoggedIn] = useState(false)
  const [authError, setAuthError] = useState('')

  const [delivery, setDelivery] = useState({ method: 'pickup', street: '', city: '', zip: '', instructions: '' })

  const [payment, setPayment] = useState('')
  const [card, setCardState] = useState({ number: '', expiry: '', cvv: '' })

  const [orderNum, setOrderNum] = useState('')
  const [placed, setPlaced] = useState(false)

  const deliveryFee = delivery.method === 'delivery' ? 3.50 : 0
  const tax = subtotal * 0.08
  const total = subtotal + tax + deliveryFee

  const canProceedFrom = {
    0: cartItems.length > 0,
    1: loggedIn,
    2: delivery.method === 'pickup' || (delivery.street && delivery.city && delivery.zip),
    3: payment === 'cash' || payment === 'card',
  }

  const goNext = () => setStep(s => Math.min(s + 1, STEPS.length - 1))
  const goBack = () => setStep(s => Math.max(s - 1, 0))

  const handleAuth = (e) => {
    e.preventDefault()
    setAuthError('')
    if (authMode === 'login') {
      if (!auth.email || !auth.password) { setAuthError('Please fill in all fields.'); return }
    } else {
      if (!auth.name || !auth.email || !auth.phone || !auth.password) { setAuthError('Please fill in all fields.'); return }
    }
    setLoggedIn(true)
    goNext()
  }

  const handlePlaceOrder = () => {
    const num = 'BB' + Date.now().toString().slice(-8)
    setOrderNum(num)
    setPlaced(true)
    setStep(4)
  }

  const handleNewOrder = () => {
    clearCart()
    navigate('/menu')
  }

  if (cartItems.length === 0 && !placed) {
    return (
      <div className="checkout-page">
        <div className="section">
          <div className="container checkout-empty">
            <div className="checkout-empty-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#8B5E3C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            </div>
            <h2>Your cart is empty</h2>
            <p>Add some items from our menu before checking out.</p>
            <button className="btn btn-primary" onClick={() => navigate('/menu')}>Browse Menu</button>
          </div>
        </div>
      </div>
    )
  }

  const renderProgress = () => (
    <div className="checkout-progress">
      {STEPS.slice(0, -1).map((label, i) => (
        <div className={`progress-step ${i < step ? 'done' : ''} ${i === step ? 'active' : ''}`} key={i}>
          <div className="progress-circle">{i < step ? '✓' : i + 1}</div>
          <span className="progress-label">{label}</span>
        </div>
      ))}
    </div>
  )

  const renderCartStep = () => (
    <div className="checkout-step fade-in">
      <h2 className="step-title">Review Your Order</h2>
      <p className="step-subtitle">Adjust quantities or remove items before proceeding.</p>
      <div className="cart-step-items">
        {cartItems.map(item => (
          <div className="cart-step-item" key={item.id}>
            <img src={item.image} alt={item.name} />
            <div className="cart-step-info">
              <h4>{item.name}</h4>
              <p className="cart-step-unit-price">${item.priceNum.toFixed(2)} each</p>
            </div>
            <div className="cart-step-qty">
              <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>−</button>
              <span>{item.quantity}</span>
              <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
            </div>
            <span className="cart-step-line-total">${(item.priceNum * item.quantity).toFixed(2)}</span>
            <button className="cart-step-remove" onClick={() => removeItem(item.id)} title="Remove item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        ))}
      </div>
      <div className="cart-step-totals">
        <div className="total-row"><span>Subtotal</span><strong>${subtotal.toFixed(2)}</strong></div>
        <div className="total-row"><span>Tax (8%)</span><strong>${tax.toFixed(2)}</strong></div>
        <div className="total-row"><span>Delivery</span><strong>{deliveryFee === 0 ? 'Free' : `$${deliveryFee.toFixed(2)}`}</strong></div>
        <div className="total-row grand"><span>Total</span><strong>${total.toFixed(2)}</strong></div>
      </div>
      <div className="step-actions">
        <button className="btn btn-primary" onClick={goNext} disabled={!canProceedFrom[0]}>Proceed to Checkout</button>
      </div>
    </div>
  )

  const renderLoginStep = () => (
    <div className="checkout-step fade-in">
      <h2 className="step-title">{authMode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
      <p className="step-subtitle">{authMode === 'login' ? 'Sign in to continue your order.' : 'Quick sign-up — just a few details.'}</p>

      <div className="auth-tabs">
        <button className={`auth-tab ${authMode === 'login' ? 'active' : ''}`} onClick={() => setAuthMode('login')}>Sign In</button>
        <button className={`auth-tab ${authMode === 'signup' ? 'active' : ''}`} onClick={() => setAuthMode('signup')}>Sign Up</button>
      </div>

      <form className="checkout-form" onSubmit={handleAuth}>
        {authMode === 'signup' && (
          <div className="form-group">
            <label htmlFor="auth-name">Full Name</label>
            <input type="text" id="auth-name" value={auth.name} onChange={e => setAuth({ ...auth, name: e.target.value })} placeholder="Jane Doe" required />
          </div>
        )}
        <div className="form-group">
          <label htmlFor="auth-email">Email</label>
          <input type="email" id="auth-email" value={auth.email} onChange={e => setAuth({ ...auth, email: e.target.value })} placeholder="jane@example.com" required />
        </div>
        {authMode === 'signup' && (
          <div className="form-group">
            <label htmlFor="auth-phone">Phone Number</label>
            <input type="tel" id="auth-phone" value={auth.phone} onChange={e => setAuth({ ...auth, phone: e.target.value })} placeholder="(555) 123-4567" required />
          </div>
        )}
        <div className="form-group">
          <label htmlFor="auth-password">Password</label>
          <input type="password" id="auth-password" value={auth.password} onChange={e => setAuth({ ...auth, password: e.target.value })} placeholder="••••••••" required />
        </div>
        {authError && <p className="auth-error">{authError}</p>}
        <div className="step-actions">
          <button type="button" className="btn btn-outline" onClick={goBack}>Back</button>
          <button type="submit" className="btn btn-primary">{authMode === 'login' ? 'Sign In' : 'Create Account'}</button>
        </div>
      </form>
    </div>
  )

  const renderDeliveryStep = () => (
    <div className="checkout-step fade-in">
      <h2 className="step-title">Delivery Method</h2>
      <p className="step-subtitle">Choose how you'd like to receive your order.</p>

      <div className="delivery-toggle">
        <button className={`delivery-option ${delivery.method === 'pickup' ? 'active' : ''}`} onClick={() => setDelivery({ ...delivery, method: 'pickup' })}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <div><strong>Pickup</strong><span>Free · Ready in 15 min</span></div>
        </button>
        <button className={`delivery-option ${delivery.method === 'delivery' ? 'active' : ''}`} onClick={() => setDelivery({ ...delivery, method: 'delivery' })}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
          <div><strong>Delivery</strong><span>$3.50 · 30–45 min</span></div>
        </button>
      </div>

      {delivery.method === 'delivery' && (
        <div className="delivery-address fade-in">
          <h3>Delivery Address</h3>
          <form className="checkout-form" onSubmit={e => { e.preventDefault(); goNext() }}>
            <div className="form-group">
              <label htmlFor="street">Street Address</label>
              <input type="text" id="street" value={delivery.street} onChange={e => setDelivery({ ...delivery, street: e.target.value })} placeholder="123 Coffee Lane" required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input type="text" id="city" value={delivery.city} onChange={e => setDelivery({ ...delivery, city: e.target.value })} placeholder="Bean City" required />
              </div>
              <div className="form-group">
                <label htmlFor="zip">Postal Code</label>
                <input type="text" id="zip" value={delivery.zip} onChange={e => setDelivery({ ...delivery, zip: e.target.value })} placeholder="12345" required />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="instructions">Delivery Instructions <span className="optional">(optional)</span></label>
              <textarea id="instructions" value={delivery.instructions} onChange={e => setDelivery({ ...delivery, instructions: e.target.value })} rows={2} placeholder="Leave at the door, gate code, etc." />
            </div>
            <div className="step-actions">
              <button type="button" className="btn btn-outline" onClick={goBack}>Back</button>
              <button type="submit" className="btn btn-primary" disabled={!canProceedFrom[2]}>Continue to Payment</button>
            </div>
          </form>
        </div>
      )}

      {delivery.method === 'pickup' && (
        <div className="step-actions">
          <button type="button" className="btn btn-outline" onClick={goBack}>Back</button>
          <button className="btn btn-primary" onClick={goNext}>Continue to Payment</button>
        </div>
      )}
    </div>
  )

  const renderPaymentStep = () => (
    <div className="checkout-step fade-in">
      <h2 className="step-title">Payment Method</h2>
      <p className="step-subtitle">Select how you'd like to pay.</p>

      <div className="payment-options">
        <button className={`payment-option ${payment === 'cash' ? 'active' : ''}`} onClick={() => setPayment('cash')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>
          <div>
            <strong>{delivery.method === 'delivery' ? 'Cash on Delivery' : 'Cash on Pickup'}</strong>
            <span>Pay when you {delivery.method === 'delivery' ? 'receive your order' : 'pick up'}</span>
          </div>
        </button>
        <button className={`payment-option ${payment === 'card' ? 'active' : ''}`} onClick={() => setPayment('card')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
          <div>
            <strong>Credit / Debit Card</strong>
            <span>Demo — no real payment processed</span>
          </div>
        </button>
      </div>

      {payment === 'card' && (
        <div className="card-form fade-in">
          <h3>Card Details</h3>
          <div className="checkout-form">
            <div className="form-group">
              <label htmlFor="card-number">Card Number</label>
              <input type="text" id="card-number" value={card.number} onChange={e => setCardState({ ...card, number: e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19) })} placeholder="4242 4242 4242 4242" required={payment === 'card'} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="card-expiry">Expiry Date</label>
                <input type="text" id="card-expiry" value={card.expiry} onChange={e => { let v = e.target.value.replace(/\D/g, '').slice(0, 4); if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2); setCardState({ ...card, expiry: v }) }} placeholder="MM/YY" required={payment === 'card'} />
              </div>
              <div className="form-group">
                <label htmlFor="card-cvv">CVV</label>
                <input type="text" id="card-cvv" value={card.cvv} onChange={e => setCardState({ ...card, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) })} placeholder="123" required={payment === 'card'} />
              </div>
            </div>
          </div>
        </div>
      )}

      {payment && (
        <div className="step-actions">
          <button type="button" className="btn btn-outline" onClick={goBack}>Back</button>
          <button className="btn btn-primary" onClick={goNext} disabled={!canProceedFrom[3]}>Review Order</button>
        </div>
      )}
    </div>
  )

  const renderConfirmationStep = () => {
    if (!placed) {
      return (
        <div className="checkout-step fade-in">
          <h2 className="step-title">Order Summary</h2>
          <p className="step-subtitle">Please review your order before placing it.</p>

          <div className="summary-card">
            <h3>Items</h3>
            {cartItems.map(item => (
              <div className="summary-line" key={item.id}>
                <span>{item.name} × {item.quantity}</span>
                <strong>${(item.priceNum * item.quantity).toFixed(2)}</strong>
              </div>
            ))}
          </div>

          <div className="summary-card">
            <h3>Details</h3>
            <div className="summary-line"><span>Contact</span><strong>{auth.name || auth.email}</strong></div>
            <div className="summary-line"><span>Method</span><strong>{delivery.method === 'pickup' ? 'Pickup' : 'Delivery'}</strong></div>
            {delivery.method === 'delivery' && (
              <div className="summary-line"><span>Address</span><strong>{delivery.street}, {delivery.city} {delivery.zip}</strong></div>
            )}
            <div className="summary-line"><span>Payment</span><strong>{payment === 'cash' ? 'Cash' : 'Card'}</strong></div>
          </div>

          <div className="summary-totals">
            <div className="total-row"><span>Subtotal</span><strong>${subtotal.toFixed(2)}</strong></div>
            <div className="total-row"><span>Tax</span><strong>${tax.toFixed(2)}</strong></div>
            <div className="total-row"><span>Delivery</span><strong>{deliveryFee === 0 ? 'Free' : `$${deliveryFee.toFixed(2)}`}</strong></div>
            <div className="total-row grand"><span>Total</span><strong>${total.toFixed(2)}</strong></div>
          </div>

          <div className="step-actions">
            <button type="button" className="btn btn-outline" onClick={goBack}>Back</button>
            <button className="btn btn-primary" onClick={handlePlaceOrder}>Place Order — ${total.toFixed(2)}</button>
          </div>
        </div>
      )
    }

    return (
      <div className="checkout-step confirmation-step fade-in">
        <div className="confirmation-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        </div>
        <h2 className="step-title">Order Confirmed!</h2>
        <p className="step-subtitle">Thank you for your order. Our team will contact you shortly.</p>
        <div className="order-number">
          <span>Order Number</span>
          <strong>{orderNum}</strong>
        </div>
        <div className="confirm-details">
          <p><strong>Name:</strong> {auth.name || auth.email}</p>
          <p><strong>Method:</strong> {delivery.method === 'pickup' ? 'Pickup' : 'Delivery'}</p>
          {delivery.method === 'delivery' && <p><strong>Address:</strong> {delivery.street}, {delivery.city} {delivery.zip}</p>}
          <p><strong>Payment:</strong> {payment === 'cash' ? 'Cash' : 'Card'}</p>
        </div>
        <button className="btn btn-primary" onClick={handleNewOrder}>Place New Order</button>
      </div>
    )
  }

  return (
    <div className="checkout-page">
      <section className="section section--compact">
        <div className="container">
          {renderProgress()}
          <div className="checkout-content">
            {step === 0 && renderCartStep()}
            {step === 1 && renderLoginStep()}
            {step === 2 && renderDeliveryStep()}
            {step === 3 && renderPaymentStep()}
            {step >= 4 && renderConfirmationStep()}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Checkout
