import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { menuItems } from './Menu'
import './Home.css'

const offers = [
  { id: 'offer-morning-bliss', title: 'Morning Bliss', desc: '20% off all espresso-based drinks to start your day right.', badge: '20% OFF', valid: 'Every Morning 8 AM – 11 AM', image: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=500&h=350&fit=crop' },
  { id: 'offer-sweet-tooth', title: 'Sweet Tooth Special', desc: 'Buy one pastry, get one free. Perfect with your favorite brew.', badge: 'BOGO', valid: 'Available All Day', image: 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=500&h=350&fit=crop' },
  { id: 'offer-chill-hour', title: 'Chill Hour', desc: 'Enjoy $1 off any iced or cold drink during our afternoon happy hour.', badge: '$1 OFF', valid: 'Daily 2 PM – 4 PM', image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&h=350&fit=crop' },
]

const offerConfig = {
  'offer-morning-bliss': {
    groups: [
      { id: 'drink', label: 'Choose your drink', items: () => menuItems.filter(i => i.category === 'coffee') },
      { id: 'pastry', label: 'Choose your pastry', items: () => menuItems.filter(i => i.id === 15) },
    ],
    calcPrice: (sel) => { const t = Object.values(sel).reduce((s, i) => s + i.priceNum, 0); return Math.round(t * 0.8 * 100) / 100 },
    summary: (sel) => Object.values(sel).map(i => i.name).join(' + '),
  },
  'offer-sweet-tooth': {
    groups: [
      { id: 'pastry', label: 'Choose your pastry', items: () => menuItems.filter(i => i.category === 'desserts') },
    ],
    calcPrice: (sel) => sel.pastry.priceNum,
    summary: (sel) => `${sel.pastry.name} × 2`,
  },
  'offer-chill-hour': {
    groups: [
      { id: 'drink', label: 'Choose your iced drink', items: () => menuItems.filter(i => i.category === 'cold') },
    ],
    calcPrice: (sel) => Math.max(0, sel.drink.priceNum - 1),
    summary: (sel) => sel.drink.name,
  },
}

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
  const [configuringOffer, setConfiguringOffer] = useState(null)
  const [selections, setSelections] = useState({})
  const { addItem } = useCart()

  const openOfferConfig = (offer) => {
    const config = offerConfig[offer.id]
    const initial = {}
    config.groups.forEach(g => { initial[g.id] = null })
    setSelections(initial)
    setConfiguringOffer(offer)
  }

  const selectOfferItem = (groupId, item) => {
    setSelections(prev => ({ ...prev, [groupId]: item }))
  }

  const confirmOffer = () => {
    if (!configuringOffer) return
    const config = offerConfig[configuringOffer.id]
    const allSelected = config.groups.every(g => selections[g.id])
    if (!allSelected) return

    const finalPrice = config.calcPrice(selections)
    const summary = config.summary(selections)
    const chosenItems = config.groups.map(g => selections[g.id])

    addItem({
      id: configuringOffer.id + '-' + Date.now(),
      name: configuringOffer.title,
      priceNum: finalPrice,
      price: `$${finalPrice.toFixed(2)}`,
      image: configuringOffer.image,
      isOffer: true,
      offerBadge: configuringOffer.badge,
      offerValid: configuringOffer.valid,
      offerItems: chosenItems,
      offerSummary: summary,
    })
    setConfiguringOffer(null)
    setSelections({})
  }

  const cancelOffer = () => {
    setConfiguringOffer(null)
    setSelections({})
  }

  const renderOfferModal = () => {
    if (!configuringOffer) return null
    const config = offerConfig[configuringOffer.id]
    const allSelected = config.groups.every(g => selections[g.id])
    const previewPrice = allSelected ? config.calcPrice(selections) : null

    return (
      <div className="offer-modal-overlay" onClick={cancelOffer}>
        <div className="offer-modal" onClick={e => e.stopPropagation()}>
          <button className="offer-modal-close" onClick={cancelOffer}>✕</button>
          <h3 className="offer-modal-title">{configuringOffer.title}</h3>
          <p className="offer-modal-desc">{configuringOffer.desc}</p>
          <span className="offer-modal-badge">{configuringOffer.badge}</span>
          {config.groups.map(group => (
            <div className="offer-modal-group" key={group.id}>
              <h4 className="offer-group-label">{group.label}</h4>
              <div className="offer-group-options">
                {group.items().map(item => (
                  <button key={item.id} className={`offer-option-card ${selections[group.id]?.id === item.id ? 'selected' : ''}`} onClick={() => selectOfferItem(group.id, item)}>
                    <img src={item.image} alt={item.name} />
                    <div className="offer-option-info">
                      <strong>{item.name}</strong>
                      <span>{item.price}</span>
                    </div>
                    {selections[group.id]?.id === item.id && <span className="offer-check">✓</span>}
                  </button>
                ))}
              </div>
            </div>
          ))}
          {previewPrice !== null && (
            <div className="offer-modal-total">
              <span>Total</span>
              <strong>${previewPrice.toFixed(2)}</strong>
            </div>
          )}
          <div className="offer-modal-actions">
            <button className="btn btn-outline" onClick={cancelOffer}>Cancel</button>
            <button className="btn btn-primary" onClick={confirmOffer} disabled={!allSelected}>
              {allSelected ? `Add to Cart — $${previewPrice.toFixed(2)}` : 'Select all options'}
            </button>
          </div>
        </div>
      </div>
    )
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
                  <button className="btn-offer" onClick={() => openOfferConfig(offer)}>Customize & Add</button>
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
        {renderOfferModal()}
    </div>
  )
}

export default Home
