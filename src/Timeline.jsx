import timelineData from './timeline.json'

const formatPeriod = (period) => {
  const format = (m) => {
    if (m === 'current') return 'Present'
    const [y, mo] = m.split('-')
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${months[parseInt(mo, 10) - 1]} ${y}`
  }
  return `${format(period.from)} — ${format(period.to)}`
}

const TimelineEntry = ({ entry, type }) => (
  <div className="pf-timeline-item">
    <span class="tag-background-mirror hover-gradient-mirror">
      <img class="pf-card-icon-mirror" alt="" src={entry.image}/>
    </span>
    <div className="pf-timeline-content glass">
      <span className="pf-timeline-period">{formatPeriod(entry.period)}</span>
      <h3 className="pf-timeline-title">
        {type === 'professional' ? entry.role : entry.program}
      </h3>
      <p className="pf-timeline-org">
        {type === 'professional' ? entry.company : entry.institution}
      </p>
      <p className="pf-timeline-desc">{entry.description}</p>
    </div>
  </div>
)

export default function Timeline() {
  return (
    <section className="pf-timeline">
      <div className="pf-timeline-column">
        <h2 className="pf-section-title">Experience</h2>
        {timelineData.professional.map((entry) => (
          <TimelineEntry key={entry.company} entry={entry} type="professional" />
        ))}
      </div>
      <div className="pf-timeline-column">
        <h2 className="pf-section-title">Education</h2>
        {timelineData.education.map((entry) => (
          <TimelineEntry key={entry.institution} entry={entry} type="education" />
        ))}
      </div>
    </section>
  )
}
