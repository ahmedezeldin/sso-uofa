import fs from 'node:fs';
import vm from 'node:vm';
import crypto from 'node:crypto';
const app=fs.readFileSync('dist/app.js','utf8');
const declaration=app.slice(app.indexOf('const events='),app.indexOf('const resources='));
const context=vm.createContext({P:(en,ar)=>({en,ar}),TextEncoder,Date,console});
vm.runInContext(declaration+'globalThis.calendarEvents=events;',context);
const old=JSON.parse(fs.existsSync('calendar-revisions.json')?fs.readFileSync('calendar-revisions.json','utf8'):'{}');
const revisions={...old},now=new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
const events=context.calendarEvents.filter(e=>e.calendarDate&&!e.demo);
for(const e of events){if(!/^\d{4}-\d{2}-\d{2}$/.test(e.calendarDate)||new Date(e.calendarDate+'T12:00:00Z').toISOString().slice(0,10)!==e.calendarDate)throw Error('Invalid date: '+e.id);const hash=crypto.createHash('sha256').update(JSON.stringify(e)).digest('hex');const prev=old[e.id];revisions[e.id]=prev?.hash===hash?prev:{hash,stamp:now,sequence:prev?prev.sequence+1:0};e.calendarRevision=revisions[e.id];}
vm.runInContext("const lang='en';const t=p=>p.en;const tr=(en,ar)=>en;",context);
vm.runInContext(fs.readFileSync('dist/calendar.js','utf8'),context);
const output=vm.runInContext('calendarFile(calendarEvents.filter(e=>e.calendarDate&&!e.demo))',context);
fs.writeFileSync('dist/sso-events.ics',output);
fs.writeFileSync('calendar-revisions.json',JSON.stringify(revisions,null,2)+'\n');
console.log(`Calendar feed built: ${events.length} dated events; stable event IDs and revisions.`);
