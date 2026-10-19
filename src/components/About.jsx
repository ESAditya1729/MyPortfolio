import { useSectionReveal } from '../hooks/useSectionReveal.js'

export default function About({ data, index, total, sections }) {
  const ref = useSectionReveal(index, total, sections)
  return (
    <section className="content-section align-left about-section" id={data.id} ref={ref} style={{ minHeight: `${(data.scrollPages ?? 1) * 100}svh` }}>
      <div className="section-panel">
        <span className="kicker">01 — About</span>
        <h2>{data.heading}</h2>
        <p className="body-text">{data.body}</p>
        <div className="about-highlights">
          <span className="about-highlight-badge badge-orange">Azure Cloud</span>
          <span className="about-highlight-badge badge-teal">Data Engineering</span>
          <span className="about-highlight-badge badge-pink">Full-Stack</span>
          <span className="about-highlight-badge badge-purple">4 Years</span>
        </div>
      </div>
    </section>
  )
}
