/**
 * publish-article1-blog.mjs
 * Creates Article 1 as draft, then publish step handled by upload-and-patch.mjs
 * Standing rule: Never use direct psql writes. Always use Payload API.
 * Run: node /var/www/dexmetal-web/scripts/publish-article1-blog.mjs
 */

const BASE = 'http://127.0.0.1:3000';
const EMAIL = 'rdavid@gvoltt.com';
const PASSWORD = 'E7m^dKq*?!6!YzJ';

console.log('=== DexMetal Article 1 Blog Publish Script ===\n');

const loginRes = await fetch(`${BASE}/api/users/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: EMAIL, password: PASSWORD })
});
const loginData = await loginRes.json();
if (!loginData.token) { console.error('Login failed:', loginData); process.exit(1); }
const { token } = loginData;
console.log('✓ Logged in');

const checkRes = await fetch(
  `${BASE}/api/posts?where[slug][equals]=the-certificate-that-doesnt-stop-a-crime&draft=true`,
  { headers: { Authorization: `JWT ${token}` } }
);
const checkData = await checkRes.json();
if (checkData.docs?.length > 0) {
  console.log('⚠ Post already exists. ID:', checkData.docs[0].id);
  console.log('  Skipping creation. Upload-and-patch will patch hero + publish.');
  console.log('EXISTING_ID:', checkData.docs[0].id);
  process.exit(0);
}
console.log('✓ Slug clear — creating draft');

const lexicalContent = {
  root: {
    type: "root", format: "", indent: 0, version: 1,
    children: [
      { type: "paragraph", format: "", indent: 0, version: 1,
        children: [{ type: "text", version: 1, format: 1,
          text: "8 of 10 e-waste companies caught illegally exporting held active R2 certification." }] },
      { type: "paragraph", format: "", indent: 0, version: 1,
        children: [{ type: "text", version: 1, format: 0,
          text: "That is not a coincidence. That is a structural gap — one hiding in supplier files for years because the industry confused facility-level certification with trade-level compliance. R2 audits the facility. It reviews data sanitization, environmental controls, downstream chain documentation. What it does not do is verify that any government-to-government consent ever occurred. It cannot — that transaction is between states, not between a recycler and a certification body." }] },
      { type: "paragraph", format: "", indent: 0, version: 1,
        children: [{ type: "text", version: 1, format: 0,
          text: "This article explains exactly what R2 audits, what the Basel Convention actually requires for legal transboundary movement, and the seven questions that will tell you whether your last shipment was compliant — or a 30-day repatriation notice waiting to happen." }] },

      { type: "heading", tag: "h2", format: "", indent: 0, version: 1,
        children: [{ type: "text", version: 1, format: 0, text: "What R2 Certifies — and What It Cannot" }] },
      { type: "paragraph", format: "", indent: 0, version: 1,
        children: [{ type: "text", version: 1, format: 0,
          text: "R2 (Responsible Recycling) is a facility-level standard maintained by Sustainable Electronics Recycling International. Auditors assess your physical processing operation: data sanitization protocols, environmental controls, worker health and safety, and your downstream vendor chain. A valid R2 certificate tells a buyer this facility has passed a third-party audit of its internal operations." }] },
      { type: "paragraph", format: "", indent: 0, version: 1,
        children: [{ type: "text", version: 1, format: 0,
          text: "What it does not confirm — and cannot confirm — is whether any government ever consented to the transboundary movement that recycler is about to execute. R2 auditors are not governments. They have no visibility into the notification and consent exchange required under international trade law. They do not verify it because it is structurally outside their scope. Placing an R2 certificate in a supplier file as evidence of Basel compliance is a category error: like presenting a food hygiene certificate as proof a restaurant followed import customs law." }] },
      { type: "paragraph", format: "", indent: 0, version: 1,
        children: [{ type: "text", version: 1, format: 0,
          text: "Under the Basel Convention, e-waste classified under Annex VIII — waste code A1181, covering electrical and electronic assemblies or scrap — qualifies as hazardous waste. Any transboundary movement of hazardous waste must follow a specific sequence before a container departs. This sequence is Prior Informed Consent, or PIC. Step one: the exporting country Competent Authority formally notifies the importing country Competent Authority. Step two: the importing country issues written consent — not verbal confirmation, not an email acknowledgement from a recycler, written consent from the state body designated under the Convention. Step three: all transit states are notified and cleared. Step four: an Annex VI movement document accompanies the shipment from origin to final destination. This exchange happens between governments. Freight forwarders cannot issue consent. Certification bodies cannot issue consent. States can." }] },

      { type: "heading", tag: "h2", format: "", indent: 0, version: 1,
        children: [{ type: "text", version: 1, format: 0, text: "When the Convention Calls It a Crime" }] },
      { type: "paragraph", format: "", indent: 0, version: 1,
        children: [{ type: "text", version: 1, format: 0,
          text: "Basel Article 9 defines illegal traffic as transboundary movement of hazardous waste without the PIC sequence described in Article 6. The Convention text does not call this a regulatory infringement or a civil matter. It calls it illegal traffic. Under Article 9(2), if illegal traffic is attributable to the exporter, the State of export has 30 days to ensure the waste is returned — at the exporter's expense. A repatriated container is not the end of the exposure. It is the beginning of regulatory scrutiny on every other movement that exporter has made." }] },
      { type: "paragraph", format: "", indent: 0, version: 1,
        children: [{ type: "text", version: 1, format: 0,
          text: "Caribbean and West African destination countries sit at the sharp end of this structural gap. Many operate under blanket import bans on hazardous waste, meaning no PIC consent can be issued because the law prohibits it. Article 4(2)(e) of the Convention requires parties to prohibit export of hazardous waste to countries that have banned its import. A West African port authority turning back a container is not a customs anomaly. It is Article 4(2)(e) in operation. The ban check should have happened before the contract was signed, not after the container arrives at the quay." }] },
      { type: "paragraph", format: "", indent: 0, version: 1,
        children: [{ type: "text", version: 1, format: 0,
          text: "The Ban Amendment — adopted in 1995 and entering into force in 2019 — adds a further layer: OECD-to-non-OECD export of hazardous waste for final disposal is prohibited regardless of consent. Assessment of Ban Amendment applicability is not optional. It is a required pre-movement check that your R2 certificate will not prompt anyone to do. Port detentions, trade finance complications, and customer contract breaches follow the formal notification that a shipment was illegal traffic." }] },

      { type: "heading", tag: "h2", format: "", indent: 0, version: 1,
        children: [{ type: "text", version: 1, format: 0, text: "The Seven Questions R2 Cannot Answer" }] },
      { type: "paragraph", format: "", indent: 0, version: 1,
        children: [{ type: "text", version: 1, format: 0,
          text: "Apply these seven questions to your last e-waste shipment. Each one represents a required element of Basel due diligence. Your R2 certificate answers none of them. Every NO is documented exposure. Every unanswered question is a gap an enforcement action can walk through." }] },
      { type: "paragraph", format: "", indent: 0, version: 1,
        children: [{ type: "text", version: 1, format: 2, text: "Q1. " }, { type: "text", version: 1, format: 0, text: "Was a formal Basel notification filed with your exporting country's Competent Authority before the shipment moved?" }] },
      { type: "paragraph", format: "", indent: 0, version: 1,
        children: [{ type: "text", version: 1, format: 2, text: "Q2. " }, { type: "text", version: 1, format: 0, text: "Did you receive written consent — not verbal confirmation, written consent — from the importing country's Competent Authority?" }] },
      { type: "paragraph", format: "", indent: 0, version: 1,
        children: [{ type: "text", version: 1, format: 2, text: "Q3. " }, { type: "text", version: 1, format: 0, text: "Were all transit states formally notified and cleared before the shipment departed?" }] },
      { type: "paragraph", format: "", indent: 0, version: 1,
        children: [{ type: "text", version: 1, format: 2, text: "Q4. " }, { type: "text", version: 1, format: 0, text: "Did you confirm the destination country has no blanket import ban under Article 4(2)(e)?" }] },
      { type: "paragraph", format: "", indent: 0, version: 1,
        children: [{ type: "text", version: 1, format: 2, text: "Q5. " }, { type: "text", version: 1, format: 0, text: "Is waste code A1181 confirmed and declared in the notification documents?" }] },
      { type: "paragraph", format: "", indent: 0, version: 1,
        children: [{ type: "text", version: 1, format: 2, text: "Q6. " }, { type: "text", version: 1, format: 0, text: "Is the Annex VI movement document verified, completed, and filed for this specific shipment?" }] },
      { type: "paragraph", format: "", indent: 0, version: 1,
        children: [{ type: "text", version: 1, format: 2, text: "Q7. " }, { type: "text", version: 1, format: 0, text: "Was Ban Amendment applicability assessed — specifically whether this is an OECD-to-non-OECD movement for final disposal?" }] },
      { type: "paragraph", format: "", indent: 0, version: 1,
        children: [{ type: "text", version: 1, format: 0,
          text: "Use the interactive compliance checker to score your shipment exposure at dexmetal.com/tools/compliance-check. Score 0-3: high exposure, immediate remediation required. Score 4-6: partial compliance, specific gaps identified. Score 7: full compliance checklist met." }] },

      { type: "heading", tag: "h2", format: "", indent: 0, version: 1,
        children: [{ type: "text", version: 1, format: 0, text: "What Real Basel Due Diligence Looks Like" }] },
      { type: "paragraph", format: "", indent: 0, version: 1,
        children: [{ type: "text", version: 1, format: 0,
          text: "Basel compliance is a document chain, not a certification. For a single compliant shipment, your file should contain: the Competent Authority notification filing receipt, written consent from the importing CA, transit state clearances, a completed Annex VI movement document, and confirmed waste code classification. Your recycler's R2 certificate belongs in that file too — as evidence of facility-level controls. But it sits alongside these documents. It does not replace them." }] },
      { type: "paragraph", format: "", indent: 0, version: 1,
        children: [{ type: "text", version: 1, format: 0,
          text: "Treating R2 as a substitute for PIC compliance is the structural gap that explains the statistic at the top of this article. Eight of ten companies caught illegally exporting held active certification. The certificate was genuine. The consent was missing. Those are not equivalent failures — the consent failure is the one that triggers Article 9 repatriation. The DexMetal Basel Navigator and Competent Authority API exist to close this gap: CA contact data for all Basel signatory countries, country-level import ban status, and notification guidance for the trade corridors that carry the most enforcement risk." }] },
      { type: "paragraph", format: "", indent: 0, version: 1,
        children: [{ type: "text", version: 1, format: 0,
          text: "The Urban Miners Playbook covers the full compliance workflow for operators and freight forwarders — the document sequence, the CA contact process, and the pre-movement checklist that R2 audits were never designed to replace. Download it free at dexmetal.com/playbook." }] }
    ]
  }
};

const postData = {
  title: "The Certificate That Doesn't Stop a Crime",
  slug: "the-certificate-that-doesnt-stop-a-crime",
  _status: "draft",
  publishedAt: new Date("2026-05-19T09:00:00.000Z").toISOString(),
  content: lexicalContent,
  at_a_glance: "R2 certification has become the default proof of compliance in e-waste trade. It is not. Under Basel Article 6, every transboundary movement requires government-to-government Prior Informed Consent that R2 auditors never verify. Here are the seven questions your supplier file is missing.",
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
    { question: "Does R2 certification mean my supplier is Basel compliant?", answer: "No. R2 certifies facility-level operations — data sanitization, environmental controls, and downstream chain documentation. It does not verify that Prior Informed Consent was obtained for any specific shipment. That consent is a government-to-government transaction that R2 auditors are structurally outside of." },
    { question: "What is Prior Informed Consent (PIC) under Basel?", answer: "PIC is the written consent issued by an importing country Competent Authority, following a formal notification from the exporting country Competent Authority. Under Article 6 of the Basel Convention, this consent must be received in writing before a transboundary shipment of hazardous waste departs." },
    { question: "What happens if a shipment is caught without PIC?", answer: "Basel Article 9 defines this as illegal traffic. Under Article 9(2), the exporting State has 30 days to ensure the waste is repatriated at the exporter's expense. Regulatory scrutiny on all other movements from that exporter typically follows." },
    { question: "Which countries have blanket import bans on hazardous e-waste?", answer: "Many Caribbean and West African nations operate under blanket import prohibitions, meaning no PIC consent can be issued regardless of what the exporter requests. Country-specific status is available through the DexMetal Basel CA API." },
    { question: "What is the Ban Amendment and does it apply to my shipment?", answer: "The Ban Amendment prohibits OECD countries from exporting hazardous waste for final disposal to non-OECD countries, regardless of consent. If your shipment moves from an OECD country to a non-OECD destination for final disposal or recovery, Ban Amendment applicability must be assessed before the movement proceeds." }
  ],
  meta: {
    title: "The Certificate That Doesn't Stop a Crime | DexMetal Basel Compliance",
    description: "R2 certification does not verify Basel Article 6 Prior Informed Consent. Learn the 7 questions your supplier file is missing and what illegal traffic under Article 9 actually means."
  }
};

console.log('Creating draft post...');
const createRes = await fetch(`${BASE}/api/posts`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
  body: JSON.stringify(postData)
});

const result = await createRes.json();
console.log('Status:', createRes.status);

if (createRes.status !== 201 || result.errors) {
  console.error('Create failed:', JSON.stringify(result.errors || result, null, 2));
  process.exit(1);
}

console.log('\n✓ Draft created');
console.log('  ID:', result.doc?.id);
console.log('  Slug:', result.doc?.slug);
console.log('  Status:', result.doc?._status);
console.log('\nNext: upload-and-patch.mjs will add hero image and publish.');
