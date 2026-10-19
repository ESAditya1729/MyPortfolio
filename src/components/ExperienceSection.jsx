import { useSectionReveal } from '../hooks/useSectionReveal.js'

// Returns class name for the company badge
function companyClass(company) {
  if (company.toLowerCase().includes('ibm')) return 'company-ibm'
  if (company.toLowerCase().includes('hcl')) return 'company-hcl'
  return 'company-hcl'
}

export default function ExperienceSection({ data, index, total, sections }) {
  const ref = useSectionReveal(index, total, sections)
  return (
    <section className="content-section align-left experience-section" id={data.id} ref={ref} style={{ minHeight: `${(data.scrollPages ?? 1) * 100}svh` }}>
      <div className="section-panel">
        <span className="kicker">03 — Experience</span>
        <h2>{data.heading}</h2>
        <div className="timeline">
          {data.items.map((job) => (
            <div className="timeline-item" key={`${job.company}-${job.role}`}>
              <div className="timeline-dot" />
              <div className="timeline-header">
                <h3>{job.role}</h3>
                <div className="timeline-company-row">
                  <span className={`timeline-company-badge ${companyClass(job.company)}`}>
                    {job.company}
                  </span>
                  <span className="timeline-period">{job.period}</span>
                </div>
              </div>
              <ul className="timeline-points">
                {job.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
