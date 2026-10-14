import fs from 'node:fs/promises';
import {validateCatalog} from './catalog-policy.mjs';
const asOf=process.argv[2];
if(!asOf){console.error('Pass the actual review date as YYYY-MM-DD.');process.exit(2);}
const d=JSON.parse(await fs.readFile('data/programs.json','utf8'));
const errors=validateCatalog(d,asOf);
if(errors.length){console.error(errors.join('\n'));process.exit(1);}
console.log(`${d.programs.length} source-reviewed entries passed the publication checks.`);
