import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import {htmlToText} from './terms-lib.mjs';
const input=JSON.parse(await fs.readFile('data/programs.json','utf8'));
const output='review/2026-10-15';
await fs.mkdir(output+'/pages',{recursive:true});
await fs.writeFile(output+'/original-programs.json',JSON.stringify(input,null,2));
const rows=[];
let cursor=0;
async function worker(){
 while(cursor<input.programs.length){
  const p=input.programs[cursor++];
  const row={id:p.id,url:p.url,checked_at:'2026-10-15',previous_source:p.source,previous_status:p.status};
  try{
   const r=await fetch(p.url,{signal:AbortSignal.timeout(20000),headers:{'User-Agent':'StartupCredits-EvidenceReview/1.0','Accept':'text/html,application/xhtml+xml'}});
   row.http_status=r.status; row.final_url=r.url;
   const text=htmlToText(await r.text(),150000);
   row.text_length=text.length;
   row.sha256=crypto.createHash('sha256').update(text).digest('hex');
   row.candidate_lines=text.split('\n').map(s=>s.trim()).filter(s=>s.length>20&&/open.source|startup|credit|grant|licen[cs]e|fund|million|month|free|eligible|require|appl|support/i.test(s)).map(s=>s.slice(0,1300)).slice(0,22);
   await fs.writeFile(output+'/pages/'+p.id+'.txt',text);
  }catch(e){row.error=e.name==='TimeoutError'?'timeout':e.message;}
  rows.push(row); console.log(p.id+' '+(row.http_status??row.error)+' '+(row.text_length??0));
 }
}
await Promise.all([worker(),worker(),worker(),worker()]);
rows.sort((a,b)=>a.id.localeCompare(b.id));
await fs.writeFile(output+'/source-audit.json',JSON.stringify(rows,null,2));
console.log('Source checks saved. HTTP success is not claim verification.');
