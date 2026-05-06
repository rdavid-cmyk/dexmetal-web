// Tasks 2, 4, 5: Set legacy_post, difficulty, read_time, FAQ, hero image on all 10 legacy posts.
// Updates do NOT include _status so the validation hook does not fire.
import configPromise from '@payload-config'
import { getPayload } from 'payload'

const METADATA: Record<number, { difficulty: string; read_time: number }> = {
  3:  { difficulty: 'beginner',     read_time: 5 },
  12: { difficulty: 'intermediate', read_time: 7 },
  13: { difficulty: 'advanced',     read_time: 10 },
  14: { difficulty: 'beginner',     read_time: 4 },
  15: { difficulty: 'intermediate', read_time: 8 },
  16: { difficulty: 'intermediate', read_time: 6 },
  17: { difficulty: 'intermediate', read_time: 7 },
  18: { difficulty: 'beginner',     read_time: 5 },
  19: { difficulty: 'beginner',     read_time: 6 },
  20: { difficulty: 'advanced',     read_time: 9 },
}

const FAQS: Record<number, Array<{ question: string; answer: string }>> = {
  3: [
    {
      question: 'Why is financial strategy important for operators entering resource recovery markets like e-waste?',
      answer: 'Financial strategy helps operators navigate volatile commodity prices, compliance costs, and capital requirements that characterize recovery markets. Like stock market participants who weigh optimism against caution, recyclers must balance the potential of high-value material recovery against regulatory exposure and pricing risk. Strategic financial planning converts unpredictable cash flows into manageable, planned operations.',
    },
    {
      question: 'How do commodity market dynamics affect e-waste material pricing for recyclers?',
      answer: 'E-waste materials like gold, copper, and aluminum are priced on global commodity markets, subject to the same forces as any traded resource. Recyclers who track market trends can time their material sales strategically rather than selling at spot. Market knowledge turns raw material recovery into a disciplined financial operation with measurable margin improvement.',
    },
    {
      question: 'What financial risks should new e-waste operators account for in their business planning?',
      answer: 'E-waste operators face volatile commodity prices, unexpected compliance costs, and fluctuating demand across different material categories. Building financial reserves and diversifying revenue streams protects against these risks. Understanding the difference between short-term trading gains and long-term operational value is essential for sustaining a profitable operation.',
    },
    {
      question: 'What is the financial case for treating compliance as an investment rather than overhead?',
      answer: 'Compliance-capable operators access markets, clients, and pricing premiums unavailable to uncertified competitors. The return on compliance investment — in the form of corporate contracts, government agency work, and premium service pricing — consistently exceeds the direct cost of licensing and documentation. Finance-literate operators recognize compliance as capital allocation with a measurable return.',
    },
  ],
  12: [
    {
      question: 'What is the difference between the Basel notification form and the full notification dossier?',
      answer: 'The Basel notification form is a single document that identifies the waste, parties, and intended movement — essentially a cover letter. The complete dossier can include up to 20 supporting annexes covering technical analysis, facility permits, financial guarantees, and transit country consents. Submitting only the form without the full annex package is the most common reason notifications are rejected.',
    },
    {
      question: 'How much can a single missing annex cost an e-waste exporter?',
      answer: 'A missing annex can hold a shipment at port for 4–8 weeks. At standard demurrage rates for a 20-foot container, that delay costs between $8,000 and $40,000 — before any regulatory fines are imposed. The financial cost of preparing a complete and accurate dossier is always lower than the cost of a rejection.',
    },
    {
      question: 'What changed in Basel Annex VIII on January 1, 2025 that affects e-waste exporters?',
      answer: 'Entry A1180 was replaced by A1181, which now covers all hazardous e-waste, components, and processing fractions. A new entry Y49 was simultaneously added to Annex II, meaning non-hazardous e-waste now requires Prior Informed Consent for the first time. Every Basel Party exporting e-waste — hazardous or not — now needs the full PIC procedure.',
    },
    {
      question: 'How should exporters sequence the preparation of their Basel annex package to avoid last-minute gaps?',
      answer: 'Long-lead annexes — facility permits, laboratory analysis, financial guarantee bonds — must be started weeks before the notification is filed. The four annex categories (legal, technical, financial, transport) should be assembled systematically rather than reactively. Treating the notification dossier as a structured project rather than a form-filling exercise prevents gaps that cause rejection.',
    },
  ],
  13: [
    {
      question: 'What was the most significant change to Basel notifications that took effect on January 1, 2025?',
      answer: 'Annex VIII entry A1180 was replaced by A1181, covering all hazardous e-waste, and new entry Y49 was added to Annex II for non-hazardous e-waste. This means non-hazardous e-waste now requires Prior Informed Consent for the first time in the Convention\'s history. Every exporter — regardless of whether their material is classified hazardous or not — must now complete the full PIC procedure.',
    },
    {
      question: 'How much can non-compliance with Basel notification requirements cost a business in a single incident?',
      answer: 'A single rejected shipment can cost between $10,000 and $50,000 in unexpected fees and logistics costs alone. Beyond direct costs, criminal liability, asset seizure, and operational shutdown are all possible consequences of sustained non-compliance. Correct documentation is the most cost-effective risk management tool available to any operator moving materials internationally.',
    },
    {
      question: 'What is the Prior Informed Consent procedure and why is it central to e-waste exports?',
      answer: 'PIC is the legal mechanism of international hazardous waste movement under the Basel Convention — it requires official approval from importing and transit countries before any shipment can move. Without valid PIC, a shipment is illegal regardless of how well other paperwork is prepared. Mastering the PIC procedure transforms compliance from a barrier into a competitive advantage over operators who cannot access regulated markets.',
    },
    {
      question: 'How do you determine correct waste classification under the 2025 Basel amendments before filing a notification?',
      answer: 'Classification begins with the waste\'s composition and intended fate — whether it goes to recovery, disposal, or reuse determines which Annex applies. Under the 2025 updates, A1181 and Y49 capture a broader range of materials than the previous entries. Operators should verify classification against both Annex VIII (hazardous) and Annex II (non-hazardous) before assembling any notification package.',
    },
  ],
  14: [
    {
      question: 'What problem does the Basel CA API solve for compliance teams preparing notifications?',
      answer: 'Competent Authority contact information has traditionally required manual lookups from PDF documents that are often years out of date. The Basel API provides programmatic access to verified CA contacts — name, email, phone, address, and verification date — for 41 jurisdictions in a single API call. It eliminates hours of manual research per shipment and removes the risk of submitting to wrong or outdated contacts.',
    },
    {
      question: 'What does access to the Basel API cost and how many countries does it cover?',
      answer: 'Access is $0 per month with no credit card required — registration provides instant, unlimited API access. The API covers 41 key jurisdictions with continuous expansion as new countries are verified. This makes it accessible to operators of any size, from individual traders preparing occasional notifications to enterprise compliance teams processing high volumes.',
    },
    {
      question: 'What happens when an exporter uses outdated Competent Authority contact information for a Basel submission?',
      answer: 'Submissions sent to wrong or outdated contacts may bounce, route to the wrong regulatory unit, or simply disappear — with no notification to the sender. By the time the error is discovered, notification deadlines may have passed, creating shipment delays and potential compliance violations. Verified, current contact data is a prerequisite for any reliable Basel notification workflow.',
    },
    {
      question: 'How does the Basel API integrate with existing compliance workflows and software tools?',
      answer: 'The API uses standard REST architecture — a single GET call with an API key in the header returns all CA data for a country code in JSON format. This makes it compatible with spreadsheets via scripts, compliance management software, and custom internal tools without any complex integration. Teams can automate their CA lookup step entirely, removing it as a manual workflow bottleneck.',
    },
  ],
  15: [
    {
      question: 'What changed about Prior Informed Consent requirements effective January 1, 2025?',
      answer: 'All e-waste — both hazardous and non-hazardous — now falls under the PIC procedure following the addition of entry Y49 to Annex II. Previously, only hazardous e-waste required advance country approval. Every cross-border e-waste shipment now needs official consent from importing and transit countries before it can move, regardless of hazard classification.',
    },
    {
      question: 'How does investing in PIC compliance create competitive advantage rather than just adding regulatory burden?',
      answer: 'Operators who master PIC procedures can demonstrate verifiable, legally clean supply chains to corporate clients who require ESG compliance documentation. PIC-compliant shipments face fewer port delays and customs challenges than those attempting to move without proper consent. The investment in building systematic PIC capability pays back in access to premium clients and markets unavailable to non-compliant operators.',
    },
    {
      question: 'What is the recommended mindset shift for operators approaching the new Basel PIC requirements?',
      answer: 'Rather than viewing PIC as a regulatory burden, successful operators treat it as a quality seal proving materials move cleanly, legally, and responsibly. The new requirements level the playing field by making transparency the global standard rather than an optional differentiator. Compliance infrastructure built now creates barriers to entry that protect established operators from less disciplined competitors entering the market.',
    },
    {
      question: 'Where is DexMetal in its own PIC compliance journey for the 2025 framework?',
      answer: 'DexMetal is preparing for its first PIC applications under the 2025 framework and shares its process transparently — providing regulatory analysis, compliance frameworks, and industry partner insights in real time. The company positions itself as a guide navigating new territory alongside operators rather than a completed-case-study authority. This collaborative learning model means knowledge is shared as the regulatory landscape evolves, not after the fact.',
    },
  ],
  16: [
    {
      question: 'What are the highest-value e-waste materials to target when building a sourcing strategy?',
      answer: 'Circuit boards from computers and servers contain gold, silver, and palladium at densities that justify careful recovery. CPUs and RAM — particularly older chips — have higher gold content than modern equivalents. Networking equipment including servers, routers, and switches contains both precious metals and rare earth elements that command strong secondary market prices.',
    },
    {
      question: 'Where can e-waste operators find consistent supply without purchasing materials outright?',
      answer: 'Corporate IT departments upgrade equipment regularly and often need certified data destruction documentation — offering that service makes you their preferred disposal partner at no material cost. Government agencies, schools, universities, and medical facilities all have regular technology refresh cycles with strict disposal requirements. Building relationships with these institutional sources creates a predictable, low-cost supply pipeline.',
    },
    {
      question: 'How does certified vendor status (R2, e-Stewards) affect pricing power for e-waste operators?',
      answer: 'Certification enables operators to work with corporate clients and government agencies that require certified handlers for compliance and liability reasons. This access unlocks contracts that uncertified competitors cannot bid on, and supports premium pricing for compliant collection and processing services. Certification converts regulatory compliance from a cost center into a revenue multiplier by opening higher-margin market segments.',
    },
    {
      question: 'What does a diversified e-waste income strategy look like in practice?',
      answer: 'Beyond basic material recovery, operators can charge for certified collection services, earn premium rates as a certified vendor, focus on specialized niche recycling (medical equipment, security devices), and refurbish and resell working equipment. Each revenue stream has different margin profiles and risk characteristics relative to commodity price movements. A diversified operation is more resilient to metal spot price swings than one dependent on a single material category.',
    },
  ],
  17: [
    {
      question: 'What compliance gap do most new e-waste operators miss that experienced operators treat as an ongoing business process?',
      answer: 'New operators typically obtain required permits but miss the maintenance obligations — different renewal schedules, continuing education requirements, and reporting obligations across multiple license types. Treating license management as a one-time task rather than an ongoing system is a common and costly mistake. Building a calendar-driven compliance management process from day one prevents gaps that can trigger inspection, penalties, or shutdown.',
    },
    {
      question: 'What insurance types are essential for e-waste operations that differ from standard business coverage?',
      answer: 'Essential specialized coverage includes environmental liability for contamination incidents, hazardous material transport insurance for CRT and battery movements, and gap coverage for lithium battery fire scenarios. Standard business insurance does not cover the most common catastrophic e-waste incidents — CRT breakage requiring hazmat cleanup, battery fires shutting down facilities for weeks. Proper specialized coverage converts existential risk into a predictable business expense.',
    },
    {
      question: 'How do Basel Convention notifications fit alongside domestic licensing for e-waste exporters?',
      answer: 'Basel notifications are required for any international shipment of hazardous waste and operate alongside domestic licensing requirements — not as a replacement for them. An EPA Part 261 Generator Status determines what a domestic operator can handle, while Basel notifications govern the cross-border movement itself. Both regulatory layers must be simultaneously in compliance for any international shipment to be legal.',
    },
    {
      question: 'What systems are needed to manage e-waste compliance at volume without losing track of obligations?',
      answer: 'Manual compliance management becomes unworkable as volume grows — different renewal schedules, changing federal, state, and international regulations, and shipment-level documentation requirements create too many variables for spreadsheet tracking. Operators need platforms that track license status, alert on renewal deadlines, and maintain complete documentation chains. DexMetal was built specifically to address this systems gap for operators moving from ad-hoc to systematic compliance management.',
    },
  ],
  18: [
    {
      question: 'What are the most hazardous materials commonly found in e-waste that operators must be prepared to handle?',
      answer: 'Lead in solder, mercury in screens, and cadmium in semiconductors are the primary heavy metal hazards in standard e-waste streams. Battery chemistry — lithium-ion, nickel-cadmium, and lead-acid — presents fire and chemical exposure risks that vary significantly by type. A single smartphone contains trace amounts of over 60 elements from the periodic table, including materials that are potentially lethal without appropriate protective equipment and handling protocols.',
    },
    {
      question: 'How does improper lithium battery handling create business risk that goes beyond worker safety?',
      answer: 'A single punctured lithium battery can cause a fire that destroys an entire facility and triggers environmental cleanup liability. Beyond the physical damage, a battery fire triggers regulatory inspection, potential shutdown orders, and public incident reporting obligations. Operations without proper battery storage, sorting, and handling protocols face existential business risk, not just occupational safety risk.',
    },
    {
      question: 'What protective equipment does e-waste handling require that differs from standard industrial safety gear?',
      answer: 'E-waste handling requires chemical-resistant gloves rated for acid and mercury exposure, respiratory protection against fine particulates and toxic fumes from heated flame retardants, and appropriate eye protection against CRT implosion hazards. Standard construction safety equipment is insufficient for many e-waste material categories. Operators should consult an environmental safety specialist before establishing handling protocols for any new waste stream.',
    },
    {
      question: 'How does understanding the material content of electronics improve both safety outcomes and recovery profitability?',
      answer: 'Knowing that electronics contain precious metals makes the case for careful, methodical dismantling — the same care that protects workers also preserves material value by avoiding contamination and damage. Components that are damaged or contaminated through improper handling lose value while simultaneously creating hazardous waste that costs money to dispose of. Safety protocols and material recovery optimization are mutually reinforcing priorities, not competing ones.',
    },
  ],
  19: [
    {
      question: 'What makes e-waste a more strategically attractive opportunity than conventional scrap recycling?',
      answer: 'E-waste contains concentrated precious metals — gold, silver, palladium — at densities significantly higher than primary ore or conventional scrap streams. The combination of growing global volume, regulatory compliance barriers to entry, and material value density makes it a defensible market for operators who invest in the right infrastructure. Operators who build compliant, systematic operations access both the material value and the premium pricing that compliance-requiring clients pay.',
    },
    {
      question: 'What is the compliance framework that governs international e-waste trade and why does it matter?',
      answer: 'The Basel Convention governs transboundary movement of hazardous waste globally, requiring Prior Informed Consent from importing and transit countries before shipments can move. Export compliance frameworks are mandatory — not optional — for any operator moving materials across borders. Operators who enter international markets without this framework face criminal liability, asset seizure, and complete operational shutdown.',
    },
    {
      question: 'How do circular economy principles apply to e-waste recovery operations in practice?',
      answer: 'Circular economy principles treat e-waste as a resource rather than a disposal problem — recovering materials for manufacturing reuse rather than landfilling them. Right to Repair alignment means supporting device refurbishment and reuse before recycling, maximizing the useful life cycle of materials. Operators who frame their work within circular economy principles access both regulatory support and ESG-motivated corporate clients who pay premiums for documented circular supply chains.',
    },
    {
      question: 'What does DexMetal mean by "compliance knowledge turns obstacles into opportunities"?',
      answer: 'Most operators see Basel compliance as a barrier that limits what they can legally do across borders. Operators who invest in compliance capability gain access to international markets, corporate clients, and pricing premiums that uncertified competitors cannot reach. The compliance knowledge gap is the actual competitive moat — operators who close it first build durable advantages that are difficult for later entrants to replicate.',
    },
  ],
  20: [
    {
      question: 'What triggered the $140,000 compliance crisis described in this post?',
      answer: 'A government environmental inspector called to ask whether the operation was Basel compliant — four words that exposed years of international shipments made without permits, notifications, or proper waste codes. The company had been moving materials across borders legally in every other respect but had never heard of the Basel Convention\'s notification requirements. Not knowing the law was not a defense under international treaty obligations.',
    },
    {
      question: 'What are the actual legal consequences of non-compliant international e-waste shipments under Basel?',
      answer: 'Consequences include criminal liability, asset seizure, complete operational shutdown, and personal liability for principals and directors. In the case described, the largest buyer — holding $140,000 in unpaid invoices for already-delivered materials — was shut down overnight by environmental authorities, making those receivables permanently uncollectable. Financial loss from compliance failure extends beyond fines to destroyed business relationships and lost working capital.',
    },
    {
      question: 'How did the operation grow into international shipping without ever encountering Basel compliance requirements?',
      answer: 'The operation started as a local dismantling and recovery business processing 15–20 tons per month, then organically expanded into international container shipments as buyers emerged. Growth into cross-border trade created Basel compliance obligations the founders did not know existed, and no domestic licensing process flagged the international regulatory layer. The gap between operational scale and regulatory knowledge widened silently until an inspector\'s call made it unavoidable.',
    },
    {
      question: 'What is the most important lesson for operators currently moving materials internationally without Basel compliance?',
      answer: 'The question is not whether a compliance gap will be discovered, but when — and whether the operation will survive the discovery. Every shipment made without proper Basel notifications creates retroactive legal exposure that compounds over time. The cost of establishing compliance — permits, notifications, professional guidance — is a small fraction of the cost of the enforcement action, receivables loss, and reputational damage that follows discovery.',
    },
  ],
}

async function main() {
  const payload = await getPayload({ config: configPromise })
  const ids = [3, 12, 13, 14, 15, 16, 17, 18, 19, 20]

  for (const id of ids) {
    const meta = METADATA[id]
    const faq = FAQS[id]
    if (!meta || !faq) { console.log(`Skipping id=${id} — no metadata defined`); continue }

    const updateData: Record<string, any> = {
      legacy_post: true,
      difficulty: meta.difficulty,
      read_time: meta.read_time,
      faq,
    }

    // Task 3b: assign hero image to id=19 (media id=33)
    if (id === 19) {
      updateData.heroImage = 33
    }

    try {
      await payload.update({
        collection: 'posts',
        id,
        data: updateData as any,
        overrideAccess: true,
        context: { disableRevalidate: true },
      })
      console.log(`id=${id}: legacy_post=true, difficulty=${meta.difficulty}, read_time=${meta.read_time}, faq=${faq.length} items${id === 19 ? ', heroImage=33' : ''} ✓`)
    } catch (err: any) {
      console.error(`id=${id} FAILED:`, err.message)
    }
  }

  console.log('\nDone.')
  process.exit(0)
}

main().catch((e) => { console.error(e); process.exit(1) })
