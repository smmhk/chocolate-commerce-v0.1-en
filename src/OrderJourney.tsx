import { ArrowRight, ArrowUpRight, ChartNoAxesColumn, Database, ShoppingBag, Store, type LucideIcon } from 'lucide-react'

type Screenshot = {
  src: string
  alt: string
  dimensions?: { width: number; height: number }
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
  collectedScreenshot?: Screenshot
  ingestion?: { source: string; method: string; initialStorage: string }
  metric?: { explanation: string; screenshot?: Screenshot }
}

const screenshots = import.meta.glob<string>('./assets/{demo-,order-}*.{png,jpg,jpeg,webp}', {
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

function getScreenshot(path: string, alt: string, dimensions?: Screenshot['dimensions']): Screenshot | undefined {
  const src = ['png', 'jpg', 'jpeg', 'webp']
    .map((extension) => screenshots[`${path}.${extension}`])
    .find(Boolean)

  return src ? { src, alt, dimensions } : undefined
}

const sampleOrder: OrderEvidence = {
  orderId: 'CCF-WEB-000014',
  orderScreenshot: getScreenshot(
    './assets/order-confirmation',
    'Storefront confirmation for order CCF-WEB-000014 with Processing status',
    { width: 1828, height: 860 },
  ),
  collectedScreenshot: getScreenshot(
    './assets/order-bigquery-record',
    'BigQuery result for order CCF-WEB-000014 showing Completed status and an order total of CAD 80.72',
    { width: 912, height: 171 },
  ),
  collectedRecord: 'Status: COMPLETED\nOrder total: CAD 80.72',
  metric: {
    explanation: 'The September 8, 2026 daily totals across online orders show: 3 Golden Caramel Crunch, 4 Hazelnut Dream Bar, and 2 Midnight Dark Chocolate Bar.',
    screenshot: getScreenshot(
      './assets/order-product-sales',
      'BigQuery query results showing daily units sold for three chocolate products',
      { width: 852, height: 275 },
    ),
  },
}

function EvidencePreview({ screenshot, placeholder, icon: Icon, fullSizeLabel }: {
  screenshot?: Screenshot
  placeholder: string
  icon: LucideIcon
  fullSizeLabel?: string
}) {
  if (!screenshot?.src.trim() || !screenshot.alt.trim()) {
    return <div className="evidence-preview"><Icon size={24} aria-hidden="true" /><span>{placeholder}</span></div>
  }

  const preview = (
    <img
      className="evidence-screenshot"
      src={screenshot.src}
      alt={screenshot.alt}
      width={screenshot.dimensions?.width}
      height={screenshot.dimensions?.height}
      loading="lazy"
    />
  )

  return fullSizeLabel ? (
    <a className="evidence-image-link" href={screenshot.src} target="_blank" rel="noopener noreferrer">
      {preview}
      <span className="resource-link">{fullSizeLabel}<ArrowUpRight size={15} aria-hidden="true" /></span>
    </a>
  ) : preview
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
  const { orderId, orderScreenshot, collectedRecord, collectedScreenshot, ingestion, metric } = sampleOrder
  const publicIngestionCodeUrl = getPublicUrl(ingestionCodeUrl)

  return (
    <>
      <section className="section" aria-labelledby="data-sources-title">
        <div className="section-heading"><h2 id="data-sources-title">Where the Data Comes From</h2></div>
        <p className="project-story journey-intro">I built a demo storefront and an in-store POS in Lovable to simulate how a chocolate retailer generates order data. The first analytics workflow starts with the online store. Follow one sample order to see how it’s collected and how it contributes to a Data Studio dashboard.</p>
        <div className="source-grid">
          {demoSources.map((source) => {
            const publicUrl = getPublicUrl(source.url)
            const screenshot = getScreenshot(source.screenshotPath, source.screenshotAlt)

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
            <EvidencePreview screenshot={orderScreenshot} placeholder="Placed on September 8, 2026 · Processing" icon={ShoppingBag} fullSizeLabel="Open order confirmation" />
          </li>
          <li className="evidence-card ingestion-evidence">
            <h3>The order is collected</h3>
            <SampleOrderId orderId={orderId} />
            {collectedRecord?.trim()
              ? <pre className="collected-record"><code>{collectedRecord}</code></pre>
              : null}
            {collectedScreenshot && <EvidencePreview screenshot={collectedScreenshot} placeholder="BigQuery order record" icon={Database} fullSizeLabel="Open BigQuery order record" />}
            <p>{ingestion
              ? `The workflow reads orders from ${ingestion.source} using ${ingestion.method} and first stores them in ${ingestion.initialStorage}.`
              : 'The same order ID appears in BigQuery after the order is marked completed.'}</p>
            {publicIngestionCodeUrl && <a className="resource-link" href={publicIngestionCodeUrl}>View the Ingestion Code<ArrowUpRight size={15} aria-hidden="true" /></a>}
          </li>
          <li className="evidence-card">
            <h3>Sales are aggregated by product</h3>
            <EvidencePreview screenshot={metric?.screenshot} placeholder="Daily units sold by product" icon={ChartNoAxesColumn} fullSizeLabel="Open product sales results" />
            <p>{metric?.explanation ?? 'An example of how this order contributes to an aggregate metric is pending.'}</p>
          </li>
        </ol>
        <div className="journey-links">
          <a className="resource-link" href="#workflow">Explore the Workflow<ArrowRight size={15} aria-hidden="true" /></a>
          <a className="resource-link" href="#online-product-performance">See the Online Product Performance chart<ArrowRight size={15} aria-hidden="true" /></a>
        </div>
      </section>
    </>
  )
}