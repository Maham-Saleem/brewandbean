import { useState } from 'react'
import { useCart } from '../context/CartContext'
import './Menu.css'

const categories = [
  { id: 'all', label: 'All' },
  { id: 'coffee', label: 'Coffee' },
  { id: 'tea', label: 'Tea' },
  { id: 'cold', label: 'Cold Drinks' },
  { id: 'desserts', label: 'Desserts' },
]

export const menuItems = [
  { id: 1, category: 'coffee', name: 'Espresso', desc: 'Rich single-origin espresso shot with honey undertones', price: '$3.50', priceNum: 3.50, image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400&h=300&fit=crop' },
  { id: 2, category: 'coffee', name: 'Americano', desc: 'Smooth espresso lengthened with hot water', price: '$4.00', priceNum: 4.00, image: 'https://images.unsplash.com/photo-1551030173-122aabc4489c?w=400&h=300&fit=crop' },
  { id: 3, category: 'coffee', name: 'Cappuccino', desc: 'Equal parts espresso, steamed milk, and velvety foam', price: '$5.00', priceNum: 5.00, image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop' },
  { id: 4, category: 'coffee', name: 'Flat White', desc: 'Double espresso with silky microfoam', price: '$5.25', priceNum: 5.25, image: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=400&h=300&fit=crop' },
  { id: 5, category: 'coffee', name: 'Mocha', desc: 'Espresso with dark chocolate and steamed milk', price: '$5.75', priceNum: 5.75, image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&h=300&fit=crop' },
  { id: 6, category: 'tea', name: 'Earl Grey', desc: 'Classic bergamot-infused black tea', price: '$3.75', priceNum: 3.75, image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400&h=300&fit=crop' },
  { id: 7, category: 'tea', name: 'Matcha', desc: 'Premium ceremonial-grade matcha whisked to perfection', price: '$4.50', priceNum: 4.50, image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400&h=300&fit=crop' },
  { id: 8, category: 'tea', name: 'Chamomile', desc: 'Calming herbal blend with honey and lavender', price: '$3.50', priceNum: 3.50, image: 'https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?w=400&h=300&fit=crop' },
  { id: 9, category: 'tea', name: 'Chai Latte', desc: 'Spiced black tea concentrate with steamed milk', price: '$5.00', priceNum: 5.00, image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&h=300&fit=crop' },
  { id: 10, category: 'cold', name: 'Iced Latte', desc: 'Chilled espresso over milk, served over ice', price: '$5.00', priceNum: 5.00, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop' },
  { id: 11, category: 'cold', name: 'Cold Brew', desc: 'Slow-steeped 20 hours for smooth richness', price: '$4.75', priceNum: 4.75, image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=400&h=300&fit=crop' },
  { id: 12, category: 'cold', name: 'Frappé', desc: 'Blended coffee with vanilla and whipped cream', price: '$5.95', priceNum: 5.95, image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=400&h=300&fit=crop' },
  { id: 13, category: 'cold', name: 'Iced Matcha', desc: 'Chilled matcha with oat milk over ice', price: '$5.25', priceNum: 5.25, image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400&h=300&fit=crop' },
  { id: 14, category: 'desserts', name: 'Tiramisu', desc: 'Classic Italian coffee-soaked ladyfingers', price: '$6.50', priceNum: 6.50, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop' },
  { id: 15, category: 'desserts', name: 'Croissant', desc: 'Buttery, flaky French pastry, baked fresh daily', price: '$4.25', priceNum: 4.25, image: 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=400&h=300&fit=crop' },
  { id: 16, category: 'desserts', name: 'Cheesecake', desc: 'Creamy New York style with berry compote', price: '$6.75', priceNum: 6.75, image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&h=300&fit=crop' },
  { id: 17, category: 'desserts', name: 'Chocolate Brownie', desc: 'Rich dark chocolate brownie with sea salt', price: '$5.50', priceNum: 5.50, image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=300&fit=crop' },
]

function Menu() {
  const [activeCategory, setActiveCategory] = useState('all')
  const { addItem } = useCart()

  const filteredItems = activeCategory === 'all'
    ? menuItems
    : menuItems.filter(item => item.category === activeCategory)

  return (
    <div className="menu-page">
      <section className="page-hero menu-hero">
        <div className="container page-hero-content">
          <h1>Our Menu</h1>
          <p>Carefully crafted beverages and treats for every moment</p>
        </div>
      </section>

      <section className="section">
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

          <div className="menu-grid">
            {filteredItems.map((item, i) => (
              <div className="menu-item fade-in" key={item.id} style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="menu-item-image">
                  <img src={item.image} alt={item.name} loading="lazy" />
                </div>
                <div className="menu-item-info">
                  <div className="menu-item-header">
                    <h3>{item.name}</h3>
                    <span className="menu-item-price">{item.price}</span>
                  </div>
                  <p>{item.desc}</p>
                  <button className="btn-add-cart" onClick={() => addItem(item)}>Add to Order</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Menu
