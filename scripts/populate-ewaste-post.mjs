import fetch from 'node-fetch';

const BASE = 'http://204.168.231.188:3000';
const PASSWORD = 'E7m^dKq*?!6!YzJ';

console.log('=== DexMetal E-Waste Post Populate Script ===\n');

const login = await fetch(`${BASE}/api/users/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'rdavid@gvoltt.com', password: PASSWORD })
});
const loginData = await login.json();

if (!loginData.token) {
  console.error('Login failed:', loginData);
  process.exit(1);
}

const { token, user } = loginData;
console.log('✓ Logged in as:', user.email);

const find = await fetch(`${BASE}/api/posts?where[slug][equals]=blog-billion-dollar-ewaste-industry-opportunity`, {
  headers: { Authorization: `JWT ${token}` }
});
const findData = await find.json();

if (!findData.docs || findData.docs.length === 0) {
  console.error('Post not found:', findData);
  process.exit(1);
}

const post = findData.docs[0];
const id = post.id;
console.log('✓ Found post:', post.slug, '(ID:', id + ')');

const updateData = {
  at_a_glance: "E-waste is the world's fastest-growing waste stream, projected to reach $14 billion by 2026. Under the Basel Convention, cross-border movement of used electronics requires prior informed consent, proper notification, and certified recycling. Non-compliance risks trade bans, fines, and reputational damage. This guide shows you how to identify your obligations and act.",
  toc_enabled: true,
  difficulty: "intermediate",
  read_time: 8,
  cta_label: "Check Your Country's Basel CA",
  cta_url: "/basel-ca-api",
  risk_table: [
    { level: "high", description: "Exporting e-waste without prior informed consent", country: "All Basel parties" },
    { level: "high", description: "Misclassifying used electronics as functional goods", country: "EU, US, UK" },
    { level: "medium", description: "Missing or incomplete movement documents", country: "Caribbean, LATAM" },
    { level: "low", description: "Delayed notification submission", country: "All parties" }
  ],
  faq: [
    { question: "What is e-waste under the Basel Convention?", answer: "E-waste refers to discarded electrical and electronic equipment including computers, phones, batteries, and appliances. Under the Basel Convention, it is classified as hazardous waste when exported across borders without proper controls." },
    { question: "Do I need permission to export used electronics?", answer: "Yes. The Basel Convention requires prior informed consent from the receiving country's Competent Authority before any transboundary movement of e-waste." },
    { question: "What countries are covered by the Basel Convention?", answer: "188 countries are parties to the Basel Convention. DexMetal's Basel CA API covers competent authority contacts for all participating nations." },
    { question: "What happens if I violate Basel e-waste rules?", answer: "Penalties include trade bans, mandatory return of shipments, fines, and in some jurisdictions criminal liability for exporters and importers." }
  ]
};

console.log('Attempting REST API PATCH...');
const update = await fetch(`${BASE}/api/posts/${id}`, {
  method: 'PATCH',
  headers: { 
    'Content-Type': 'application/json', 
    Authorization: `JWT ${token}`
  },
  body: JSON.stringify(updateData)
});

const result = await update.json();
console.log('  Status:', update.status);

if (result.errors) {
  console.log('  Result: Error -', result.errors[0]?.message || 'Unknown error');
  console.log('\n⚠ REST API PATCH returned 500 - this appears to be a Payload CMS issue with the posts collection.');
  console.log('The post exists, authentication works, but the update operation fails server-side.');
  console.log('\nData that WOULD be applied if REST API worked:');
  console.log(JSON.stringify(updateData, null, 2));
  process.exit(1);
} else {
  console.log('  Result: Success');
  console.log('✓ Post updated successfully');
}