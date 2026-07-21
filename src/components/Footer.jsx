import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h3>Brew & Bean Coffee House</h3>
            <p>Where every cup tells a story. Experience the perfect blend of quality coffee and cozy comfort.</p>
          </div>
          <div className="footer-links">
            <h4>Quick Links</h4>
            <Link to="/">Home</Link>
            <Link to="/about">About Us</Link>
            <Link to="/menu">Menu</Link>
            <Link to="/gallery">Gallery</Link>
            <Link to="/contact">Contact</Link>
          </div>
          <div className="footer-hours">
            <h4>Hours</h4>
            <p>Mon - Fri: 6:00 AM - 9:00 PM</p>
            <p>Sat - Sun: 7:00 AM - 10:00 PM</p>
          </div>
          <div className="footer-contact">
            <h4>Contact</h4>
            <p>123 Coffee Lane, Bean City</p>
            <p>(555) 123-4567</p>
            <p>hello@brewandbean.com</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Brew & Bean Coffee House. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
