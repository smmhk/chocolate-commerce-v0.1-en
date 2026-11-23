import { createRoot } from 'react-dom/client'
import {
  ArrowDown, ArrowDownRight, ArrowRight, ArrowUpRight, ChartNoAxesColumn,
  CircleCheck, Database, FileText, FolderGit2, LayoutGrid, Play, ShoppingBag,
  Workflow, type LucideIcon,
} from 'lucide-react'
import { OrderJourney } from './OrderJourney'
import onlineSalesScreenshot from './assets/data_studio_online_sales.png'
import onlineProductScreenshot from './assets/data_studio_online_product.png'
import './styles.css'

type ResourceDetails = {
  title: string
  description: string
  linkLabel: string
  url?: string
}

type WorkflowStep = {
  title: string
  description: string
  icon: LucideIcon
  url: string
  linkLabel?: string
}

type ConfirmedPlan = {
  title: string
  description: string
}

const githubRepositoryUrl = 'https://github.com/smmhk/chocolate-commerce-data-platform'
const ingestionCodeUrl = `${githubRepositoryUrl}/blob/main/orchestration/kestra/flows/chocolate/workflows/chocolate.online_raw_ingestion.yaml`

const liveDashboard = {
  title: 'Explore the Live Dashboard',
  description: 'Choose a date range to explore simulated online orders, order amounts, and top-selling products.',
  linkLabel: 'Explore the Live Dashboard',
  url: 'https://datastudio.google.com/s/oscBmjlO6JM',
} satisfies ResourceDetails

const workflowSteps: WorkflowStep[] = [
  { title: 'Data Ingestion', description: 'Collect order data from the online store.', icon: ShoppingBag, url: ingestionCodeUrl },
  {
    title: 'Storage',
    description: 'Export online orders from PostgreSQL to Cloud Storage as CSV files, then load them into BigQuery for analysis.',
    icon: Database,
    url: `${githubRepositoryUrl}/blob/main/orchestration/kestra/flows/chocolate/to_bigquery/online/chocolate.online_orders_to_file.yaml`,
  },
  {
    title: 'dbt Transformations',
    description: 'Join each order item to its order and product records to add order status, sales date, and product details.',
    icon: Workflow,
    url: `${githubRepositoryUrl}/blob/main/chocolate_dbt/models/intermediate/int_online_order_items_enriched.sql`,
  },
  {
    title: 'Analytics Marts',
    description: 'Summarize completed orders by day and product to report units sold, distinct orders, and line-item totals in CAD.',
    icon: LayoutGrid,
    url: `${githubRepositoryUrl}/blob/main/chocolate_dbt/models/marts/mart_online_product_sales.sql`,
  },
  {
    title: 'Data Studio',
    description: 'Show the prepared data in a Data Studio dashboard.',
    icon: ChartNoAxesColumn,
    url: liveDashboard.url,
    linkLabel: liveDashboard.linkLabel,
  },
]

const demoVideo: ResourceDetails = { title: 'Watch the Workflow Run', description: 'See how an online order makes its way to the dashboard.', linkLabel: 'Watch the Workflow Run', url: 'https://app.slidespeak.co/presentation/cmwsk80sk002p08o4cd83d6g0/share'}
const presentation: ResourceDetails = {
  title: 'View the Slide Deck',
  description: 'Slides covering the project background and workflow.',
  linkLabel: 'View the Slide Deck',
  url: 'https://docs.google.com/presentation/d/10MhdGfXEm0RGOn59qJTu5c5enGqzYqhf/edit?usp=sharing&ouid=101926343363175222297&rtpof=true&sd=true',
}
const github: ResourceDetails = { title: 'View the Code on GitHub', description: 'Find the implementation code and technical details for each step.', linkLabel: 'View the Code on GitHub', url: githubRepositoryUrl }
const confirmedPlans: ConfirmedPlan[] = [
  {
    title: 'Online and In-Store Order Analysis',
    description: 'Combine online and in-store order data to understand what sells across channels.',
  },
]

