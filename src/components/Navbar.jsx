import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import CartDrawer from './CartDrawer'
import './Navbar.css'

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const { itemCount } = useCart()
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  const handleLogout = () => {
    logout()
    closeMenu()
    navigate('/')
  }

  return (
    <>
      <nav className="navbar">
        <div className="container navbar-container">
          <Link to="/" className="navbar-logo" onClick={closeMenu}>
            <span className="logo-icon">☕</span>
            <span className="logo-text">Brew & Bean</span>
          </Link>

          <div className={`navbar-links ${isOpen ? 'open' : ''}`}>
            <NavLink to="/" end onClick={closeMenu}>Home</NavLink>
            <NavLink to="/about" onClick={closeMenu}>About</NavLink>
            <NavLink to="/menu" onClick={closeMenu}>Menu</NavLink>
            <NavLink to="/gallery" onClick={closeMenu}>Gallery</NavLink>
            <NavLink to="/contact" onClick={closeMenu}>Contact</NavLink>
            <NavLink to="/account" onClick={closeMenu}>Account</NavLink>
            {currentUser && <button className="nav-logout-link" onClick={handleLogout}>Log Out</button>}
          </div>

          <div className="navbar-actions">
            <button className="cart-btn" onClick={() => setCartOpen(true)} aria-label="Open cart">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
            </button>
            {currentUser && (
              <button className="nav-logout-btn" onClick={handleLogout} aria-label="Log out">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
            )}
            <button className={`hamburger ${isOpen ? 'active' : ''}`} onClick={toggleMenu} aria-label="Toggle menu">
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </nav>
      <div className={`navbar-overlay ${isOpen ? 'open' : ''}`} onClick={closeMenu} />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}

export default Navbar
