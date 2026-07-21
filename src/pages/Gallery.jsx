import { useState } from 'react'
import './Gallery.css'

const galleryImages = [
  { src: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&h=500&fit=crop', alt: 'Cozy cafe interior', category: 'interior' },
  { src: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=500&fit=crop', alt: 'Coffee being poured', category: 'coffee' },
  { src: 'https://images.unsplash.com/photo-1512568400610-62d28a249f5a?w=600&h=500&fit=crop', alt: 'Latte art', category: 'coffee' },
  { src: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&h=500&fit=crop', alt: 'Pastry display', category: 'food' },
  { src: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=600&h=500&fit=crop', alt: 'Cafe ambiance', category: 'interior' },
  { src: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=500&fit=crop', alt: 'Pour over coffee', category: 'coffee' },
  { src: 'https://images.unsplash.com/photo-1554646533-de2d01895a23?w=600&h=500&fit=crop', alt: 'Coffee beans', category: 'coffee' },
  { src: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&h=500&fit=crop', alt: 'Dessert selection', category: 'food' },
  { src: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=600&h=500&fit=crop', alt: 'Coffee roasting', category: 'coffee' },
  { src: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&h=500&fit=crop', alt: 'Cafe exterior', category: 'interior' },
  { src: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&h=500&fit=crop', alt: 'Pastries', category: 'food' },
  { src: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600&h=500&fit=crop', alt: 'Matcha latte', category: 'coffee' },
]

const filters = [
  { id: 'all', label: 'All' },
  { id: 'interior', label: 'Interior' },
  { id: 'coffee', label: 'Coffee' },
  { id: 'food', label: 'Food & Treats' },
]

function Gallery() {
  const [activeFilter, setActiveFilter] = useState('all')

  const filtered = activeFilter === 'all'
    ? galleryImages
    : galleryImages.filter(img => img.category === activeFilter)

  return (
    <div className="gallery-page">
      <section className="page-hero gallery-hero">
        <div className="container page-hero-content">
          <h1>Our Gallery</h1>
          <p>A visual journey through Brew & Bean</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="gallery-filters fade-in">
            {filters.map(f => (
              <button
                key={f.id}
                className={`gallery-filter-btn ${activeFilter === f.id ? 'active' : ''}`}
                onClick={() => setActiveFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="gallery-grid">
            {filtered.map((img, i) => (
              <div className="gallery-item fade-in" key={i} style={{ animationDelay: `${i * 0.05}s` }}>
                <img src={img.src} alt={img.alt} loading="lazy" />
                <div className="gallery-overlay">
                  <span>{img.alt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Gallery