function getPublicUrl(value?: string) {
  if (!value?.trim()) return undefined

  try {
    const url = new URL(value)
    if ((url.protocol === 'https:' || url.protocol === 'http:') && !url.username && !url.password) {
      return url.href
    }
  } catch {
    return undefined
  }
  return undefined
}

function ResourceAccess({ url, label, unavailable = 'Resource unavailable' }: {
  url?: string
  label: string
  unavailable?: string
}) {
  const publicUrl = getPublicUrl(url)

  return publicUrl ? (
    <a className="resource-link" href={publicUrl}>{label}<ArrowUpRight size={15} aria-hidden="true" /></a>
  ) : (
    <span className="resource-status">{unavailable}</span>
  )
}

function ResourceCard({ resource, icon: Icon, unavailable }: {
  resource: ResourceDetails
  icon: LucideIcon
  unavailable?: string
}) {
  return (
    <article className="resource-card">
      <span className="tile"><Icon size={21} aria-hidden="true" /></span>
      <div>
        <h3>{resource.title}</h3>
        <p>{resource.description}</p>
        <ResourceAccess url={resource.url} label={resource.linkLabel} unavailable={unavailable} />
      </div>
    </article>
  )
}

function BrandMark() {
  return <span className="brand-mark" aria-hidden="true"><i /><i /><i /><i /></span>
}

function HeroIllustration() {
  return (
    <figure className="hero-figure">
      <div className="figure-heading"><span className="figure-dot" />Online Analytics</div>
      <div className="figure-path" aria-hidden="true">
        <div className="figure-node"><ShoppingBag /><span>Order</span></div>
        <span className="connector"><ArrowRight /></span>
        <div className="figure-node figure-node-center"><Database /><span>Data</span></div>
        <span className="connector"><ArrowRight /></span>
        <div className="figure-node"><ChartNoAxesColumn /><span>Dashboard</span></div>
      </div>
      <figcaption><span>How order data reaches the dashboard</span><ArrowDownRight size={19} aria-hidden="true" /></figcaption>
    </figure>
  )
}

function WorkflowSection() {
  return (
    <section id="workflow" className="section workflow-section" aria-labelledby="workflow-title">
      <div className="section-heading">
        <h2 id="workflow-title">Online Analytics Workflow</h2>
        <span className="completed"><CircleCheck size={16} aria-hidden="true" />Implemented in v0.1</span>
      </div>
      <ol className="workflow-grid">
        {workflowSteps.map(({ title, description, icon: Icon, url, linkLabel }, index) => (
          <li className="step-card" key={title}>
            <div className="step-top">
              <span className="tile"><Icon size={22} aria-hidden="true" /></span>
              <span className="step-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            </div>
            <h3>{title}</h3>
            <p>{description}</p>
            <ResourceAccess url={url} label={linkLabel ?? `View ${title} code on GitHub`} />
          </li>
        ))}
      </ol>
      <ResourceCard resource={demoVideo} icon={Play} unavailable="Video unavailable" />
    </section>
  )
}

function ProjectStory() {
  return (
    <section className="section" aria-labelledby="story-title">
      <div className="section-heading"><h2 id="story-title">Why I Built This Project</h2></div>
      <div className="project-story">
        <p>When I moved to Canada, I was curious about how often I saw specialty chocolate shops and how people gave chocolate as gifts for special occasions. A Purdys shop near my home got me looking into how chocolate retailers sell across stores and online.</p>
        <p>That raised a data question: <strong>How could a retailer bring online and in-store orders together to understand what sells across channels?</strong> I created <em>Charlie’s Chocolate Factory</em>, a fictional retailer, to explore that question with simulated commerce data.</p>
        <p>I started with online orders. For v0.1, I built an end-to-end workflow that ingests and stores order data, transforms it with dbt, prepares it for analysis in data marts, and visualizes it in Data Studio. Combining online and in-store data for analysis is a future milestone.</p>
      </div>
    </section>
  )
}

