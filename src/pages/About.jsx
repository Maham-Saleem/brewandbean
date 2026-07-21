import { Link } from 'react-router-dom'
import './About.css'

const values = [
  { title: 'Quality First', desc: 'We source the finest beans from sustainable farms around the world, ensuring every cup meets our exacting standards.' },
  { title: 'Community Heart', desc: 'Our café is more than a business — it\'s a gathering place where friendships bloom and ideas flow freely.' },
  { title: 'Crafted with Care', desc: 'Every drink is handcrafted by skilled baristas who pour their passion into each preparation.' },
  { title: 'Sustainable Practice', desc: 'From compostable packaging to ethical sourcing, we\'re committed to protecting our planet.' },
]

const team = [
  { name: 'Elena Rossi', role: 'Founder & Head Roaster', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=face' },
  { name: 'Marcus Chen', role: 'Master Barista', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face' },
  { name: 'Sophia Patel', role: 'Pastry Chef', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face' },
]

function About() {
  return (
    <div className="about">
      <section className="page-hero about-hero">
        <div className="container page-hero-content">
          <h1>Our Story</h1>
          <p>From a simple dream to your neighborhood coffee haven</p>
        </div>
      </section>

      <section className="section story-section">
        <div className="container story-grid">
          <div className="story-image fade-in">
            <img src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=600&h=400&fit=crop" alt="Coffee beans and brewing" loading="lazy" />
          </div>
          <div className="story-text fade-in">
            <span className="story-label">Since 2015</span>
            <h2>The Brew & Bean Journey</h2>
            <p>Brew & Bean Coffee House was born from a simple belief: that great coffee has the power to bring people together. Founded in 2015 by Elena Rossi, our café started as a small corner shop with a big dream — to create a space where quality coffee and genuine connection meet.</p>
            <p>Over the years, we've grown from a single espresso machine to a beloved community staple, roasting our own beans and perfecting recipes that keep our guests coming back. Every cup we serve carries the same passion and dedication that started it all.</p>
            <p>Today, Brew & Bean remains independently owned and operated, staying true to our roots while always looking for new ways to delight our community.</p>
          </div>
        </div>
      </section>

      <section className="section mission-section">
        <div className="container">
          <h2 className="section-title fade-in">Our Mission & Values</h2>
          <p className="section-subtitle fade-in">The principles that guide everything we do</p>
          <div className="values-grid">
            {values.map((v, i) => (
              <div className="value-card fade-in" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="value-number">0{i + 1}</div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section team-section">
        <div className="container">
          <h2 className="section-title fade-in">Meet Our Team</h2>
          <p className="section-subtitle fade-in">The passionate people behind your perfect cup</p>
          <div className="team-grid">
            {team.map((member, i) => (
              <div className="team-card fade-in" key={i} style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="team-image">
                  <img src={member.image} alt={member.name} loading="lazy" />
                </div>
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-banner">
        <div className="container cta-content">
          <h2>Come experience the difference</h2>
          <p>Visit us and taste the passion in every cup.</p>
          <Link to="/contact" className="btn btn-primary">Find Our Café</Link>
        </div>
      </section>
    </div>
  )
}

export default About
