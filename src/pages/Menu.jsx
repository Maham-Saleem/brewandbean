import { useState } from 'react'
import { useCart } from '../context/CartContext'
import './Menu.css'

const IconAll = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B5E3C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
)

const IconCoffee = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B5E3C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 8h1a4 4 0 1 1 0 8h-1" /><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
    <line x1="6" y1="2" x2="6" y2="4" /><line x1="10" y1="2" x2="10" y2="4" /><line x1="14" y1="2" x2="14" y2="4" />
  </svg>
)

const IconTea = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B5E3C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10" /><path d="M17 2c-2 2-2 5-2 8s0 6 2 8" />
    <path d="M22 12c0-3-1.5-5.5-4-7" />
  </svg>
)

const IconCold = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B5E3C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 2v4M16 2v4M12 2v4" /><rect x="6" y="8" width="12" height="14" rx="2" />
    <path d="M6 14h12" />
  </svg>
)

const IconDessert = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B5E3C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 8V2" /><path d="M8 8h8" />
    <path d="M4 14h16c0 4-3 6-8 6s-8-2-8-6Z" />
    <circle cx="12" cy="5" r="2" fill="#C4956A" stroke="none" />
  </svg>
)

const categories = [
  { id: 'all', label: 'All', Icon: IconAll },
  { id: 'coffee', label: 'Coffee', Icon: IconCoffee },
  { id: 'tea', label: 'Tea', Icon: IconTea },
  { id: 'cold', label: 'Iced Drinks', Icon: IconCold },
  { id: 'desserts', label: 'Desserts', Icon: IconDessert },
]

const categoryMeta = {
  coffee: { Icon: IconCoffee, desc: 'Classic brews and espresso-based favorites. Made fresh, every time.' },
  tea: { Icon: IconTea, desc: 'Hand-selected teas from the finest gardens around the world.' },
  cold: { Icon: IconCold, desc: 'Refreshing iced beverages perfect for any time of day.' },
  desserts: { Icon: IconDessert, desc: 'Sweet treats baked fresh daily to pair with your drink.' },
}

