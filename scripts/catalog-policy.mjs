const hosts=new Set(['github.com','docs.github.com','claude.com','vercel.com','neon.com','www.mintlify.com','snyk.io','www.browserstack.com','sentry.io','www.datadoghq.com','www.netlify.com','circleci.com','www.blacksmith.sh','www.greptile.com','openpanel.dev','www.convex.dev','www.sanity.io','docs.gitbook.com','crowdin.com','stainless.com','zulip.com','about.codecov.io','coveralls.io','chromatic.com','argos-ci.com','www.sonarsource.com','signpath.io','sourcery.ai','webclaw.io','upstash.com','www.cloudflare.com','aws.amazon.com','cloud.google.com','www.databricks.com','startups.microsoft.com','posthog.com','www.nvidia.com','www.mongodb.com','www.intercom.com','www.hubspot.com','www.notion.com','modal.com','fireworks.ai','www.alibabacloud.com','www.e2enetworks.com','nebius.com','openai.com','www.together.ai']);
export function validateCatalog(catalog,asOf){
 hosts.add('www.algolia.com');
 hosts.add('elevenlabs.io');
 const errors=[]; const ids=new Set();
 for(const p of catalog.programs??[]){
  if(ids.has(p.id)) errors.push(`${p.id}: duplicate ID`); ids.add(p.id);
  if(p.source!=='official'||['unverified','reported'].includes(p.status)) errors.push(`${p.id}: unsupported publication state`);
  const v=p.verification;
  if(!v||!v.reviewed_by||!v.source_sha256||v.official_url!==p.url) errors.push(`${p.id}: missing source review`);
  if(!/^\d{4}-\d{2}-\d{2}$/.test(p.last_checked??'')||p.last_checked>asOf||v?.checked_at!==p.last_checked) errors.push(`${p.id}: invalid check date`);
  if(!p.source_quote||!p.requirements?.length||!p.value_label) errors.push(`${p.id}: incomplete reviewed claims`);
  if(p.value_usd!==null&&!v?.amount_evidence) errors.push(`${p.id}: unsupported dollar value`);
  if(p.entry_usd!=null&&!v?.entry_evidence) errors.push(`${p.id}: unsupported entry amount`);
  try{const u=new URL(p.url);if(u.protocol!=='https:'||!hosts.has(u.hostname))errors.push(`${p.id}: unapproved source`);if(u.hostname==='github.com'&&!u.pathname.startsWith('/1Password/'))errors.push(`${p.id}: unapproved publisher repository`);}catch{errors.push(`${p.id}: invalid source URL`);}
 }
 return errors;
}
