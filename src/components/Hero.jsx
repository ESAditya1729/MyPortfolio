import { useSectionReveal } from '../hooks/useSectionReveal.js'

export default function Hero({ data, index, total, sections }) {
  const ref = useSectionReveal(index, total, sections)
  return (
    <section className="content-section align-center hero-section" id={data.id} ref={ref} style={{ minHeight: `${(data.scrollPages ?? 1) * 100}svh` }}>
      <div className="section-panel">
        {/* Avatar */}
        <div className="hero-avatar" aria-hidden="true">AM</div>

        {/* Location badge */}
        <span className="kicker">
          <span className="hero-title-dot" />
          {data.location}
        </span>

        {/* Name */}
        <h1 className="hero-name">{data.heading}</h1>

        {/* Title with live dot */}
        <p className="hero-title-badge">
          <span className="hero-title-dot" />
          {data.subheading}
        </p>

        {/* Divider */}
        <div className="hero-divider" />

        {/* Stats row */}
        <div className="hero-meta">
          <span className="hero-meta-item">
            <span className="dot" />
            4 yrs experience
          </span>
          <span className="hero-meta-item">
            <span className="dot" />
            Azure · Full-Stack
          </span>
          <span className="hero-meta-item">
            <span className="dot" />
            Available for work
          </span>
        </div>

        {/* Scroll hint */}
        <span className="scroll-hint">scroll to explore ↓</span>
      </div>
    </section>
  )
}