export const menuItems = [
  { id: 1, category: 'coffee', name: 'Espresso', desc: 'Rich single-origin espresso shot with honey undertones', price: '$3.50', priceNum: 3.50, rating: 4.8, featured: true, tags: ['Hot', 'Strong'], image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=500&h=360&fit=crop' },
  { id: 2, category: 'coffee', name: 'Americano', desc: 'Smooth espresso lengthened with hot water', price: '$4.00', priceNum: 4.00, rating: 4.6, featured: false, tags: ['Hot'], image: 'https://images.unsplash.com/photo-1551030173-122aabc4489c?w=500&h=360&fit=crop' },
  { id: 3, category: 'coffee', name: 'Cappuccino', desc: 'Equal parts espresso, steamed milk, and velvety foam', price: '$5.00', priceNum: 5.00, rating: 4.9, featured: true, tags: ['Hot', 'Milk-Based'], image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=500&h=360&fit=crop' },
  { id: 4, category: 'coffee', name: 'Flat White', desc: 'Double espresso with silky microfoam', price: '$5.25', priceNum: 5.25, rating: 4.7, featured: false, tags: ['Hot', 'Milk-Based'], image: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=500&h=360&fit=crop' },
  { id: 5, category: 'coffee', name: 'Mocha', desc: 'Espresso with dark chocolate and steamed milk', price: '$5.75', priceNum: 5.75, rating: 4.8, featured: true, tags: ['Hot', 'Milk-Based'], image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=500&h=360&fit=crop' },
  { id: 6, category: 'tea', name: 'Earl Grey', desc: 'Classic bergamot-infused black tea', price: '$3.75', priceNum: 3.75, rating: 4.5, featured: false, tags: ['Hot'], image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=500&h=360&fit=crop' },
  { id: 7, category: 'tea', name: 'Matcha', desc: 'Premium ceremonial-grade matcha whisked to perfection', price: '$4.50', priceNum: 4.50, rating: 4.7, featured: true, tags: ['Hot', 'Milk-Based'], image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=500&h=360&fit=crop' },
  { id: 8, category: 'tea', name: 'Chamomile', desc: 'Calming herbal blend with honey and lavender', price: '$3.50', priceNum: 3.50, rating: 4.4, featured: false, tags: ['Hot'], image: 'https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?w=500&h=360&fit=crop' },
  { id: 9, category: 'tea', name: 'Chai Latte', desc: 'Spiced black tea concentrate with steamed milk', price: '$5.00', priceNum: 5.00, rating: 4.6, featured: false, tags: ['Hot', 'Milk-Based'], image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=500&h=360&fit=crop' },
  { id: 10, category: 'cold', name: 'Iced Latte', desc: 'Chilled espresso over milk, served over ice', price: '$5.00', priceNum: 5.00, rating: 4.7, featured: false, tags: ['Iced', 'Milk-Based'], image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&h=360&fit=crop' },
  { id: 11, category: 'cold', name: 'Cold Brew', desc: 'Slow-steeped 20 hours for smooth richness', price: '$4.75', priceNum: 4.75, rating: 4.9, featured: true, tags: ['Iced', 'Strong'], image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=500&h=360&fit=crop' },
  { id: 12, category: 'cold', name: 'Frappé', desc: 'Blended coffee with vanilla and whipped cream', price: '$5.95', priceNum: 5.95, rating: 4.6, featured: false, tags: ['Iced', 'Milk-Based'], image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&h=360&fit=crop' },
  { id: 13, category: 'cold', name: 'Iced Matcha', desc: 'Chilled matcha with oat milk over ice', price: '$5.25', priceNum: 5.25, rating: 4.5, featured: false, tags: ['Iced', 'Milk-Based'], image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&h=360&fit=crop' },
  { id: 14, category: 'desserts', name: 'Tiramisu', desc: 'Classic Italian coffee-soaked ladyfingers', price: '$6.50', priceNum: 6.50, rating: 4.9, featured: true, tags: ['Dessert'], image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&h=360&fit=crop' },
  { id: 15, category: 'desserts', name: 'Croissant', desc: 'Buttery, flaky French pastry, baked fresh daily', price: '$4.25', priceNum: 4.25, rating: 4.7, featured: false, tags: ['Pastry'], image: 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=500&h=360&fit=crop' },
  { id: 16, category: 'desserts', name: 'Cheesecake', desc: 'Creamy New York style with berry compote', price: '$6.75', priceNum: 6.75, rating: 4.8, featured: true, tags: ['Dessert'], image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500&h=360&fit=crop' },
  { id: 17, category: 'desserts', name: 'Chocolate Brownie', desc: 'Rich dark chocolate brownie with sea salt', price: '$5.50', priceNum: 5.50, rating: 4.7, featured: false, tags: ['Dessert'], image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&h=360&fit=crop' },
]

const offers = [
  { id: 'offer-morning-bliss', title: 'Morning Bliss', desc: '20% off all espresso-based drinks to start your day right.', badge: '20% OFF', valid: 'Every Morning 8 AM – 11 AM', image: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=500&h=350&fit=crop', priceNum: 6.20, items: [{ name: 'Espresso', price: '$3.50' }, { name: 'Croissant', price: '$4.25' }] },
  { id: 'offer-sweet-tooth', title: 'Sweet Tooth Special', desc: 'Buy one pastry, get one free. Perfect with your favorite brew.', badge: 'BOGO', valid: 'Available All Day', image: 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=500&h=350&fit=crop', priceNum: 4.25, items: [{ name: 'Croissant × 2', price: '$4.25' }] },
  { id: 'offer-chill-hour', title: 'Chill Hour', desc: 'Enjoy $1 off any iced or cold drink during our afternoon happy hour.', badge: '$1 OFF', valid: 'Daily 2 PM – 4 PM', image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&h=350&fit=crop', priceNum: 3.75, items: [{ name: 'Cold Brew', price: '$3.75' }] },
]

const offerConfig = {
  'offer-morning-bliss': {
    groups: [
      { id: 'drink', label: 'Choose your drink', items: () => menuItems.filter(i => i.category === 'coffee') },
      { id: 'pastry', label: 'Choose your pastry', items: () => menuItems.filter(i => i.id === 15) },
    ],
    calcPrice: (sel) => {
      const total = Object.values(sel).reduce((s, i) => s + i.priceNum, 0)
      return Math.round(total * 0.8 * 100) / 100
    },
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

function Menu() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [configuringOffer, setConfiguringOffer] = useState(null)
  const [selections, setSelections] = useState({})
  const { addItem } = useCart()

  const featuredItems = menuItems.filter(item => item.featured)

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
                  <button
                    key={item.id}
                    className={`offer-option-card ${selections[group.id]?.id === item.id ? 'selected' : ''}`}
                    onClick={() => selectOfferItem(group.id, item)}
                  >
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

  const renderStars = (rating) => {
    const full = Math.floor(rating)
    const half = rating % 1 >= 0.5
    return (
      <span className="rating-stars">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={`star ${i < full ? 'full' : i === full && half ? 'half' : 'empty'}`}>★</span>
        ))}
      </span>
    )
  }

  const renderFeaturedCard = (item) => (
    <div className="featured-card" key={item.id}>
      <div className="featured-card-image">
        <img src={item.image} alt={item.name} loading="lazy" />
        <span className="pick-badge">BARISTA'S PICK</span>
      </div>
      <div className="featured-card-body">
        <div className="card-name-row">
          <h3>{item.name}</h3>
          <span className="card-price">{item.price}</span>
        </div>
        <div className="card-rating">
          {renderStars(item.rating)}
          <span className="rating-number">{item.rating}</span>
        </div>
        <p className="card-desc">{item.desc}</p>
        <div className="card-tags">
          {item.tags.map((tag, i) => (
            <span className="tag" key={i}>{tag}</span>
          ))}
        </div>
        <button className="btn-add-cart" onClick={() => addItem(item)}>+ Add to Cart</button>
      </div>
    </div>
  )

  const renderMenuCard = (item) => (
    <div className="menu-card" key={item.id}>
      <div className="menu-card-image">
        <img src={item.image} alt={item.name} loading="lazy" />
      </div>
      <div className="menu-card-body">
        <div className="card-name-row">
          <h3>{item.name}</h3>
          <span className="card-price">{item.price}</span>
        </div>
        <p className="card-desc">{item.desc}</p>
        <div className="card-tags">
          {item.tags.map((tag, i) => (
            <span className="tag" key={i}>{tag}</span>
          ))}
        </div>
        <button className="btn-add-cart" onClick={() => addItem(item)}>+ Add to Cart</button>
      </div>
    </div>
  )

  return (
    <div className="menu-page">
      <section className="page-hero menu-hero">
        <div className="container page-hero-content">
          <span className="menu-hero-badge">Handcrafted with Love</span>
          <h1>Our Menu</h1>
          <p>Carefully crafted beverages and treats for every moment</p>
        </div>
      </section>

      <section className="menu-section today-specials">
        <div className="container">
          <h2 className="specials-title fade-in">Today's Specials</h2>
          <div className="specials-grid fade-in">
            {offers.map((offer, i) => (
              <div className="special-card" key={i}>
                <div className="special-image">
                  <img src={offer.image} alt={offer.title} loading="lazy" />
                  <span className="special-badge">{offer.badge}</span>
                </div>
                <div className="special-body">
                  <h3>{offer.title}</h3>
                  <p className="special-desc">{offer.desc}</p>
                  <span className="special-valid">{offer.valid}</span>
                  <button className="btn-special" onClick={() => openOfferConfig(offer)}>Customize & Add</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="menu-section">
        <div className="container">
          <div className="category-pills fade-in">
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`category-pill ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                <cat.Icon />
                <span className="pill-label">{cat.label}</span>
              </button>
            ))}
          </div>

          {activeCategory === 'all' && (
            <div className="featured-section">
              <div className="section-heading-row">
                <h2>✦ Barista's Favorites</h2>
                <p>Handpicked favorites, loved by our customers</p>
              </div>
              <div className="featured-grid fade-in">
                {featuredItems.map(item => renderFeaturedCard(item))}
              </div>
            </div>
          )}
        </div>
      </section>

      {activeCategory === 'all' ? (
        Object.keys(categoryMeta).map(catId => {
          const cat = categories.find(c => c.id === catId)
          const meta = categoryMeta[catId]
          const items = menuItems.filter(item => item.category === catId)
          if (!items.length) return null
          return (
            <section className="menu-section category-section" key={catId}>
              <div className="container">
                <div className="section-header fade-in">
                  <div className="section-header-left">
                    <meta.Icon />
                    <h2>{cat.label}</h2>
                  </div>
                  <p className="section-header-desc">{meta.desc}</p>
                </div>
                <div className="menu-grid fade-in">
                  {items.map(item => renderMenuCard(item))}
                </div>
              </div>
            </section>
          )
        })
      ) : (
        <section className="menu-section category-section">
          <div className="container">
            {(() => {
              const cat = categories.find(c => c.id === activeCategory)
              const meta = categoryMeta[activeCategory]
              return (
                <>
                   <div className="section-header fade-in">
                    <div className="section-header-left">
                      <meta.Icon />
                      <h2>{cat.label}</h2>
                    </div>
                    <p className="section-header-desc">{meta.desc}</p>
                  </div>
                  <div className="menu-grid fade-in">
                    {menuItems.filter(item => item.category === activeCategory).map(item => renderMenuCard(item))}
                  </div>
                </>
              )
            })()}
          </div>
        </section>
      )}
        {renderOfferModal()}
    </div>
  )
}

export default Menu
