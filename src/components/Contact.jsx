import { useSectionReveal } from '../hooks/useSectionReveal.js'

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.5 2.87 8.32 6.84 9.67.5.1.68-.22.68-.49 0-.24-.01-1.05-.01-1.9-2.78.62-3.37-1.21-3.37-1.21-.46-1.2-1.11-1.51-1.11-1.51-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.34-1.11.62-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.04 1.03-2.76-.1-.26-.45-1.3.1-2.72 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5 0c1.9-1.33 2.75-1.05 2.75-1.05.55 1.42.2 2.46.1 2.72.64.72 1.03 1.64 1.03 2.76 0 3.94-2.35 4.81-4.58 5.06.36.33.68.96.68 1.94 0 1.4-.01 2.53-.01 2.87 0 .27.18.6.69.49A10.02 10.02 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5.001 2.5 2.5 0 0 1 0-5ZM3.5 9.98h3v10.02h-3V9.98Zm6.5 0h2.88v1.37h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.6v5.61h-3v-4.97c0-1.19-.02-2.72-1.66-2.72-1.66 0-1.92 1.3-1.92 2.63v5.06h-3V9.98Z" />
    </svg>
  )
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M12 21s-7-6.1-7-11.3A7 7 0 0 1 19 9.7C19 14.9 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.3" />
    </svg>
  )
}

export default function Contact({ data, index, total, sections }) {
  const ref = useSectionReveal(index, total, sections)
  return (
    <section className="content-section align-center contact-section" id={data.id} ref={ref} style={{ minHeight: `${(data.scrollPages ?? 1) * 100}svh` }}>
      <div className="section-panel">
        <span className="kicker">05 — Contact</span>
        <h2>{data.heading}</h2>
        <a className="contact-email-btn" href={`mailto:${data.email}`}>
          <MailIcon />
          {data.email}
        </a>
        <div className="contact-links">
          <a href={data.links.github} className="github" aria-label="GitHub">
            <GitHubIcon />
            GitHub
          </a>
          <a href={data.links.linkedin} className="linkedin" aria-label="LinkedIn">
            <LinkedInIcon />
            LinkedIn
          </a>
          <span className="contact-location">
            <PinIcon />
            {data.location}
          </span>
        </div>
      </div>
    </section>
  )
}
