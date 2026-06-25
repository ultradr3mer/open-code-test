import { useState } from 'react'
import './Portfolio.css'
import portfolioData from './portfolio.json'
import GalleryModal from './GalleryModal'

const skills = ['Three.js', 'GLSL', 'React', 'TypeScript', 'Figma', 'Node.js']

export default function Portfolio() {
  const [projects] = useState(portfolioData)
  const [activeProject, setActiveProject] = useState(null)

  const openGallery = (project) => setActiveProject(project)
  const closeGallery = () => setActiveProject(null)

  return (
    <div className="pf-overlay">
      {/* Hero */}
      <section className="pf-hero glass">
        <p className="pf-eyebrow">Creative Developer</p>
        <div className="hero-image-background hover-gradient">
        <div className="pf-hero-image hover-gradient-dark" aria-label="Jane Doe">
          <div className="pf-hero-name">//CLARA</div>
        </div>
        </div>
        <p className="pf-tagline">
          I build interactive experiences where design meets code —<br />
          from pixel-perfect interfaces to real-time 3D.
        </p>
        <div className="pf-skills">
          {skills.map(s => (
            <span key={s} className="pf-skill-tag">{s}</span>
          ))}
        </div>
        <div className="pf-cta-row">
          <a href="#" className="pf-btn pf-btn-primary">View Work</a>
          <a href="#" className="pf-btn pf-btn-ghost">Contact</a>
        </div>
      </section>

      {/* Projects */}
      <section className="pf-projects">
        {projects.map(p => (
          <article key={p.name} className="pf-card glass" onClick={() => openGallery(p)}>
            <div className="pf-card-meta">
              <span className="tag-background hover-gradient">
                <img className="pf-card-icon" src={p.icon} alt="" />
              </span>
            </div>
            <h2 className="pf-card-title">{p.name}</h2>
            <p className="pf-card-desc">{p.description}</p>
            <span className="pf-card-link">View project &rarr;</span>
          </article>
        ))}
      </section>

      {/* Gallery Modal */}
      {activeProject && (
        <GalleryModal project={activeProject} onClose={closeGallery} />
      )}
    </div>
  )
}
