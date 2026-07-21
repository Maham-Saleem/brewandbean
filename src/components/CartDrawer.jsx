import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import './CartDrawer.css'

function CartDrawer({ isOpen, onClose }) {
  const { cartItems, updateQuantity, removeItem, subtotal } = useCart()
  const navigate = useNavigate()

  const handleCheckout = () => {
    onClose()
    navigate('/checkout')
  }

  return (
    <>
      <div className={`cart-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />
      <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h3>Your Order</h3>
          <button className="cart-close" onClick={onClose}>✕</button>
        </div>

        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <span className="cart-empty-icon">🛒</span>
            <p>Your cart is empty</p>
            <p className="cart-empty-hint">Add items from our menu to get started.</p>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map(item => (
                <div className="cart-item" key={item.id}>
                  <img src={item.image} alt={item.name} />
                  <div className="cart-item-details">
                    <h4>{item.name}</h4>
                    {item.isOffer && <span className="cart-offer-badge">{item.offerBadge || "Today's Special"}</span>}
                    {item.discountAmount > 0 && (
                      <div className="cart-discount-info">
                        <span className="cart-original-price">${((item.originalPriceNum || item.priceNum) * item.quantity).toFixed(2)}</span>
                        <span className="cart-save-amount">Save ${(item.discountAmount * item.quantity).toFixed(2)}</span>
                      </div>
                    )}
                    <span className="cart-item-price">${(item.priceNum * item.quantity).toFixed(2)}</span>
                    <div className="cart-qty">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                  </div>
                  <button className="cart-item-remove" onClick={() => removeItem(item.id)}>✕</button>
                </div>
              ))}
            </div>

            <div className="cart-footer">
              <div className="cart-total">
                <span>Subtotal</span>
                <strong>${subtotal.toFixed(2)}</strong>
              </div>
              <button className="btn btn-primary cart-checkout-btn" onClick={handleCheckout}>
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default CartDrawer
