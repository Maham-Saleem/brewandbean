import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import './Checkout.css'

function Checkout() {
  const { cartItems, subtotal, clearCart } = useCart()
  const navigate = useNavigate()
  const [orderType, setOrderType] = useState('pickup')
  const [form, setForm] = useState({ name: '', phone: '', address: '' })
  const [placed, setPlaced] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setPlaced(true)
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
            <h2>Your cart is empty</h2>
            <p>Add some items from our menu before checking out.</p>
            <button className="btn btn-primary" onClick={() => navigate('/menu')}>Browse Menu</button>
          </div>
        </div>
      </div>
    )
  }

  if (placed) {
    return (
      <div className="checkout-page">
        <section className="page-hero checkout-hero">
          <div className="container page-hero-content">
            <h1>Order Confirmed</h1>
            <p>Thank you for your order!</p>
          </div>
        </section>
        <div className="section">
          <div className="container checkout-confirmed">
            <div className="confirmed-icon">✓</div>
            <h2>Your order has been placed!</h2>
            <p>We'll have your {orderType === 'delivery' ? 'delivery' : 'pickup'} ready shortly.</p>
            <p className="confirmed-name"><strong>Name:</strong> {form.name}</p>
            {orderType === 'delivery' && <p className="confirmed-address"><strong>Delivering to:</strong> {form.address}</p>}
            <p className="confirmed-phone"><strong>Phone:</strong> {form.phone}</p>
            <button className="btn btn-primary" onClick={handleNewOrder}>Place New Order</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout-page">
      <section className="page-hero checkout-hero">
        <div className="container page-hero-content">
          <h1>Checkout</h1>
          <p>Almost there! Confirm your details and order.</p>
        </div>
      </section>

      <section className="section">
        <div className="container checkout-grid">
          <div className="checkout-form-section fade-in">
            <h2>Your Details</h2>
            <form className="checkout-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input type="text" id="name" name="name" value={form.name} onChange={handleChange} required placeholder="John Doe" />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input type="tel" id="phone" name="phone" value={form.phone} onChange={handleChange} required placeholder="(555) 123-4567" />
              </div>

              <div className="form-group">
                <label>Order Type</label>
                <div className="order-type-toggle">
                  <button type="button" className={`order-type-btn ${orderType === 'pickup' ? 'active' : ''}`} onClick={() => setOrderType('pickup')}>Pickup</button>
                  <button type="button" className={`order-type-btn ${orderType === 'delivery' ? 'active' : ''}`} onClick={() => setOrderType('delivery')}>Delivery</button>
                </div>
              </div>

              {orderType === 'delivery' && (
                <div className="form-group">
                  <label htmlFor="address">Delivery Address</label>
                  <textarea id="address" name="address" value={form.address} onChange={handleChange} required rows={3} placeholder="123 Coffee Lane, Bean City, BC 12345" />
                </div>
              )}

              <button type="submit" className="btn btn-primary checkout-submit">Place Order</button>
            </form>
          </div>

          <div className="checkout-summary fade-in">
            <h2>Order Summary</h2>
            <div className="summary-items">
              {cartItems.map(item => (
                <div className="summary-item" key={item.id}>
                  <img src={item.image} alt={item.name} />
                  <div className="summary-item-info">
                    <h4>{item.name}</h4>
                    <span>Qty: {item.quantity}</span>
                  </div>
                  <span className="summary-item-price">${(item.priceNum * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="summary-total">
              <span>Subtotal</span>
              <strong>${subtotal.toFixed(2)}</strong>
            </div>
            <div className="summary-total">
              <span>Tax</span>
              <strong>${(subtotal * 0.08).toFixed(2)}</strong>
            </div>
            <div className="summary-grand-total">
              <span>Total</span>
              <strong>${(subtotal * 1.08).toFixed(2)}</strong>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Checkout
