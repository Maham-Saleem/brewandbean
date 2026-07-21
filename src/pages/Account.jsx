import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Account.css'

const TABS = ['Profile', 'My Orders', 'Saved Addresses', 'Logout']

function Account() {
  const { currentUser, logout, removeAddress } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('Profile')

  if (!currentUser) {
    return (
      <div className="account-page">
        <section className="section">
          <div className="container account-empty">
            <h2>Not signed in</h2>
            <p>Please sign in to view your account.</p>
            <button className="btn btn-primary" onClick={() => navigate('/checkout')}>Sign In</button>
          </div>
        </section>
      </div>
    )
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const formatDate = (iso) => {
    return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  const renderProfile = () => (
    <div className="ac-card fade-in">
      <h2 className="ac-title">Profile</h2>
      <div className="ac-profile-details">
        <div className="ac-profile-row">
          <span>Full Name</span>
          <strong>{currentUser.name || '—'}</strong>
        </div>
        <div className="ac-profile-row">
          <span>Email</span>
          <strong>{currentUser.email}</strong>
        </div>
        <div className="ac-profile-row">
          <span>Phone</span>
          <strong>{currentUser.phone || '—'}</strong>
        </div>
        <div className="ac-profile-row">
          <span>Member Since</span>
          <strong>{currentUser.createdAt ? formatDate(currentUser.createdAt) : '—'}</strong>
        </div>
      </div>
    </div>
  )

  const renderOrders = () => (
    <div className="ac-card fade-in">
      <h2 className="ac-title">My Orders</h2>
      {(!currentUser.orders || currentUser.orders.length === 0) ? (
        <div className="ac-empty">
          <p>No orders yet.</p>
          <button className="btn btn-primary" onClick={() => navigate('/menu')}>Browse Menu</button>
        </div>
      ) : (
        <div className="ac-orders-list">
          {currentUser.orders.map(order => (
            <div className="ac-order" key={order.id}>
              <div className="ac-order-header">
                <span className="ac-order-num">{order.orderNumber}</span>
                <span className={`ac-order-status ${order.status}`}>{order.status}</span>
              </div>
              <div className="ac-order-meta">
                <span>{formatDate(order.createdAt)}</span>
                <span className="ac-order-dot">·</span>
                <span>{order.method === 'pickup' ? 'Pickup' : 'Delivery'}</span>
                <span className="ac-order-dot">·</span>
                <span>{order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}</span>
              </div>
              {order.items && (
                <div className="ac-order-items">
                  {order.items.map(item => (
                    <div className="ac-order-item" key={item.id}>
                      <img src={item.image} alt={item.name} />
                      <div className="ac-order-item-info">
                        <strong>{item.name}</strong>
                        <span>Qty: {item.quantity}</span>
                      </div>
                      <span className="ac-order-item-price">${(item.priceNum * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="ac-order-footer">
                <span>Total</span>
                <strong>${order.total?.toFixed(2)}</strong>
              </div>
              {order.address && (
                <div className="ac-order-addr">
                  Delivering to: {order.address.street}, {order.address.city} {order.address.zip}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const renderAddresses = () => (
    <div className="ac-card fade-in">
      <h2 className="ac-title">Saved Addresses</h2>
      {(!currentUser.addresses || currentUser.addresses.length === 0) ? (
        <p className="ac-empty-text">No saved addresses. Add one during checkout.</p>
      ) : (
        <div className="ac-addresses-list">
          {currentUser.addresses.map(addr => (
            <div className="ac-address-card" key={addr.id}>
              <div className="ac-address-info">
                <strong>{addr.label || `${addr.street}, ${addr.city}`}</strong>
                <span>{addr.street}, {addr.city} {addr.zip}</span>
                {addr.instructions && <span className="ac-addr-instr">{addr.instructions}</span>}
              </div>
              <button className="ac-addr-remove" onClick={() => removeAddress(addr.id)} title="Remove address">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const renderLogout = () => (
    <div className="ac-card ac-logout-card fade-in">
      <div className="ac-logout-content">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        <h2 className="ac-title">Sign Out</h2>
        <p>Are you sure you want to sign out?</p>
        <button className="btn btn-primary" onClick={handleLogout}>Sign Out</button>
      </div>
    </div>
  )

  const renderTab = () => {
    switch (tab) {
      case 'Profile': return renderProfile()
      case 'My Orders': return renderOrders()
      case 'Saved Addresses': return renderAddresses()
      case 'Logout': return renderLogout()
      default: return renderProfile()
    }
  }

  return (
    <div className="account-page">
      <section className="section section--compact">
        <div className="container">
          <div className="ac-layout">
            <aside className="ac-sidebar">
              <div className="ac-user-summary">
                <div className="ac-avatar">{currentUser.name ? currentUser.name.charAt(0).toUpperCase() : currentUser.email.charAt(0).toUpperCase()}</div>
                <div>
                  <strong>{currentUser.name || 'User'}</strong>
                  <span>{currentUser.email}</span>
                </div>
              </div>
              <nav className="ac-tabs">
                {TABS.map(t => (
                  <button key={t} className={`ac-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
                    {t}
                  </button>
                ))}
              </nav>
            </aside>
            <main className="ac-main">
              {renderTab()}
            </main>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Account
