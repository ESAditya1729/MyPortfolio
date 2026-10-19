// scrollPages: how many viewport-heights of scroll this section gets.
// Total must equal the `pages` prop passed to <ScrollControls>.
export const TOTAL_PAGES = 9

export const sections = [
  {
    id: 'hero',
    scrollPages: 1,
    heading: 'Aditya Mukherjee',
    subheading: 'Cloud Data Engineer — Azure & Full-Stack',
    location: 'India',
  },
  {
    id: 'about',
    scrollPages: 1,
    heading: 'About',
    body: "Cloud Data Engineer with 4 years' experience across Azure Data Factory, Synapse, Databricks, and enterprise integration (Logic Apps, API Management). Equally comfortable building full-stack apps with React, Node.js, and Express — and crafting AI Agents powered by IBM Consulting Advantage.",
  },
  {
    id: 'skills',
    scrollPages: 1,
    heading: 'Skills',
    groups: [
      {
        label: 'Cloud & Data',
        items: [
          'Azure Data Factory',
          'Synapse Analytics',
          'Databricks',
          'Azure Functions',
          'Logic Apps',
          'API Management',
          'Azure Data Explorer',
          'Azure Storage',
          'Azure App Services',
          'Application Insights',
          'Terraform',
        ],
      },
      {
        label: 'Full-Stack',
        items: ['React.js', 'Node.js', 'Express.js', 'JavaScript', 'HTML', 'CSS', 'Tailwind CSS', 'C#', '.NET', 'ASP.NET MVC'],
      },
      {
        label: 'Data & AI',
        items: ['SQL Server', 'Python', 'Machine Learning', 'GenAI', 'AI Agents', 'LangChain', 'Azure DevOps (CI/CD)', 'PowerShell', 'Git', 'GitHub'],
      },
    ],
  },
  {
    id: 'experience',
    scrollPages: 2.5,
    heading: 'Experience',
    items: [
      {
        role: 'Application Developer — Azure Cloud & AI',
        company: 'IBM',
        period: 'Dec 2025 — Present',
        points: [
          'Designing and building end-to-end Azure Data Factory pipelines for enterprise data ingestion, transformation, and delivery across multi-cloud environments.',
          'Developing AI Agents using IBM Consulting Advantage (ICA) and LangChain to automate document analysis, workflow orchestration, and intelligent Q&A over enterprise data.',
          'Provisioning and managing cloud infrastructure on Azure using Terraform — enabling reproducible, version-controlled deployments for data platforms.',
          'Driving CI/CD excellence with Azure DevOps pipelines: automated testing, infra deployment, and release gates across dev, staging, and production.',
          'Contributing to GenAI-powered tooling for internal developer productivity, including an AI-assisted code review and documentation synthesizer.',
        ],
      },
      {
        role: 'Senior Software Engineer',
        company: 'HCLTech',
        period: 'Oct 2024 — Dec 2025',
        points: [
          'Architected and deployed enterprise-grade Azure iPaaS solutions (Logic Apps, API Management, Service Bus) supporting 10+ business-critical integrations across finance, supply chain, and HR.',
          'Led migration of on-prem workloads to Azure, reducing infrastructure costs by 30% and improving system uptime to 99.9% SLA compliance.',
          'Designed secure, reusable integration frameworks enabling 40% faster onboarding of new partners and applications.',
          'Mentored and guided a team of 5 junior engineers, fostering best practices in DevOps and cloud security.',
        ],
      },
      {
        role: 'Software Engineer',
        company: 'HCLTech',
        period: 'Dec 2021 — Oct 2024',
        points: [
          'Developed and managed 20+ ETL pipelines in ADF and Databricks, processing terabytes of structured and unstructured data daily.',
          'Optimized SQL queries and Delta Lake performance, reducing data processing time by 45% and cutting compute costs by 20%.',
          'Built scalable Data Lake and Warehouse models supporting analytics for 300+ business users across finance, sales, and operations.',
          'Automated incremental data ingestion from 15+ source systems, ensuring 99% data availability for reporting.',
        ],
      },
    ],
  },
  {
    id: 'projects',
    scrollPages: 2,
    heading: 'Projects',
    items: [
      {
        name: 'Blogiphilia',
        tagline: 'Full-stack blogging platform for writers & curious readers',
        desc: 'Write, publish, discover, bookmark, and connect through meaningful stories. Built with React, Node.js, and a rich text editor.',
        url: 'https://blogiphilia.netlify.app',
        tags: ['React', 'Node.js', 'Full-Stack'],
        color: 'orange',
      },
      {
        name: 'VizFlow Studio',
        tagline: 'Data exploration & lightweight analytics inside VS Code',
        desc: 'Brings data exploration directly into your editor — no context switching, no external tools, no data leaving your machine.',
        url: 'https://marketplace.visualstudio.com/items?itemName=adoenixes-vizflow.vizflow-studio',
        tags: ['VS Code Extension', 'TypeScript', 'Analytics'],
        color: 'teal',
      },
      {
        name: 'DeepSight',
        tagline: 'Learn Deep Learning concepts visually & interactively',
        desc: 'A free, open-source website for visualising neural network concepts — from perceptrons to transformers — in an interactive, intuitive way.',
        url: 'https://github.com/ESAditya1729/DeepSight',
        tags: ['Python', 'Deep Learning', 'Education'],
        color: 'purple',
      },
      {
        name: 'DocPulse AI',
        tagline: 'Intelligent CLI for research paper analysis',
        desc: 'Parses, indexes, and analyses research papers with structured breakdowns and study guide synthesis — powered by IBM Consulting Advantage (ICA).',
        url: 'https://github.com/ESAditya1729/DocPulse-AI',
        tags: ['Python', 'GenAI', 'IBM ICA', 'CLI'],
        color: 'pink',
      },
    ],
  },
  {
    id: 'contact',
    scrollPages: 1.5,
    heading: "Let's talk",
    email: 'adityamukherjee1729@gmail.com',
    location: 'India',
    links: { github: 'https://github.com/ESAditya1729', linkedin: 'https://linkedin.com/in/theadityamukherjee' },
  },
]

// Scroll offset (0..1) where a given section's page range begins — used by
// 3D hotspots to jump the scroll position straight to a section.
export function getSectionOffset(id) {
  let pagesBefore = 0
  for (const section of sections) {
    if (section.id === id) break
    pagesBefore += section.scrollPages ?? 1
  }
  return pagesBefore / TOTAL_PAGES
}
