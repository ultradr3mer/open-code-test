import { useEffect, useState } from 'react'
import './Portfolio.css'
import portfolioData from './portfolio.json'

const skills = ['Three.js', 'GLSL', 'React', 'TypeScript', 'Figma', 'Node.js']

export default function Portfolio() {
  const [projects] = useState(portfolioData)
  const [activeProject, setActiveProject] = useState(null)
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    if (!activeProject) return
    const onKey = (e) => {
      if (e.key === 'Escape') setActiveProject(null)
      if (e.key === 'ArrowRight') setActiveImage((i) => (i + 1) % activeProject.images.length)
      if (e.key === 'ArrowLeft')
        setActiveImage((i) => (i - 1 + activeProject.images.length) % activeProject.images.length)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [activeProject])

  const openGallery = (project) => {
    setActiveProject(project)
    setActiveImage(0)
  }

  const closeGallery = () => setActiveProject(null)

  const linkEntries = activeProject
    ? Object.entries(activeProject.links).flatMap(([type, value]) =>
        Array.isArray(value) ? value.map((v) => [type, v]) : [[type, value]]
      )
    : []

  return (
    <div className="pf-overlay">
      {/* Hero */}
      <section className="pf-hero glass">
        <p className="pf-eyebrow">Creative Developer</p>
        <div className="hero-image-background hover-gradient">
        <div className="pf-hero-image" aria-label="Jane Doe">
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
        <div className="pf-gallery-overlay" onClick={closeGallery}>
          <div className="pf-gallery" onClick={(e) => e.stopPropagation()}>
            <button className="pf-gallery-close" onClick={closeGallery} aria-label="Close">&times;</button>
            <div className="pf-gallery-header">
              <h2>{activeProject.name}</h2>
              <p>{activeProject.description}</p>
            </div>
            <div className="pf-gallery-stage">
              {activeProject.images.length > 1 && (
                <button
                  className="pf-gallery-nav pf-gallery-prev"
                  onClick={() => setActiveImage((i) => (i - 1 + activeProject.images.length) % activeProject.images.length)}
                  aria-label="Previous"
                >&lsaquo;</button>
              )}
              <img className="pf-gallery-image" src={activeProject.images[activeImage]} alt={activeProject.name} />
              {activeProject.images.length > 1 && (
                <button
                  className="pf-gallery-nav pf-gallery-next"
                  onClick={() => setActiveImage((i) => (i + 1) % activeProject.images.length)}
                  aria-label="Next"
                >&rsaquo;</button>
              )}
            </div>
            {activeProject.images.length > 1 && (
              <div className="pf-gallery-thumbs">
                {activeProject.images.map((img, i) => (
                  <button
                    key={img}
                    className={'pf-gallery-thumb' + (i === activeImage ? ' active' : '')}
                    onClick={() => setActiveImage(i)}
                  >
                    <img src={img} alt="" />
                  </button>
                ))}
              </div>
            )}
            <div className="pf-gallery-links">
              {linkEntries.map(([type, url]) => (
                <a key={url} className="pf-btn pf-btn-ghost" href={url} target="_blank" rel="noreferrer">
                  {type === 'github' ? 'GitHub' : type.charAt(0).toUpperCase() + type.slice(1)} &rarr;
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
