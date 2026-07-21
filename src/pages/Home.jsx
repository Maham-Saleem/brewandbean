import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import './Home.css'

const offers = [
  { id: 'offer-morning-bliss', title: 'Morning Bliss', desc: '20% off all espresso-based drinks to start your day right.', badge: '20% OFF', valid: 'Every Morning 8 AM – 11 AM', image: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=500&h=350&fit=crop', priceNum: 6.20, items: [{ name: 'Espresso', price: '$3.50' }, { name: 'Croissant', price: '$4.25' }] },
  { id: 'offer-sweet-tooth', title: 'Sweet Tooth Special', desc: 'Buy one pastry, get one free. Perfect with your favorite brew.', badge: 'BOGO', valid: 'Available All Day', image: 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=500&h=350&fit=crop', priceNum: 4.25, items: [{ name: 'Croissant × 2', price: '$4.25' }] },
  { id: 'offer-chill-hour', title: 'Chill Hour', desc: 'Enjoy $1 off any iced or cold drink during our afternoon happy hour.', badge: '$1 OFF', valid: 'Daily 2 PM – 4 PM', image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&h=350&fit=crop', priceNum: 3.75, items: [{ name: 'Cold Brew', price: '$3.75' }] },
]

const featuredDrinks = [
  { name: 'Signature Latte', desc: 'Espresso with steamed milk and a touch of vanilla', price: '$5.50', image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop' },
  { name: 'Cold Brew', desc: 'Slow-steeped for 20 hours, served over ice', price: '$4.75', image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop' },
  { name: 'Caramel Macchiato', desc: 'Layered espresso with vanilla and caramel', price: '$5.95', image: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=400&h=300&fit=crop' },
  { name: 'Matcha Latte', desc: 'Premium matcha whisked with steamed oat milk', price: '$5.25', image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400&h=300&fit=crop' },
]

const testimonials = [
  { name: 'Sarah M.', text: 'The coziest coffee shop in town! Their signature latte is absolutely divine.', role: 'Regular Customer' },
  { name: 'James K.', text: 'Perfect place to work or catch up with friends. The ambiance is unmatched.', role: 'Remote Worker' },
  { name: 'Emma L.', text: 'Best cold brew I\'ve ever had. The staff is incredibly welcoming too.', role: 'Coffee Enthusiast' },
]

function Home() {
  const { addItem } = useCart()

  const addOfferToCart = (offer) => {
    addItem({
      id: offer.id,
      name: offer.title,
      priceNum: offer.priceNum,
      price: `$${offer.priceNum.toFixed(2)}`,
      image: offer.image,
      isOffer: true,
      offerBadge: offer.badge,
      offerValid: offer.valid,
      offerItems: offer.items,
    })
  }

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-overlay" />
        <div className="container hero-content">
          <span className="hero-badge">Est. 2015</span>
          <h1 className="hero-title">Brew & Bean</h1>
          <p className="hero-subtitle">Where every cup tells a story</p>
          <p className="hero-desc">Handcrafted coffee in a space designed for connection, creativity, and comfort.</p>
          <div className="hero-actions">
            <Link to="/menu" className="btn btn-primary">Explore Our Menu</Link>
            <Link to="/contact" className="btn btn-outline">Visit Us</Link>
          </div>
        </div>
      </section>

      <section className="section offers">
        <div className="container">
          <h2 className="section-title fade-in">Special Offers</h2>
          <p className="section-subtitle fade-in">Treat yourself — limited-time deals crafted for coffee lovers</p>
          <div className="offers-grid">
            {offers.map((offer, i) => (
              <div className="offer-card fade-in" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="offer-image">
                  <img src={offer.image} alt={offer.title} loading="lazy" />
                  <span className="offer-badge">{offer.badge}</span>
                </div>
                <div className="offer-body">
                  <h3>{offer.title}</h3>
                  <p className="offer-desc">{offer.desc}</p>
                  <span className="offer-valid">{offer.valid}</span>
                  <button className="btn-offer" onClick={() => addOfferToCart(offer)}>Add to Cart — ${offer.priceNum.toFixed(2)}</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section featured">
        <div className="container">
          <h2 className="section-title fade-in">Featured Drinks</h2>
          <p className="section-subtitle fade-in">Handpicked favorites our baristas love crafting</p>
          <div className="drinks-grid">
            {featuredDrinks.map((drink, i) => (
              <div className="drink-card fade-in" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="drink-image">
                  <img src={drink.image} alt={drink.name} loading="lazy" />
                </div>
                <div className="drink-info">
                  <h3>{drink.name}</h3>
                  <p>{drink.desc}</p>
                  <span className="drink-price">{drink.price}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="featured-cta">
            <Link to="/menu" className="btn btn-primary">View Full Menu</Link>
          </div>
        </div>
      </section>

      <section className="section ambiance">
        <div className="container">
          <div className="ambiance-grid">
            <div className="ambiance-content fade-in">
              <h2>More Than Just Coffee</h2>
              <p>Step into a space where modern elegance meets rustic charm. Our café is designed to be your home away from home — a place to unwind, create, and connect.</p>
              <ul className="ambiance-features">
                <li>Cozy seating with warm lighting</li>
                <li>Free high-speed WiFi</li>
                <li>Quiet workspace areas</li>
                <li>Outdoor patio seating</li>
              </ul>
              <Link to="/about" className="btn btn-primary">Our Story</Link>
            </div>
            <div className="ambiance-image fade-in">
              <img src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&h=400&fit=crop" alt="Cafe interior" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      <section className="section testimonials">
        <div className="container">
          <h2 className="section-title fade-in">What Our Guests Say</h2>
          <p className="section-subtitle fade-in">The love from our community keeps us brewing</p>
          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <div className="testimonial-card fade-in" key={i} style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="testimonial-stars">{'★'.repeat(5)}</div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <strong>{t.name}</strong>
                  <span>{t.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-banner">
        <div className="container cta-content">
          <h2>Ready for your next cup?</h2>
          <p>Visit us today or browse our menu to find your new favorite drink.</p>
          <div className="cta-actions">
            <Link to="/contact" className="btn btn-primary">Find Us</Link>
            <Link to="/menu" className="btn btn-outline">View Menu</Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
