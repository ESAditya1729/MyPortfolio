import { sections } from '../data/content.js'
import Hero from './Hero.jsx'
import About from './About.jsx'
import Skills from './Skills.jsx'
import ExperienceSection from './ExperienceSection.jsx'
import Projects from './Projects.jsx'
import Contact from './Contact.jsx'

const componentsById = {
  hero: Hero,
  about: About,
  skills: Skills,
  experience: ExperienceSection,
  projects: Projects,
  contact: Contact,
}

export default function ContentSections() {
  const total = sections.length
  return (
    <div className="content-sections">
      {sections.map((data, index) => {
        const SectionComponent = componentsById[data.id]
        return (
          <SectionComponent
            data={data}
            index={index}
            key={data.id}
            total={total}
            sections={sections}
          />
        )
      })}
    </div>
  )
}
