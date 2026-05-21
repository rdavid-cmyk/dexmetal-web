/**
 * publish-article1-blog.mjs
 * Creates Article 1 blog post via Payload REST API.
 * Standing rule: Never use direct psql writes. Always use Payload API.
 * Run: node /var/www/dexmetal-web/scripts/publish-article1-blog.mjs
 */

import fetch from 'node-fetch';

const BASE = 'http://127.0.0.1:3000';
const EMAIL = 'rdavid@gvoltt.com';
const PASSWORD = 'E7m^dKq*?!6!YzJ';

console.log('=== DexMetal Article 1 Blog Publish Script ===\n');

// ── 1. LOGIN ──────────────────────────────────────────────────────────────────
const loginRes = await fetch(`${BASE}/api/users/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: EMAIL, password: PASSWORD })
});
const loginData = await loginRes.json();

if (!loginData.token) {
  console.error('Login failed:', loginData);
  process.exit(1);
}
const { token } = loginData;
console.log('✓ Logged in');

// ── 2. CHECK FOR EXISTING POST ────────────────────────────────────────────────
const checkRes = await fetch(
  `${BASE}/api/posts?where[slug][equals]=the-certificate-that-doesnt-stop-a-crime`,
  { headers: { Authorization: `JWT ${token}` } }
);
const checkData = await checkRes.json();

if (checkData.docs?.length > 0) {
  console.log('⚠ Post already exists with this slug. Aborting to prevent duplicate.');
  console.log('  Existing post ID:', checkData.docs[0].id);
  console.log('  To update it, use a PATCH script targeting ID:', checkData.docs[0].id);
  process.exit(0);
}
console.log('✓ Slug is clear — creating new post');

// ── 3. LEXICAL CONTENT ────────────────────────────────────────────────────────
const lexicalContent = {
  root: {
    type: "root",
    format: "",
    indent: 0,
    version: 1,
    children: [
      // ── Opening Hook ──────────────────────────────────────────────────────
      {
        type: "paragraph", format: "", indent: 0, version: 1,
        children: [{
          type: "text", version: 1, format: 1,
          text: "8 of 10 e-waste companies caught illegally exporting held active R2 certification."
        }]
      },
      {
        type: "paragraph", format: "", indent: 0, version: 1,
        children: [{
          type: "text", version: 1, format: 0,
          text: "That is not a coincidence. That is a structural gap — one that has been hiding in supplier files for years because the industry confused facility-level certification with trade-level compliance."
        }]
      },
      {
        type: "paragraph", format: "", indent: 0, version: 1,
        children: [{
          type: "text", version: 1, format: 0,
          text: "This article explains exactly what R2 audits, what the Basel Convention actually requires for legal transboundary movement, and the seven questions that will tell you whether your last shipment was compliant or a 30-day repatriation notice waiting to happen."
        }]
      },

      // ── Section 1 ─────────────────────────────────────────────────────────
      {
        type: "heading", tag: "h2", format: "", indent: 0, version: 1,
        children: [{ type: "text", version: 1, format: 0, text: "What R2 Actually Audits" }]
      },
      {
        type: "paragraph", format: "", indent: 0, version: 1,
        children: [{
          type: "text", version: 1, format: 0,
          text: "R2 (Responsible Recycling) is a facility-level standard. Auditors assess your physical processing operation — data sanitization protocols, environmental controls, downstream vendor chain documentation, and worker health and safety practices. A valid R2 certificate tells a buyer: this facility has passed a third-party audit of its internal operations."
        }]
      },
      {
        type: "paragraph", format: "", indent: 0, version: 1,
        children: [{
          type: "text", version: 1, format: 0,
          text: "What it does not tell them — and cannot tell them — is whether any government ever consented to the movement that recycler is about to execute."
        }]
      },
      {
        type: "paragraph", format: "", indent: 0, version: 1,
        children: [{
          type: "text", version: 1, format: 0,
          text: "R2 auditors are not governments. They have no visibility into the notification and consent exchange required under international trade law. They do not verify it because it is structurally outside their scope. Placing an R2 certificate in a supplier file as evidence of Basel compliance is a category error — like presenting a food hygiene certificate as proof a restaurant followed import customs law."
        }]
      },

      // ── Section 2 ─────────────────────────────────────────────────────────
      {
        type: "heading", tag: "h2", format: "", indent: 0, version: 1,
        children: [{ type: "text", version: 1, format: 0, text: "What Basel Article 6 Actually Requires" }]
      },
      {
        type: "paragraph", format: "", indent: 0, version: 1,
        children: [{
          type: "text", version: 1, format: 0,
          text: "Under the Basel Convention, e-waste classified under Annex VIII (waste code A1181) is hazardous waste. Any transboundary movement of hazardous waste must follow a specific sequence before a container departs — this sequence is Prior Informed Consent (PIC):"
        }]
      },
      {
        type: "paragraph", format: "", indent: 0, version: 1,
        children: [{ type: "text", version: 1, format: 0, text: "1. The exporting country's Competent Authority formally notifies the importing country's Competent Authority." }]
      },
      {
        type: "paragraph", format: "", indent: 0, version: 1,
        children: [{ type: "text", version: 1, format: 0, text: "2. The importing country's Competent Authority issues written consent." }]
      },
      {
        type: "paragraph", format: "", indent: 0, version: 1,
        children: [{ type: "text", version: 1, format: 0, text: "3. All transit states are notified and cleared." }]
      },
      {
        type: "paragraph", format: "", indent: 0, version: 1,
        children: [{ type: "text", version: 1, format: 0, text: "4. A movement document (Annex VI, Article 6) accompanies the shipment from origin to final destination." }]
      },
      {
        type: "paragraph", format: "", indent: 0, version: 1,
        children: [{
          type: "text", version: 1, format: 0,
          text: "This exchange happens between governments — specifically between designated Competent Authorities in each country. Freight forwarders do not issue consent. Recyclers do not issue consent. Certification bodies do not issue consent. States do."
        }]
      },
      {
        type: "paragraph", format: "", indent: 0, version: 1,
        children: [{
          type: "text", version: 1, format: 0,
          text: "The DexMetal Basel CA API provides direct access to Competent Authority contact data for Basel signatory countries — the starting point for any notification that will actually produce valid consent."
        }]
      },

      // ── Section 3 ─────────────────────────────────────────────────────────
      {
        type: "heading", tag: "h2", format: "", indent: 0, version: 1,
        children: [{ type: "text", version: 1, format: 0, text: "Basel Article 9: When It Becomes a Crime" }]
      },
      {
        type: "paragraph", format: "", indent: 0, version: 1,
        children: [{
          type: "text", version: 1, format: 0,
          text: "Basel Article 9 defines illegal traffic as transboundary movement of hazardous waste without the PIC sequence described in Article 6. The Convention text does not call this a regulatory infringement. It calls it illegal traffic. Under Article 9(2), if illegal traffic is attributable to the exporter, the State of export has 30 days to ensure the waste is returned — at the exporter's expense."
        }]
      },
      {
        type: "paragraph", format: "", indent: 0, version: 1,
        children: [{
          type: "text", version: 1, format: 0,
          text: "A repatriated container is not the end of the exposure. It is the beginning of regulatory scrutiny on every other movement that exporter has made. Port detentions, trade finance complications, and customer contract breaches follow the formal notification that your shipment was illegal traffic."
        }]
      },

      // ── Section 4 ─────────────────────────────────────────────────────────
      {
        type: "heading", tag: "h2", format: "", indent: 0, version: 1,
        children: [{ type: "text", version: 1, format: 0, text: "The Caribbean and West Africa Problem" }]
      },
      {
        type: "paragraph", format: "", indent: 0, version: 1,
        children: [{
          type: "text", version: 1, format: 0,
          text: "Caribbean and West African destination countries sit at the sharp end of this structural gap. Many operate under blanket import bans on hazardous waste, meaning no PIC consent can be issued because the law prohibits it. Article 4(2)(e) of the Convention requires parties to prohibit export of hazardous waste to countries that have banned its import."
        }]
      },
      {
        type: "paragraph", format: "", indent: 0, version: 1,
        children: [{
          type: "text", version: 1, format: 0,
          text: "A West African port authority turning back a container is not a customs anomaly or an administrative inconvenience. It is Article 4(2)(e) in operation. The ban check should have happened before the contract was signed, not after the container arrives at the quay."
        }]
      },
      {
        type: "paragraph", format: "", indent: 0, version: 1,
        children: [{
          type: "text", version: 1, format: 0,
          text: "The Ban Amendment — adopted in 1995 and entering into force in 2019 — adds a further layer: OECD-to-non-OECD export of hazardous waste for final disposal is prohibited regardless of consent. Assessment of Ban Amendment applicability is not optional. It is a required pre-movement check that your R2 certificate will not prompt anyone to do."
        }]
      },

      // ── Section 5: Gamified checker intro ─────────────────────────────────
      {
        type: "heading", tag: "h2", format: "", indent: 0, version: 1,
        children: [{ type: "text", version: 1, format: 0, text: "The 7 Questions R2 Cannot Answer" }]
      },
      {
        type: "paragraph", format: "", indent: 0, version: 1,
        children: [{
          type: "text", version: 1, format: 0,
          text: "Apply these seven questions to your last e-waste shipment. Each one represents a required element of Basel due diligence. Your R2 certificate answers none of them."
        }]
      },
      {
        type: "paragraph", format: "", indent: 0, version: 1,
        children: [{ type: "text", version: 1, format: 2, text: "Q1. " }, { type: "text", version: 1, format: 0, text: "Was a formal Basel notification filed with your exporting country's Competent Authority before the shipment moved?" }]
      },
      {
        type: "paragraph", format: "", indent: 0, version: 1,
        children: [{ type: "text", version: 1, format: 2, text: "Q2. " }, { type: "text", version: 1, format: 0, text: "Did you receive written consent — not verbal confirmation, written consent — from the importing country's Competent Authority?" }]
      },
      {
        type: "paragraph", format: "", indent: 0, version: 1,
        children: [{ type: "text", version: 1, format: 2, text: "Q3. " }, { type: "text", version: 1, format: 0, text: "Were all transit states formally notified and cleared before the shipment departed?" }]
      },
      {
        type: "paragraph", format: "", indent: 0, version: 1,
        children: [{ type: "text", version: 1, format: 2, text: "Q4. " }, { type: "text", version: 1, format: 0, text: "Did you confirm the destination country has no blanket import ban under Article 4(2)(e)?" }]
      },
      {
        type: "paragraph", format: "", indent: 0, version: 1,
        children: [{ type: "text", version: 1, format: 2, text: "Q5. " }, { type: "text", version: 1, format: 0, text: "Is waste code A1181 confirmed and declared in the notification documents?" }]
      },
      {
        type: "paragraph", format: "", indent: 0, version: 1,
        children: [{ type: "text", version: 1, format: 2, text: "Q6. " }, { type: "text", version: 1, format: 0, text: "Is the Annex VI movement document verified, completed, and filed for this shipment?" }]
      },
      {
        type: "paragraph", format: "", indent: 0, version: 1,
        children: [{ type: "text", version: 1, format: 2, text: "Q7. " }, { type: "text", version: 1, format: 0, text: "Was Ban Amendment applicability assessed — specifically whether this is an OECD-to-non-OECD movement for final disposal?" }]
      },
      {
        type: "paragraph", format: "", indent: 0, version: 1,
        children: [{
          type: "text", version: 1, format: 0,
          text: "Every NO is documented exposure. Every unanswered question is a gap an enforcement action can walk through."
        }]
      },
      {
        type: "paragraph", format: "", indent: 0, version: 1,
        children: [
          { type: "text", version: 1, format: 0, text: "Use the interactive compliance checker to score your shipment → " },
          {
            type: "link",
            version: 1,
            fields: { url: "/tools/compliance-check", newTab: false, linkType: "custom" },
            children: [{ type: "text", version: 1, format: 1, text: "Score My Exposure at dexmetal.com/tools/compliance-check" }]
          }
        ]
      },

      // ── Section 6 ─────────────────────────────────────────────────────────
      {
        type: "heading", tag: "h2", format: "", indent: 0, version: 1,
        children: [{ type: "text", version: 1, format: 0, text: "What Real Basel Due Diligence Looks Like" }]
      },
      {
        type: "paragraph", format: "", indent: 0, version: 1,
        children: [{
          type: "text", version: 1, format: 0,
          text: "Basel compliance is a document chain, not a certification. For a single compliant shipment, your file should contain: the Competent Authority notification filing receipt, written consent from the importing CA, transit state clearances, a completed Annex VI movement document, and confirmed waste code classification."
        }]
      },
      {
        type: "paragraph", format: "", indent: 0, version: 1,
        children: [{
          type: "text", version: 1, format: 0,
          text: "Your recycler's R2 certificate belongs in that file too — as evidence of facility-level controls. But it sits alongside these documents. It does not replace them. Treating it as a substitute for PIC compliance is the structural gap that explains the statistic at the top of this article."
        }]
      },
      {
        type: "paragraph", format: "", indent: 0, version: 1,
        children: [{
          type: "text", version: 1, format: 0,
          text: "The DexMetal Basel Navigator and Competent Authority API exist to close this gap — giving operators and compliance teams access to the CA contact database, notification status guidance, and country-level import ban data that the R2 audit process was never designed to provide."
        }]
      },
      {
        type: "paragraph", format: "", indent: 0, version: 1,
        children: [
          { type: "text", version: 1, format: 0, text: "The Urban Miners Playbook covers the full compliance workflow for operators and freight forwarders → " },
          {
            type: "link",
            version: 1,
            fields: { url: "/playbook", newTab: false, linkType: "custom" },
            children: [{ type: "text", version: 1, format: 1, text: "Download free at dexmetal.com/playbook" }]
          }
        ]
      }
    ]
  }
};

// ── 4. POST DATA ──────────────────────────────────────────────────────────────
const postData = {
  title: "The Certificate That Doesn't Stop a Crime",
  slug: "the-certificate-that-doesnt-stop-a-crime",
  _status: "published",
  publishedAt: new Date("2026-05-19T09:00:00.000Z").toISOString(),
  content: lexicalContent,
  at_a_glance: "R2 certification has become the default proof of compliance in e-waste trade. It's not. Under Basel Article 6, every transboundary movement requires government-to-government Prior Informed Consent that R2 auditors never verify. Here are the seven questions your supplier file is missing.",
  toc_enabled: true,
  difficulty: "intermediate",
  read_time: 7,
  cta_label: "Download the Urban Miners Playbook",
  cta_url: "/playbook",
  risk_table: [
    { level: "high", description: "R2 certified supplier presented as Basel compliant — no PIC documents on file", country: "All contexts" },
    { level: "high", description: "Shipment to country with blanket e-waste import ban", country: "Caribbean, West Africa" },
    { level: "high", description: "OECD-to-non-OECD movement — Ban Amendment not assessed", country: "All Basel parties" },
    { level: "medium", description: "Transit states not formally notified", country: "Multi-leg shipments" },
    { level: "medium", description: "Movement document (Annex VI) incomplete or missing", country: "All contexts" },
    { level: "low", description: "Waste code A1181 not confirmed in notification documents", country: "All contexts" }
  ],
  faq: [
    {
      question: "Does R2 certification mean my supplier is Basel compliant?",
      answer: "No. R2 certifies facility-level operations — data sanitization, environmental controls, and downstream chain documentation. It does not verify that Prior Informed Consent was obtained for any specific shipment. That consent is a government-to-government transaction that R2 auditors are structurally outside of."
    },
    {
      question: "What is Prior Informed Consent (PIC) under Basel?",
      answer: "PIC is the written consent issued by an importing country's Competent Authority, following a formal notification from the exporting country's Competent Authority. Under Article 6 of the Basel Convention, this consent must be received in writing before a transboundary shipment of hazardous waste departs."
    },
    {
      question: "What happens if a shipment is caught without PIC?",
      answer: "Basel Article 9 defines this as illegal traffic. Under Article 9(2), the exporting State has 30 days to ensure the waste is repatriated at the exporter's expense. Regulatory scrutiny on all other movements from that exporter typically follows."
    },
    {
      question: "Which countries have blanket import bans on hazardous e-waste?",
      answer: "Many Caribbean and West African nations operate under blanket import prohibitions, meaning no PIC consent can be issued regardless of what the exporter requests. Article 4(2)(e) of the Basel Convention requires parties to prohibit exports to countries with such bans. Country-specific status is available through the DexMetal Basel CA API."
    },
    {
      question: "What is the Ban Amendment and does it apply to my shipment?",
      answer: "The Ban Amendment (Decision III/1, in force since 2019) prohibits OECD countries from exporting hazardous waste for final disposal to non-OECD countries, regardless of consent. If your shipment moves from an OECD country to a non-OECD destination for final disposal or recovery, Ban Amendment applicability must be assessed before the movement proceeds."
    }
  ],
  meta: {
    title: "The Certificate That Doesn't Stop a Crime | DexMetal Basel Compliance",
    description: "R2 certification doesn't verify Basel Article 6 Prior Informed Consent. Learn what the 7 questions are that your supplier file is missing — and what illegal traffic under Article 9 actually means."
  }
};

// ── 5. CREATE POST ────────────────────────────────────────────────────────────
console.log('Creating post...');
const createRes = await fetch(`${BASE}/api/posts`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `JWT ${token}`
  },
  body: JSON.stringify(postData)
});

const result = await createRes.json();
console.log('Status:', createRes.status);

if (createRes.status !== 201 || result.errors) {
  console.error('Create failed:', JSON.stringify(result.errors || result, null, 2));
  process.exit(1);
}

console.log('\n✓ Post created successfully');
console.log('  ID:', result.doc?.id);
console.log('  Slug:', result.doc?.slug);
console.log('  Status:', result.doc?._status);
console.log('  URL: https://dexmetal.com/blog/' + result.doc?.slug);
console.log('\nNext step: Upload hero image via Payload admin or media upload script.');
