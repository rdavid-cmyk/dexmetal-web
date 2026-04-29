function firstName(name?: string): string {
  if (!name || !name.trim()) return 'there'
  return name.trim().split(/\s+/)[0]
}

export function asset01Email1(name?: string) {
  const first = firstName(name)
  const html = `<div style="font-family:sans-serif;max-width:600px;color:#1a1a1a">
<p>Hi ${first},</p>
<p>Here is your copy of the eWaste Trade Compliance: Operator&rsquo;s Playbook.</p>
<p>Access it at <a href="https://dexmetal.com/playbook" style="color:#1D9E75">https://dexmetal.com/playbook</a> &mdash; 45 cards covering Basel Convention compliance, material identification, logistics, risk, and the SNAP framework for cross-border trade.</p>
<p>Save the link &mdash; you will want to reference it.</p>
<p>Richard David<br/>DexMetal LLC<br/><a href="https://dexmetal.com" style="color:#1D9E75">dexmetal.com</a></p>
</div>`
  const text = `Hi ${first},\n\nHere is your copy of the eWaste Trade Compliance: Operator's Playbook.\n\nAccess it at https://dexmetal.com/playbook — 45 cards covering Basel Convention compliance, material identification, logistics, risk, and the SNAP framework for cross-border trade.\n\nSave the link — you will want to reference it.\n\nRichard David\nDexMetal LLC\ndexmetal.com`
  return { subject: 'Your eWaste Trade Compliance Playbook is here', html, text }
}

// TODO: Schedule Email 2 (Day 3) and Email 3 (Day 7) via Resend broadcasts or a cron job.

export function asset01Email2(name?: string) {
  const first = firstName(name)
  const html = `<div style="font-family:sans-serif;max-width:600px;color:#1a1a1a">
<p>Hi ${first},</p>
<p>Most operators think their scrap is Annex IX &mdash; non-hazardous, no notification required. Then a single contaminated load changes everything.</p>
<p>Used lead-acid batteries, fluid-contaminated metals, and mixed eWaste routinely trigger Annex VIII classification &mdash; which means Prior Informed Consent, Movement Documents, and Competent Authority approval before the shipment moves.</p>
<p>Getting this wrong costs more than the load is worth.</p>
<p>The Basel Navigator identifies the correct Competent Authority for any country in 182 Basel nations &mdash; free, no account required.</p>
<p>Try it at <a href="https://dexmetal.com/tools/basel-navigator" style="color:#1D9E75">https://dexmetal.com/tools/basel-navigator</a></p>
<p>Richard David<br/>DexMetal LLC</p>
</div>`
  const text = `Hi ${first},\n\nMost operators think their scrap is Annex IX — non-hazardous, no notification required. Then a single contaminated load changes everything.\n\nUsed lead-acid batteries, fluid-contaminated metals, and mixed eWaste routinely trigger Annex VIII classification — which means Prior Informed Consent, Movement Documents, and Competent Authority approval before the shipment moves.\n\nGetting this wrong costs more than the load is worth.\n\nThe Basel Navigator identifies the correct Competent Authority for any country in 182 Basel nations — free, no account required.\n\nTry it at https://dexmetal.com/tools/basel-navigator\n\nRichard David\nDexMetal LLC`
  return { subject: 'The stat most operators get wrong', html, text }
}

export function asset01Email3(name?: string) {
  const first = firstName(name)
  const html = `<div style="font-family:sans-serif;max-width:600px;color:#1a1a1a">
<p>Hi ${first},</p>
<p>One question worth asking before your next international shipment:</p>
<p>If a Tier-1 buyer audited your compliance documentation today &mdash; notifications filed, Movement Documents signed, Competent Authority contacts verified &mdash; would you pass?</p>
<p>Most operators would not. Not because they are doing anything wrong. Because the documentation was never built.</p>
<p>DexMetal offers a written Capability Assessment for operators ready to close that gap. No calls. No meetings. Submit your situation, receive a structured written response from a practitioner with 20+ years of Basel and Caribbean trade experience.</p>
<p>Request yours at <a href="https://dexmetal.com" style="color:#1D9E75">https://dexmetal.com</a> &mdash; Limited assessments available.</p>
<p>Richard David<br/>DexMetal LLC</p>
</div>`
  const text = `Hi ${first},\n\nOne question worth asking before your next international shipment:\n\nIf a Tier-1 buyer audited your compliance documentation today — notifications filed, Movement Documents signed, Competent Authority contacts verified — would you pass?\n\nMost operators would not. Not because they are doing anything wrong. Because the documentation was never built.\n\nDexMetal offers a written Capability Assessment for operators ready to close that gap. No calls. No meetings. Submit your situation, receive a structured written response from a practitioner with 20+ years of Basel and Caribbean trade experience.\n\nRequest yours at https://dexmetal.com — Limited assessments available.\n\nRichard David\nDexMetal LLC`
  return { subject: 'Is your operation ready for global trade?', html, text }
}
