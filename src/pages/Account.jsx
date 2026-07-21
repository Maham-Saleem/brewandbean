import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Account.css'

/* ── SVG Icons ── */
const I = {
  user: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  orders: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  address: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  logout: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  bag: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>,
  pin: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  coffee: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>,
  pencil: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  trash: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  star: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  clock: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  chevronRight: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
}

const TABS = [
  { id: 'Dashboard', label: 'Dashboard', icon: I.user },
  { id: 'Profile', label: 'Profile', icon: I.user },
  { id: 'My Orders', label: 'My Orders', icon: I.orders },
  { id: 'Saved Addresses', label: 'Saved Addresses', icon: I.address },
  { id: 'Logout', label: 'Logout', icon: I.logout },
]

function Account() {
  const { currentUser, logout, removeAddress, updateAddress, addAddress, setDefaultAddress } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('Dashboard')
  const [editingAddr, setEditingAddr] = useState(null)
  const [editForm, setEditForm] = useState({ label: '', street: '', city: '', zip: '', instructions: '' })
  const [showAddModal, setShowAddModal] = useState(false)
  const [newAddrForm, setNewAddrForm] = useState({ street: '', city: '', zip: '', instructions: '', setAsDefault: false })

  if (!currentUser) {
    return (
      <div className="account-page">
        <section className="section">
          <div className="container account-empty">
            <div className="ac-empty-icon"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
            <h2>Not signed in</h2>
            <p>Please sign in to view your account.</p>
            <button className="btn btn-primary" onClick={() => navigate('/checkout')}>Sign In</button>
          </div>
        </section>
      </div>
    )
  }

  const handleLogout = () => { logout(); navigate('/') }

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

  const formatDateFull = (iso) =>
    new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })

  /* ── Derived stats ── */
  const orders = currentUser.orders || []
  const addresses = currentUser.addresses || []
  const defaultAddrId = currentUser.defaultAddressId

  /* compute favorite drink */
  const drinkCounts = {}
  orders.forEach(o => (o.items || []).forEach(item => {
    if (item.isOffer) return
    const n = item.name.toLowerCase()
    drinkCounts[n] = (drinkCounts[n] || 0) + item.quantity
  }))
  const favoriteDrink = Object.entries(drinkCounts).sort((a, b) => b[1] - a[1])[0]
  const favoriteLabel = favoriteDrink ? favoriteDrink[0].replace(/\b\w/g, c => c.toUpperCase()) : null

  const recentOrders = orders.slice(0, 3)
  const recentAddresses = addresses.slice(0, 2)

  /* ── Edit address handlers ── */
  const openEdit = (addr) => {
    setEditingAddr(addr.id)
    setEditForm({ label: addr.label || '', street: addr.street, city: addr.city, zip: addr.zip, instructions: addr.instructions || '' })
  }
  const cancelEdit = () => { setEditingAddr(null); setEditForm({ label: '', street: '', city: '', zip: '', instructions: '' }) }
  const saveEdit = (id) => {
    if (!editForm.street || !editForm.city || !editForm.zip) return
    updateAddress(id, { ...editForm, label: editForm.label || `${editForm.street}, ${editForm.city}` })
    cancelEdit()
  }

  /* ── Add address modal ── */
  const openAddModal = () => { setNewAddrForm({ street: '', city: '', zip: '', instructions: '', setAsDefault: false }); setShowAddModal(true) }
  const closeAddModal = () => setShowAddModal(false)
  const handleSaveNewAddress = () => {
    if (!newAddrForm.street || !newAddrForm.city || !newAddrForm.zip) return
    const addr = addAddress({
      label: `${newAddrForm.street}, ${newAddrForm.city}`,
      street: newAddrForm.street,
      city: newAddrForm.city,
      zip: newAddrForm.zip,
      instructions: newAddrForm.instructions,
    })
    if (newAddrForm.setAsDefault) setDefaultAddress(addr.id)
    closeAddModal()
  }

  /* ── Renderers ── */

  const renderDashboard = () => (
    <div className="ac-dashboard fade-in">
      {/* Welcome */}
      <div className="ac-welcome">
        <h2>Welcome back, {currentUser.name || 'Coffee Lover'}! ☕</h2>
        <p>Here's a quick look at your Brew & Bean activity.</p>
      </div>

      {/* Summary cards */}
      <div className="ac-summary-grid">
        <div className="ac-summary-card">
          <div className="ac-summary-icon bag">{I.bag}</div>
          <div className="ac-summary-info">
            <span className="ac-summary-num">{orders.length}</span>
            <span className="ac-summary-label">Total Orders</span>
          </div>
        </div>
        <div className="ac-summary-card">
          <div className="ac-summary-icon pin">{I.pin}</div>
          <div className="ac-summary-info">
            <span className="ac-summary-num">{addresses.length}</span>
            <span className="ac-summary-label">Saved Addresses</span>
          </div>
        </div>
        <div className="ac-summary-card">
          <div className="ac-summary-icon coffee">{I.coffee}</div>
          <div className="ac-summary-info">
            <span className="ac-summary-num">{favoriteLabel || '—'}</span>
            <span className="ac-summary-label">Favorite Drink</span>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="ac-section-header">
        <h3>Recent Orders</h3>
        {orders.length > 0 && <button className="ac-link-btn" onClick={() => setTab('My Orders')}>View All {I.chevronRight}</button>}
      </div>
      {recentOrders.length === 0 ? (
        <div className="ac-mini-empty">
          <p>No orders yet.</p>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/menu')}>Browse Menu</button>
        </div>
      ) : (
        <div className="ac-mini-orders">
          {recentOrders.map(order => (
            <div className="ac-mini-order" key={order.id}>
              <div className="ac-mini-order-top">
                <span className="ac-mini-order-num">{order.orderNumber}</span>
                <span className={`ac-order-status ${order.status}`}>{order.status}</span>
              </div>
              <div className="ac-mini-order-meta">
                {I.clock}<span>{formatDateFull(order.createdAt)}</span>
                <span className="ac-dot">·</span>
                <span>{order.method === 'pickup' ? 'Pickup' : 'Delivery'}</span>
                <span className="ac-dot">·</span>
                <span>${order.total?.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Saved Addresses */}
      <div className="ac-section-header">
        <h3>Saved Addresses</h3>
        {addresses.length > 0 && <button className="ac-link-btn" onClick={() => setTab('Saved Addresses')}>Manage {I.chevronRight}</button>}
      </div>
      {recentAddresses.length === 0 ? (
        <div className="ac-mini-empty">
          <p>No saved addresses yet.</p>
        </div>
      ) : (
        <div className="ac-mini-addresses">
          {recentAddresses.map(addr => (
            <div className="ac-mini-address" key={addr.id}>
              {I.pin}<span>{addr.street}, {addr.city} {addr.zip}</span>
              {defaultAddrId === addr.id && <span className="ac-default-badge">Default</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const renderProfile = () => (
    <div className="ac-card fade-in">
      <h2 className="ac-card-title">Profile</h2>
      <div className="ac-profile-grid">
        <div className="ac-profile-field">
          <span className="ac-field-label">Full Name</span>
          <strong className="ac-field-value">{currentUser.name || '—'}</strong>
        </div>
        <div className="ac-profile-field">
          <span className="ac-field-label">Email</span>
          <strong className="ac-field-value">{currentUser.email}</strong>
        </div>
        <div className="ac-profile-field">
          <span className="ac-field-label">Phone</span>
          <strong className="ac-field-value">{currentUser.phone || '—'}</strong>
        </div>
        <div className="ac-profile-field">
          <span className="ac-field-label">Member Since</span>
          <strong className="ac-field-value">{currentUser.createdAt ? formatDate(currentUser.createdAt) : '—'}</strong>
        </div>
      </div>
    </div>
  )

  const renderOrders = () => (
    <div className="ac-card fade-in">
      <h2 className="ac-card-title">My Orders</h2>
      {orders.length === 0 ? (
        <div className="ac-empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-secondary)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          <p>You haven't placed any orders yet.</p>
          <button className="btn btn-primary" onClick={() => navigate('/menu')}>Start Ordering</button>
        </div>
      ) : (
        <div className="ac-orders-list">
          {orders.map(order => (
            <div className="ac-order" key={order.id}>
              <div className="ac-order-header">
                <span className="ac-order-num">{order.orderNumber}</span>
                <span className={`ac-order-status ${order.status}`}>{order.status}</span>
              </div>
              <div className="ac-order-meta">
                <span>{formatDateFull(order.createdAt)}</span>
                <span className="ac-dot">·</span>
                <span>{order.method === 'pickup' ? 'Pickup' : 'Delivery'}</span>
                <span className="ac-dot">·</span>
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
                <div className="ac-order-addr">Delivering to: {order.address.street}, {order.address.city} {order.address.zip}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const renderAddresses = () => (
    <div className="ac-card fade-in">
      <h2 className="ac-card-title">Saved Addresses</h2>
      {addresses.length === 0 ? (
        <div className="ac-empty-state">
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--color-secondary)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <p>You don't have any saved addresses yet.</p>
          <span className="ac-empty-hint">Add one during checkout or contact us to set one up.</span>
          <button className="btn btn-primary" onClick={openAddModal}>Add Address</button>
        </div>
      ) : (
        <>
          <button className="ac-add-addr-btn" onClick={openAddModal}>{I.plus} Add Address</button>
          <div className="ac-addresses-list">
          {addresses.map(addr => (
            <div className={`ac-addr-card ${defaultAddrId === addr.id ? 'default' : ''}`} key={addr.id}>
              {editingAddr === addr.id ? (
                <div className="ac-addr-edit-form">
                  <div className="ac-edit-row">
                    <input type="text" placeholder="Label (Home, Work, etc.)" value={editForm.label} onChange={e => setEditForm({ ...editForm, label: e.target.value })} />
                  </div>
                  <div className="ac-edit-row">
                    <input type="text" placeholder="Street Address" value={editForm.street} onChange={e => setEditForm({ ...editForm, street: e.target.value })} required />
                  </div>
                  <div className="ac-edit-row ac-edit-half">
                    <input type="text" placeholder="City" value={editForm.city} onChange={e => setEditForm({ ...editForm, city: e.target.value })} required />
                    <input type="text" placeholder="Postal Code" value={editForm.zip} onChange={e => setEditForm({ ...editForm, zip: e.target.value })} required />
                  </div>
                  <div className="ac-edit-row">
                    <input type="text" placeholder="Instructions (optional)" value={editForm.instructions} onChange={e => setEditForm({ ...editForm, instructions: e.target.value })} />
                  </div>
                  <div className="ac-edit-actions">
                    <button className="btn btn-sm btn-outline" onClick={cancelEdit}>Cancel</button>
                    <button className="btn btn-sm btn-primary" onClick={() => saveEdit(addr.id)} disabled={!editForm.street || !editForm.city || !editForm.zip}>Save</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="ac-addr-main">
                    <div className="ac-addr-icon">{I.pin}</div>
                    <div className="ac-addr-info">
                      <strong>{addr.label || `${addr.street}, ${addr.city}`}</strong>
                      <span>{addr.street}, {addr.city} {addr.zip}</span>
                      {addr.instructions && <span className="ac-addr-instr">{addr.instructions}</span>}
                    </div>
                    {defaultAddrId === addr.id && <span className="ac-default-badge">Default</span>}
                  </div>
                  <div className="ac-addr-actions">
                    <button className="ac-action-btn" onClick={() => openEdit(addr)} title="Edit">{I.pencil} Edit</button>
                    <button className="ac-action-btn" onClick={() => removeAddress(addr.id)} title="Delete">{I.trash} Delete</button>
                    {defaultAddrId !== addr.id && (
                      <button className="ac-action-btn" onClick={() => setDefaultAddress(addr.id)} title="Set as default">{I.star} Set Default</button>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
        </>
      )}
    </div>
  )

  const renderAddAddressModal = () => {
    if (!showAddModal) return null
    const canSave = newAddrForm.street && newAddrForm.city && newAddrForm.zip
    return (
      <div className="ac-modal-overlay" onClick={closeAddModal}>
        <div className="ac-modal" onClick={e => e.stopPropagation()}>
          <button className="ac-modal-close" onClick={closeAddModal}>✕</button>
          <h2 className="ac-card-title">Add New Address</h2>

          {/* Read-only profile info */}
          <div className="ac-modal-profile">
            <div className="ac-modal-profile-avatar">{currentUser.name ? currentUser.name.charAt(0).toUpperCase() : currentUser.email.charAt(0).toUpperCase()}</div>
            <div className="ac-modal-profile-info">
              <strong>{currentUser.name || 'User'}</strong>
              <span>{currentUser.phone || 'No phone on file'} · {currentUser.email}</span>
            </div>
            <button className="ac-modal-edit-link" onClick={() => { closeAddModal(); setTab('Profile') }}>Edit Profile</button>
          </div>

          <div className="ac-modal-form">
            <div className="ac-mf-row">
              <label>Street Address</label>
              <input type="text" value={newAddrForm.street} onChange={e => setNewAddrForm({ ...newAddrForm, street: e.target.value })} placeholder="123 Coffee Lane" required />
            </div>
            <div className="ac-mf-half">
              <div className="ac-mf-row">
                <label>City</label>
                <input type="text" value={newAddrForm.city} onChange={e => setNewAddrForm({ ...newAddrForm, city: e.target.value })} placeholder="Bean City" required />
              </div>
              <div className="ac-mf-row">
                <label>Postal Code</label>
                <input type="text" value={newAddrForm.zip} onChange={e => setNewAddrForm({ ...newAddrForm, zip: e.target.value })} placeholder="12345" required />
              </div>
            </div>
            <div className="ac-mf-row">
              <label>Delivery Instructions <span className="co-optional">(optional)</span></label>
              <textarea value={newAddrForm.instructions} onChange={e => setNewAddrForm({ ...newAddrForm, instructions: e.target.value })} rows={2} placeholder="Gate code, landmark, etc." />
            </div>
            <label className="ac-mf-checkbox">
              <input type="checkbox" checked={newAddrForm.setAsDefault} onChange={e => setNewAddrForm({ ...newAddrForm, setAsDefault: e.target.checked })} />
              <span>Set as default address</span>
            </label>
          </div>

          <div className="ac-modal-actions">
            <button className="btn btn-outline" onClick={closeAddModal}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSaveNewAddress} disabled={!canSave}>Save Address</button>
          </div>
        </div>
      </div>
    )
  }

  const renderLogout = () => (
    <div className="ac-card ac-logout-card fade-in">
      <div className="ac-logout-content">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        <h2 className="ac-card-title">Sign Out</h2>
        <p>Are you sure you want to sign out?</p>
        <button className="btn btn-primary" onClick={handleLogout}>Sign Out</button>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (tab) {
      case 'Dashboard': return renderDashboard()
      case 'Profile': return renderProfile()
      case 'My Orders': return renderOrders()
      case 'Saved Addresses': return renderAddresses()
      case 'Logout': return renderLogout()
      default: return renderDashboard()
    }
  }

  return (
    <div className="account-page">
      <section className="section section--compact">
        <div className="container">
          <div className="ac-layout">
            <aside className="ac-sidebar">
              <div className="ac-sb-user">
                <div className="ac-sb-avatar">{currentUser.name ? currentUser.name.charAt(0).toUpperCase() : currentUser.email.charAt(0).toUpperCase()}</div>
                <div className="ac-sb-info">
                  <strong>{currentUser.name || 'User'}</strong>
                  <span>{currentUser.email}</span>
                </div>
                <span className="ac-sb-badge">Coffee Lover</span>
                {currentUser.createdAt && <span className="ac-sb-member">Member since {formatDate(currentUser.createdAt)}</span>}
              </div>
              <nav className="ac-sb-nav">
                {TABS.map(t => (
                  <button key={t.id} className={`ac-sb-tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
                    {t.icon}
                    <span>{t.label}</span>
                  </button>
                ))}
              </nav>
            </aside>
            <main className="ac-main">
              {renderContent()}
            </main>
          </div>
        </div>
      </section>
      {renderAddAddressModal()}
    </div>
  )
}

export default Account
