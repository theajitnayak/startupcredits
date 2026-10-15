// An eligibility precheck, not an award predictor. No analytics or network calls.
const rules={
 'gcp-startups':[['company_age_months','max',24],['working_mvp','is',true],['seeking_vc','is',true],['previous_google_credits_beyond_trial','is',false]],
 'greptile-oss':[['public_repo','is',true],['osi_license','is',true],['github_stars','min',50],['commercial_product','is',false]],
 'mongodb-startups':[['company_age_months','below',84],['agency','is',false],['previous_mongodb_award','is',false],['company_website','is',true]],
 'fireworks-startups':[['company_age_months','max',60],['funding_usd','above',500000],['series_d_or_later','is',false]],
 'posthog-startups':[['company_age_months','below',24],['funding_usd','below',5000000],['company_domain_email','is',true]],
 'nvidia-inception':[['incorporated','is',true]],
 '1password-oss':[['team_account','is',true],['core_contributor','is',true],['project_age_days','min',30],['permissive_license','is',true]],
 'netlify-oss':[['noncommercial','is',true],['code_of_conduct','is',true],['license_osi_or_cc','is',true]],
};
const labels={company_age_months:'Company age in months',working_mvp:'Working product or MVP',seeking_vc:'Planning venture funding soon',previous_google_credits_beyond_trial:'Previous Google credits beyond free trial',public_repo:'Public repository',osi_license:'OSI-approved license',github_stars:'Repository stars',commercial_product:'Part of a commercial product',agency:'Agency or development shop',previous_mongodb_award:'Previous MongoDB startup award',company_website:'Active company website',funding_usd:'Funding raised in USD',series_d_or_later:'Series D or later',company_domain_email:'Email on the company domain',incorporated:'Company incorporated',team_account:'1Password team account',core_contributor:'Core project contributor',project_age_days:'Project age in days',permissive_license:'Permissive open source license',noncommercial:'Non-commercial project',code_of_conduct:'Repository Code of Conduct',license_osi_or_cc:'OSI or Creative Commons license'};
export function questionsFor(program){return(rules[program.id]??[]).map(([key,op])=>({key,label:labels[key]??key,type:op==='is'?'boolean':'number'}));}
export function assessFit(program,profile={}){
 if(program.source!=='official'||!program.verification)return{status:'not_listed',reasons:['Missing reviewed official evidence'],missing:[]};
 if(program.status!=='open')return{status:'closed',reasons:['Provider is not accepting applications'],missing:[]};
 const blocked=[],missing=[];
 for(const [key,op,value] of rules[program.id]??[]){
  const actual=profile[key];
  if(actual==null||actual==='unsure'){missing.push(key);continue;}
  if((op==='is'&&typeof actual!==typeof value)||(op!=='is'&&(typeof actual!=='number'||!Number.isFinite(actual)||actual<0))){missing.push(key);continue;}
  const pass=op==='is'?actual===value:op==='max'?actual<=value:op==='below'?actual<value:op==='min'?actual>=value:actual>value;
  if(!pass)blocked.push(key);
 }
 return {status:blocked.length?'criteria_not_met':'needs_review',reasons:blocked,
  missing,requirements:program.requirements,source:program.url,checked_at:program.last_checked,
  next_step:blocked.length?'Review the failed published conditions.':missing.length?'Answer the missing facts, then review the full provider terms.':'Listed checks passed. Provider must confirm full eligibility and award.'};
}
