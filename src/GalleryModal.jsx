import { useEffect, useState } from 'react'

export default function GalleryModal({ project, onClose }) {
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') setActiveImage((i) => (i + 1) % project.images.length)
      if (e.key === 'ArrowLeft')
        setActiveImage((i) => (i - 1 + project.images.length) % project.images.length)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [project, onClose])

  const linkEntries = Object.entries(project.links).flatMap(([type, value]) =>
    Array.isArray(value) ? value.map((v) => [type, v]) : [[type, value]]
  )

  return (
    <div className="pf-gallery-overlay" onClick={onClose}>
      <div className="pf-gallery" onClick={(e) => e.stopPropagation()}>
        <button className="pf-gallery-close" onClick={onClose} aria-label="Close">&times;</button>
        <div className="pf-gallery-header">
          <h2>{project.name}</h2>
          <p>{project.description}</p>
        </div>
        <div className="pf-gallery-stage">
          {project.images.length > 1 && (
            <button
              className="pf-gallery-nav pf-gallery-prev"
              onClick={() => setActiveImage((i) => (i - 1 + project.images.length) % project.images.length)}
              aria-label="Previous"
            >&lsaquo;</button>
          )}
          <img className="pf-gallery-image" src={project.images[activeImage]} alt={project.name} />
          {project.images.length > 1 && (
            <button
              className="pf-gallery-nav pf-gallery-next"
              onClick={() => setActiveImage((i) => (i + 1) % project.images.length)}
              aria-label="Next"
            >&rsaquo;</button>
          )}
        </div>
        {project.images.length > 1 && (
          <div className="pf-gallery-thumbs">
            {project.images.map((img, i) => (
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
  )
}
