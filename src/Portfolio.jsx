import './Portfolio.css'

const projects = [
  {
    tag: 'Web',
    title: 'Design System',
    desc: 'A component library built for scale — tokens, patterns, and documentation in one place.',
    year: '2024',
  },
  {
    tag: '3D',
    title: 'Wave Renderer',
    desc: 'Real-time procedural mesh displacement using custom GLSL shaders and Three.js.',
    year: '2024',
  },
  {
    tag: 'App',
    title: 'Dashboard UI',
    desc: 'Analytics platform with live data streams, configurable widgets, and dark-mode first.',
    year: '2023',
  },
]

const skills = ['Three.js', 'GLSL', 'React', 'TypeScript', 'Figma', 'Node.js']

export default function Portfolio() {
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
          <article key={p.title} className="pf-card glass">
            <div className="pf-card-meta">
              <span className="tag-background hover-gradient">
                <span className="pf-tag">{p.tag}</span>
              </span>
              <span className="pf-year">{p.year}</span>
            </div>
            <h2 className="pf-card-title">{p.title}</h2>
            <p className="pf-card-desc">{p.desc}</p>
            <a href="#" className="pf-card-link">View project &rarr;</a>
          </article>
        ))}
      </section>
    </div>
  )
}