function App() {
  return (
    <>
      <header className="site-header">
        <div className="shell header-inner">
          <a className="brand" href="#top"><BrandMark /><span>Chocolate Commerce</span></a>
          <nav aria-label="Main navigation">
            <a href="#workflow">Workflow</a>
            <a href="#dashboard">Dashboard</a>
            <a href="#resources">Project Resources</a>
          </nav>
        </div>
      </header>
      <main id="top" className="shell">
        <section className="hero" aria-labelledby="hero-title">
          <div>
            <p className="project-name">Chocolate Commerce · A Data Engineering Portfolio Project</p>
            <h1 id="hero-title">From Online Orders <span>to a Dashboard</span></h1>
            <p className="developer-intro">
              Backend Developer transitioning into Data Engineering
              <span aria-hidden="true"> | </span>
              Building end-to-end data platforms with Python, SQL, GCP &amp; AI-assisted workflows
            </p>
            <p className="hero-description">
  I built an end-to-end pipeline that loads simulated online orders into BigQuery,
  transforms them with dbt, and powers a Data Studio dashboard.
</p>

<div className="flex flex-wrap items-center gap-x-3">
  <a className="primary-link" href="#workflow">
    Explore the Workflow <ArrowDown size={17} aria-hidden="true" />
  </a>
  <a
    className="primary-link"
    href={liveDashboard.url}
    target="_blank"
    rel="noopener noreferrer"
  >
    Open the Live Dashboard <ArrowUpRight size={17} aria-hidden="true" />
  </a>
</div>
          </div>
          <HeroIllustration />
        </section>

        <ProjectStory />
        <OrderJourney ingestionCodeUrl={ingestionCodeUrl} getPublicUrl={getPublicUrl} />
        <WorkflowSection />

        <section id="dashboard" className="section" aria-labelledby="dashboard-title">
          <div className="section-heading"><h2 id="dashboard-title">Dashboard Walkthrough</h2></div>
          <div className="dashboard-grid">
            <div className="dashboard-screenshots">
              <figure>
                <img src={onlineSalesScreenshot} alt="Online order counts and amounts with monthly trends" loading="lazy" width={991} height={745} />
                <figcaption>Online Sales Overview</figcaption>
              </figure>
              <figure id="online-product-performance">
                <img src={onlineProductScreenshot} alt="Top five online products and category totals by units sold" loading="lazy" width={990} height={741} />
                <figcaption>Online Product Performance</figcaption>
              </figure>
            </div>
            <ResourceCard resource={liveDashboard} icon={ArrowUpRight} unavailable="Public link unavailable" />
          </div>
        </section>

        <section className="section" aria-labelledby="plans-title">
          <div className="section-heading"><h2 id="plans-title">What’s Next</h2></div>
          {confirmedPlans.length > 0 ? (
            <ul className="plan-list">
              {confirmedPlans.map((plan) => (
                <li key={plan.title}><span className="resource-status">Planned</span><h3>{plan.title}</h3><p>{plan.description}</p></li>
              ))}
            </ul>
          ) : <p className="plan-empty">Future milestones will appear here once confirmed.</p>}
        </section>

        <section id="resources" className="section resources-section" aria-labelledby="resources-title">
          <div className="section-heading"><h2 id="resources-title">Project Resources</h2></div>
          <div className="resources-grid">
            <ResourceCard resource={presentation} icon={FileText} unavailable="Slide deck coming soon" />
            <ResourceCard resource={github} icon={FolderGit2} unavailable="Repository link unavailable" />
          </div>
        </section>
      </main>
      <footer><div className="shell footer-inner"><span>Chocolate Commerce Data Engineering</span><span>v0.1</span></div></footer>
    </>
  )
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('The portfolio root element is missing.')

createRoot(rootElement).render(<App />)