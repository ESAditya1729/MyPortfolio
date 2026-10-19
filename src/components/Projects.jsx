import { useSectionReveal } from '../hooks/useSectionReveal.js'

const TAG_CLASS = {
  orange: 'skill-tag cloud',
  teal: 'skill-tag fullstack',
  purple: 'skill-tag data',
  pink: 'skill-tag pink',
}

const CARD_ACCENT = {
  orange: 'project-card--orange',
  teal:   'project-card--teal',
  purple: 'project-card--purple',
  pink:   'project-card--pink',
}

function ExternalLinkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
}

export default function Projects({ data, index, total, sections }) {
  const ref = useSectionReveal(index, total, sections)
  return (
    <section className="content-section align-right projects-section" id={data.id} ref={ref} style={{ minHeight: `${(data.scrollPages ?? 1) * 100}svh` }}>
      <div className="section-panel projects-panel">
        <span className="kicker">04 — Projects</span>
        <h2>{data.heading}</h2>
        <div className="projects-grid">
          {data.items.map((project) => (
            <a
              key={project.name}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`project-card ${CARD_ACCENT[project.color] ?? 'project-card--orange'}`}
            >
              <div className="project-card-top">
                <span className="project-name">{project.name}</span>
                <span className="project-link-icon"><ExternalLinkIcon /></span>
              </div>
              <p className="project-tagline">{project.tagline}</p>
              <p className="project-desc">{project.desc}</p>
              <div className="project-tags">
                {project.tags.map((tag) => (
                  <span key={tag} className={TAG_CLASS[project.color] ?? 'skill-tag cloud'}>
                    {tag}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
