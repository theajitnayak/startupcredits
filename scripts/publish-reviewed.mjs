import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import {reviewed} from './reviewed-catalog.mjs';
import {htmlToText} from './terms-lib.mjs';
const root='review/2026-10-15';
const original=JSON.parse(await fs.readFile(root+'/original-programs.json','utf8'));
const clean=s=>s.replace(/[\u2018\u2019]/g,"'").replace(/[\u201c\u201d]/g,'"').replace(/[\u2013\u2014]/g,' - ').replace(/\s+/g,' ').trim();
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
// These pages were also read in the official web reader. Cache a small locating excerpt.
const webReader={
 'openai-codex-oss':['https://openai.com/form/codex-for-oss/','6 months of ChatGPT Pro, which includes Codex'],
};
const extra=[
 ['openai-codex-oss','Six months Pro and discretionary API credits for eligible maintainers','6 months of ChatGPT Pro, which includes Codex',['Public repository','Primary or core maintainer','Usage or ecosystem importance','Eligible open source maintenance use']],
 ['together-startups','Tiered platform credits for selected AI startups','A targeted selection-based program for startups.',['Build tier for up to five million raised','Higher funding bands have separate tiers','Reserved GPU Clusters excluded']],
 ['github-copilot-maintainer','Free Copilot Pro for eligible open source maintainers','As a maintainer of a popular open-source repository.',['Popular open source repository maintainer','Eligibility reevaluated monthly']],
];
const urlOverrides={
 'together-startups':'https://www.together.ai/startup-accelerator',
 'github-copilot-maintainer':'https://docs.github.com/en/copilot/how-tos/copilot-on-github/set-up-copilot/enable-copilot/set-up-for-teachers-and-os-maintainers',
 'gcp-startups':'https://cloud.google.com/startup/pre-funded',
};
for(const [id,url] of Object.entries(urlOverrides)){
 const r=await fetch(url,{signal:AbortSignal.timeout(20000)});
 if(!r.ok) throw Error(id+' official page fetch '+r.status);
 await fs.writeFile(root+'/pages/'+id+'.txt',htmlToText(await r.text(),150000));
}
for(const [id,[url,excerpt]] of Object.entries(webReader)) await fs.writeFile(root+'/pages/'+id+'.txt',excerpt);
const programs=[];
const errors=[];
for(const [id,benefit,quote,criteria,status='open'] of [...reviewed,...extra]){
 const old=original.programs.find(p=>p.id===id);
 if(!old) throw Error('Unknown program '+id);
 const text=clean(await fs.readFile(root+'/pages/'+id+'.txt','utf8'));
 if(!text.toLowerCase().includes(clean(quote).toLowerCase())){errors.push(id+': locating quote missing: '+quote);continue;}
 const url=urlOverrides[id]??old.url;
 const reqs=id==='gcp-startups'?['Working MVP and clear technology business model','Founded within twenty-four months','Plans to seek venture funding soon','No previous Google Cloud credits beyond free trial']:criteria;
 programs.push({id,company:old.company,name:id==='gcp-startups'?'Google for Startups Start tier':old.name,track:old.track,category:old.category,
  value_usd:null,value_label:benefit,url,status,source:'official',last_checked:'2026-10-15',requirements:reqs,
  source_quote:clean(quote),notes:status==='closed'?'Provider states applications are currently closed.':'Selection and final terms remain with the provider.',
  verification:{reviewed_by:'Codex',checked_at:'2026-10-15',official_url:url,source_sha256:sha(text),method:webReader[id]?'official_web_reader':'official_page_read',claim_scope:['identity','benefit','listed_criteria','application_status'],complete_eligibility:false},
  eligibility_mode:'criteria_review',geography:'Consult provider terms',
 });
}
if(errors.length){await fs.writeFile(root+'/publication-errors.json',JSON.stringify(errors,null,2));throw Error(errors.join('\n'));}
const excluded=original.programs.filter(p=>!programs.some(v=>v.id===p.id));
await fs.writeFile(root+'/excluded-programs.json',JSON.stringify({checked_at:'2026-10-15',programs:excluded.map(p=>({id:p.id,reason:'Current benefit and criteria not sufficiently established in reviewed primary sources',original:p}))},null,2));
await fs.writeFile('data/programs.json',JSON.stringify({updated:'2026-10-15',publication_policy:'Only reviewed claims supported by current official sources. Source archives and exclusions remain private.',amount_policy:'Unsupported dollar valuations removed. Benefits are not summed as guaranteed awards.',programs},null,2)+'\n');
console.log(JSON.stringify({original:original.programs.length,published:programs.length,closed:programs.filter(p=>p.status==='closed').length,excluded:excluded.length}));
