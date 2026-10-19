import { useSectionReveal } from '../hooks/useSectionReveal.js'

// Maps each skills group index to a CSS variant class
const GROUP_CLASSES = ['cloud', 'fullstack', 'data']
const GROUP_DOTS = ['#f07340', '#4ecdbe', '#a78bfa']

export default function Skills({ data, index, total, sections }) {
  const ref = useSectionReveal(index, total, sections)
  return (
    <section className="content-section align-right skills-section" id={data.id} ref={ref} style={{ minHeight: `${(data.scrollPages ?? 1) * 100}svh` }}>
      <div className="section-panel">
        <span className="kicker">02 — Skills</span>
        <h2>{data.heading}</h2>
        <div className="skills-groups">
          {data.groups.map((group, gi) => (
            <div className="skills-group" key={group.label}>
              <div className="skills-group-header">
                <span
                  className="skills-group-dot"
                  style={{ background: GROUP_DOTS[gi % GROUP_DOTS.length] }}
                />
                <span className="skills-group-label">{group.label}</span>
                <span className="skills-group-line" />
              </div>
              <ul className="skills-list">
                {group.items.map((item) => (
                  <li key={item} className={`skill-tag ${GROUP_CLASSES[gi % GROUP_CLASSES.length]}`}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
