import { ArrowRight, ArrowUpRight, ChartNoAxesColumn, Database, ShoppingBag, Store, type LucideIcon } from 'lucide-react'

type Screenshot = {
  src: string
  alt: string
}

type DemoSource = {
  title: string
  description: string
  screenshotLabel: string
  screenshotPath: string
  screenshotAlt: string
  linkLabel: string
  url?: string
  icon: LucideIcon
}

type OrderEvidence = {
  orderId?: string
  orderScreenshot?: Screenshot
  collectedRecord?: string
  ingestion?: { source: string; method: string; initialStorage: string }
  metric?: { explanation: string; screenshot?: Screenshot }
}

const demoScreenshots = import.meta.glob<string>('./assets/demo-*.{png,jpg}', {
  eager: true,
  import: 'default',
  query: '?url',
})

const demoSources: DemoSource[] = [
  {
    title: 'Online Store',
    description: 'This is where the online orders used in the v0.1 analytics workflow are created.',
    screenshotLabel: 'Storefront screenshot pending',
    screenshotPath: './assets/demo-online-store',
    screenshotAlt: 'Charlie’s Chocolate Factory online shop with chocolate products and Add to cart buttons',
    url: 'https://chocoflavor.dev/',
    linkLabel: 'Visit the Demo Store',
    icon: ShoppingBag,
  },
  {
    title: 'In-Store POS',
    description: 'This demo simulates in-store sales. Combining in-store and online data for analytics is a future milestone.',
    screenshotLabel: 'POS register screenshot pending',
    screenshotPath: './assets/demo-pos',
    screenshotAlt: 'Burnaby POS register showing the product grid and order cart side by side',
    url: 'https://chocoflavor.dev/pos',
    linkLabel: 'Try the POS Demo',
    icon: Store,
  },
]

const sampleOrder: OrderEvidence = {}

function EvidencePreview({ screenshot, placeholder, icon: Icon }: {
  screenshot?: Screenshot
  placeholder: string
  icon: LucideIcon
}) {
  return screenshot?.src.trim() && screenshot.alt.trim() ? (
    <img className="evidence-screenshot" src={screenshot.src} alt={screenshot.alt} loading="lazy" />
  ) : (
    <div className="evidence-preview"><Icon size={24} aria-hidden="true" /><span>{placeholder}</span></div>
  )
}

function SampleOrderId({ orderId }: { orderId?: string }) {
  return (
    <p className="sample-order-id">
      {orderId?.trim() ? <>Order ID <code>{orderId}</code></> : 'Sample order ID pending'}
    </p>
  )
}

export function OrderJourney({ ingestionCodeUrl, getPublicUrl }: {
  ingestionCodeUrl?: string
  getPublicUrl: (value?: string) => string | undefined
}) {
  const { orderId, orderScreenshot, collectedRecord, ingestion, metric } = sampleOrder
  const publicIngestionCodeUrl = getPublicUrl(ingestionCodeUrl)

  return (
    <>
      <section className="section" aria-labelledby="data-sources-title">
        <div className="section-heading"><h2 id="data-sources-title">Where the Data Comes From</h2></div>
        <p className="project-story journey-intro">I built a demo storefront and an in-store POS in Lovable to simulate how a chocolate retailer generates order data. The first analytics workflow starts with the online store. Follow one sample order to see how it’s collected and how it contributes to a Data Studio dashboard.</p>
        <div className="source-grid">
          {demoSources.map((source) => {
            const publicUrl = getPublicUrl(source.url)
            const screenshotUrl = demoScreenshots[`${source.screenshotPath}.png`] ??
              demoScreenshots[`${source.screenshotPath}.jpg`]
            const screenshot = screenshotUrl ? { src: screenshotUrl, alt: source.screenshotAlt } : undefined

            return (
              <article key={source.title} className="evidence-card">
                <h3>{source.title}</h3>
                <p>{source.description}</p>
                <EvidencePreview screenshot={screenshot} placeholder={source.screenshotLabel} icon={source.icon} />
                {publicUrl && <a className="resource-link" href={publicUrl}>{source.linkLabel}<ArrowUpRight size={15} aria-hidden="true" /></a>}
              </article>
            )
          })}
        </div>
      </section>

      <section className="section" aria-labelledby="order-journey-title">
        <div className="section-heading"><h2 id="order-journey-title">Follow an Order</h2></div>
        <ol className="order-journey-grid" role="list">
          <li className="evidence-card">
            <h3>An order is placed</h3>
            <SampleOrderId orderId={orderId} />
            <EvidencePreview screenshot={orderScreenshot} placeholder="Order screenshot with products and quantities pending" icon={ShoppingBag} />
          </li>
          <li className="evidence-card ingestion-evidence">
            <h3>The order is collected</h3>
            <SampleOrderId orderId={orderId} />
            {collectedRecord?.trim()
              ? <pre className="collected-record"><code>{collectedRecord}</code></pre>
              : <EvidencePreview placeholder="Collected record excerpt pending" icon={Database} />}
            <p>{ingestion
              ? `The workflow reads orders from ${ingestion.source} using ${ingestion.method} and first stores them in ${ingestion.initialStorage}.`
              : 'Ingestion source, collection method, and initial storage details pending.'}</p>
            {publicIngestionCodeUrl && <a className="resource-link" href={publicIngestionCodeUrl}>View the Ingestion Code<ArrowUpRight size={15} aria-hidden="true" /></a>}
          </li>
          <li className="evidence-card">
            <h3>The order contributes to a dashboard metric</h3>
            <EvidencePreview screenshot={metric?.screenshot} placeholder="Data Studio metric or chart pending" icon={ChartNoAxesColumn} />
            <p>{metric?.explanation ?? 'An example of how this order contributes to an aggregate metric is pending.'}</p>
          </li>
        </ol>
        <div className="journey-links">
          <a className="resource-link" href="#workflow">Explore the Workflow<ArrowRight size={15} aria-hidden="true" /></a>
          <a className="resource-link" href="#dashboard">Dashboard Walkthrough<ArrowRight size={15} aria-hidden="true" /></a>
        </div>
      </section>
    </>
  )
}