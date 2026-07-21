import { useState } from 'react'
import { useCart } from '../context/CartContext'
import './Menu.css'

const categories = [
  { id: 'all', label: 'All Items' },
  { id: 'coffee', label: 'Coffee' },
  { id: 'tea', label: 'Tea' },
  { id: 'cold', label: 'Cold Drinks' },
  { id: 'desserts', label: 'Desserts' },
]

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
  { id: 10, category: 'cold', name: 'Iced Latte', desc: 'Chilled espresso over milk, served over ice', price: '$5.00', priceNum: 5.00, rating: 4.7, featured: false, tags: ['Cold', 'Milk-Based'], image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&h=360&fit=crop' },
  { id: 11, category: 'cold', name: 'Cold Brew', desc: 'Slow-steeped 20 hours for smooth richness', price: '$4.75', priceNum: 4.75, rating: 4.9, featured: true, tags: ['Cold', 'Strong'], image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=500&h=360&fit=crop' },
  { id: 12, category: 'cold', name: 'Frappé', desc: 'Blended coffee with vanilla and whipped cream', price: '$5.95', priceNum: 5.95, rating: 4.6, featured: false, tags: ['Cold', 'Milk-Based'], image: 'https://images.unsplash.com/photo-1525803377221-38054396960a?w=500&h=360&fit=crop' },
  { id: 13, category: 'cold', name: 'Iced Matcha', desc: 'Chilled matcha with oat milk over ice', price: '$5.25', priceNum: 5.25, rating: 4.5, featured: false, tags: ['Cold', 'Milk-Based'], image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=500&h=360&fit=crop' },
  { id: 14, category: 'desserts', name: 'Tiramisu', desc: 'Classic Italian coffee-soaked ladyfingers', price: '$6.50', priceNum: 6.50, rating: 4.9, featured: true, tags: ['Vegan Option'], image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&h=360&fit=crop' },
  { id: 15, category: 'desserts', name: 'Croissant', desc: 'Buttery, flaky French pastry, baked fresh daily', price: '$4.25', priceNum: 4.25, rating: 4.7, featured: false, tags: ['Vegan Option'], image: 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=500&h=360&fit=crop' },
  { id: 16, category: 'desserts', name: 'Cheesecake', desc: 'Creamy New York style with berry compote', price: '$6.75', priceNum: 6.75, rating: 4.8, featured: true, tags: [], image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500&h=360&fit=crop' },
  { id: 17, category: 'desserts', name: 'Chocolate Brownie', desc: 'Rich dark chocolate brownie with sea salt', price: '$5.50', priceNum: 5.50, rating: 4.7, featured: false, tags: ['Vegan Option'], image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&h=360&fit=crop' },
]

function Menu() {
  const [activeCategory, setActiveCategory] = useState('all')
  const { addItem } = useCart()

  const featuredItems = menuItems.filter(item => item.featured)
  const filteredItems = activeCategory === 'all'
    ? menuItems
    : menuItems.filter(item => item.category === activeCategory)

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

  const renderItem = (item) => (
    <div className="menu-card" key={item.id}>
      <div className="menu-card-image">
        <img src={item.image} alt={item.name} loading="lazy" />
        {item.featured && <span className="menu-card-badge">Barista's Pick</span>}
      </div>
      <div className="menu-card-body">
        <div className="menu-card-top">
          <h3 className="menu-card-name">{item.name}</h3>
          <span className="menu-card-price">{item.price}</span>
        </div>
        <div className="menu-card-rating">
          {renderStars(item.rating)}
          <span className="rating-number">{item.rating}</span>
        </div>
        <p className="menu-card-desc">{item.desc}</p>
        <div className="menu-card-footer">
          <div className="menu-card-tags">
            {item.tags.map((tag, i) => (
              <span className="menu-tag" key={i}>{tag}</span>
            ))}
          </div>
          <button className="btn btn-primary btn-add-cart" onClick={() => addItem(item)}>+ Add</button>
        </div>
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

      <section className="menu-section">
        <div className="container">
          <div className="featured-section fade-in">
            <div className="featured-header">
              <span className="featured-icon">✦</span>
              <h2>Barista's Favorites</h2>
            </div>
            <p className="featured-sub">The drinks and treats our team reaches for on every shift</p>
            <div className="featured-grid">
              {featuredItems.slice(0, 4).map(item => renderItem(item))}
            </div>
          </div>
        </div>
      </section>

      <section className="menu-section menu-section-alt">
        <div className="container">
          <div className="menu-filters fade-in">
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`menu-filter-btn ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="menu-grid fade-in">
            {filteredItems.map(item => renderItem(item))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Menu
