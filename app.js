import { DAYS, suspects } from './days.js';

// Browser-only website: all sensitive checks happen inside Supabase SQL functions.
const cfg = window.OHANA_CONFIG || {};
const root = document.getElementById('app');
let client = null;
let snapshot = null;
let selectedRole = 'player';
let busy = false;
let flash = '';
let flashKind = 'success';
const cachedHints = new Map();
const FINALE = Date.parse('2026-12-14T13:00:00Z');

const esc = value => String(value ?? '').replace(/[&<>"']/g, x => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
const short = value => value ? new Date(value).toLocaleString() : 'Not yet';
const progress = () => snapshot?.profile ?? { solved_days:[], fragments:{}, failed_attempts:{}, hint_tiers:{}, hints_used:0, time_seconds:0, vault_unlocked:false, secret_unlocked:false };
const solved = day => (progress().solved_days || []).includes(day);
const unlockedDate = day => Date.UTC(2026, day === 1 ? 10 : 11, day === 1 ? 30 : day - 1, 13);
const canPlay = day => solved(day) || (!!snapshot?.test_mode || Date.parse(snapshot?.server_time || '') >= unlockedDate(day)) && (day === 1 || solved(day-1));
const pagePath = () => (location.hash || '#/dashboard').replace(/^#/, '');
const setFlash = (message,kind='success') => {flash=message;flashKind=kind;};
const banner = () => { if (!flash) return ''; const s=`<div class="${flashKind==='error'?'error':'success'}" role="status">${esc(flash)}</div>`;flash='';return s;};
const safeLink = value => { try {const u = new URL(value);return ['https:','http:'].includes(u.protocol) ? esc(u.href):'';}catch{return '';} };
const safeDate = input => new Date(input).toLocaleDateString('en-US',{dateStyle:'medium'});

async function rpc(name, args={}) {
  if (!client) throw new Error('Set the public Supabase URL and publishable key in config.js first.');
  const { data, error } = await client.rpc(name,args);
  if (error) throw new Error(error.message || String(error));
  return data;
}
async function refresh(renderAfter=true) {
  snapshot = await rpc('ohana_state');
  if (renderAfter) render();
}
async function track(page) {
  if (snapshot?.role !== 'player') return;
  try {await rpc('ohana_track',{p_page:page});} catch (err) {console.warn('Tracking:',err.message);}
}
function go(path) { location.hash = '#' + path; if (pagePath()===path) render(); }
function signout() { return client.auth.signOut().then(()=>{snapshot=null;location.hash='';render();}); }

function authView(error='') {
  root.innerHTML = `<main class="wrap"><section class="authbox">
    <div class="lock">🛡️</div><p class="kicker">GALACTIC FEDERATION</p>
    <h1>PROJECT <span style="color:var(--bright)">OHANA-626</span></h1>
    <p class="muted">CLASSIFIED INVESTIGATION // SECURE ACCESS</p>
    ${error?`<div class="error" role="alert">${esc(error)}</div>`:''}${banner()}
    <form id="loginForm"><div class="roles">
      <label class="role"><input type="radio" name="role" value="player" ${selectedRole==='player'?'checked':''}> PLAYER ACCESS <span>Agent Bunny (Bella)</span></label>
      <label class="role"><input type="radio" name="role" value="admin" ${selectedRole==='admin'?'checked':''}> ADMIN ACCESS <span>Agent Wyatt</span></label>
    </div><label for="password">Access password</label><input id="password" class="field" name="password" type="password" minlength="6" autocomplete="current-password" placeholder="Enter your password" required>
    <button class="primary" type="submit" ${busy?'disabled':''}>${busy?'AUTHENTICATING…':'GRANT ACCESS'}</button></form>
    <p class="small muted" style="margin-top:18px">No email address is requested. Accounts are verified securely by Supabase.</p>
  </section><p class="footer">CLASSIFIED // NOT A REAL GALACTIC FEDERATION SYSTEM</p></main>`;
}

function shell(content, title='INVESTIGATION TERMINAL') {
 const role = snapshot.role;
 const links = role==='admin' ? [['/admin','Command Center']] : [['/dashboard','Dashboard'],['/reports','Daily Reports'],['/board','Board'],['/archive','Evidence'],['/suspects','Suspects'],['/vault','Vault']];
 const path=pagePath();
 root.innerHTML = `<div class="wrap"><header class="topbar"><a href="#/dashboard" class="brand">✦ PROJECT <span>OHANA-626</span></a><div class="top-actions"><span class="tag">${role==='admin'?'AGENT WYATT // ADMIN':'AGENT BUNNY // PLAYER'}</span><button class="secondary" data-action="logout">Exit</button></div></header>
 <nav class="nav" aria-label="Primary navigation">${links.map(([p,l])=>`<a href="#${p}" class="${path===p || path.startsWith(p+'/')?'active':''}">${l}</a>`).join('')}</nav>
 ${banner()}<main><div class="kicker" style="margin-bottom:12px">${esc(title)} // 626-A</div>${content}</main>
 <footer class="footer">Federation archive • November 30 – December 14, 2026 • Created with care by Agent Wyatt</footer></div>`;
 document.querySelectorAll('[data-qr]').forEach(el => {
  if (!window.QRCode) {el.innerHTML = '<span style="color:#111">QR unavailable — use the link below.</span>';return;}
  try {new window.QRCode(el,{text:el.dataset.qr,width:154,height:154,correctLevel:window.QRCode.CorrectLevel.M});}
  catch {el.textContent='Use signal link';}
 });
}
function metric(label, number) {return `<div class="stat"><div class="label">${esc(label)}</div><div class="number">${esc(number)}</div></div>`;}
function dayCard(day) {
 const open = canPlay(day.id);
 const complete = solved(day.id);
 return `<a class="daytile ${!open?'locked':''}" href="#/reports/${day.id}"><div class="day">DAY ${String(day.id).padStart(2,'0')} • ${esc(day.date)}</div><h3>${esc(day.title)}</h3><p class="muted small">${esc(day.tag)}</p><span class="pill ${complete?'good':open?'':'warn'}">${complete?'✓ RECOVERED':open?'● AVAILABLE':'🔒 SEALED'}</span></a>`;
}
function notices() {
 const notes = snapshot?.notes||[];
 return notes.length ? `<section class="card"><h2>📡 Secure handler transmissions</h2>${notes.slice(0,5).map(n=>`<div class="note"><div class="small muted">${esc(short(n.created_at))}</div>${esc(n.message)}</div>`).join('')}</section>` : '';
}
function dashboard() {
 const p=progress();const done=p.solved_days?.length||0;const next = DAYS.find(x=>!solved(x.id));
 const countdown=Math.max(0,Math.ceil((FINALE-Date.parse(snapshot.server_time))/86400000));
 shell(`<div class="hero"><div class="topline"><span class="seal">🌌</span><span class="tag">MISSION ACTIVE</span></div><h1>Welcome back, Agent Bunny.</h1><p>Experiment 626 has intercepted a classified Federation artifact. Every recovered report brings you closer to the truth.</p><span class="pill">FINAL RETRIEVAL • DECEMBER 14</span></div>
 <div class="three">${metric('Investigation days',`${done} / 15`)}${metric('Evidence recovered',`${done} / 15`)}${metric('Days to finale',`${countdown}`)}</div>
 <section class="card spaced"><h2>Case progress</h2><div class="meter" aria-label="Case progress"><div style="width:${done/15*100}%"></div></div><p class="muted small">${done===15?'All fifteen reports solved. Proceed to the vault.':`The next investigation is ${next?`Day ${next.id}: ${esc(next.title)}`:'pending'}.`}</p><div class="actions"><a class="button" href="#/reports/${next?.id||15}">Open next report</a><a class="button secondary" href="#/board">Investigation board</a></div></section>
 ${snapshot.test_mode?`<div class="notice"><strong>Testing mode is ON.</strong> Date locks are temporarily bypassed. Agent Wyatt should turn testing mode OFF and reset your progress before November 30.</div>`:''}
 ${notices()}
 <section class="card"><h2>Daily case files</h2><div class="grid-days">${DAYS.map(dayCard).join('')}</div></section>`, 'FIELD AGENT DASHBOARD');
}
function reports() {
 shell(`<div class="hero"><h1>Daily Investigation Reports</h1><p>Fifteen reports. Fifteen signals. One missing artifact.</p></div><div class="grid-days">${DAYS.map(dayCard).join('')}</div>`,'DAILY REPORTS');
}
function report(day) {
 const d=DAYS.find(x=>x.id===day);
 if (!d) {shell('<div class="error">Unknown report.</div>');return;}
 if (!canPlay(day)) {
  const date=new Date(unlockedDate(day));
  shell(`<section class="hero"><h1>🔒 SEALED REPORT • DAY ${day}</h1><p>${esc(d.title)}</p><p class="muted">Available at 8:00 AM Eastern on ${esc(safeDate(date))}, after the preceding investigation is solved.</p><a href="#/reports" class="button secondary">Return to reports</a></section>`,'ACCESS RESTRICTED');return;
 }
 const p=progress();const done=solved(day);
 const hintUsed=Number((p.hint_tiers||{})['d'+day]||0);const failures=Number((p.failed_attempts||{})['d'+day]||0);
 const qrURL = location.origin+location.pathname+'#/reports/'+day;
 shell(`<section class="hero"><div class="kicker">DAY ${String(day).padStart(2,'0')} // ${esc(d.tag)}</div><h1>${esc(d.title)}</h1><p>${esc(d.story)}</p><span class="pill ${done?'good':''}">${done?'✓ CLEARED':'SECURITY LEVEL: ACTIVE'}</span></section>
 <section class="card"><h2>🗂️ Evidence File: ${esc(d.evidenceTitle)}</h2><div class="evidence">${esc(d.evidence)}</div><p class="quote">${esc(d.message)}</p><h3>Puzzle instructions</h3><p>${esc(d.question)}</p><div class="data">${esc(d.data)}</div>
 ${done ? `<div class="success"><strong>RETRIEVAL COMPLETE.</strong> Evidence E-${String(day).padStart(2,'0')} recovered. Meta stamp: <strong>${esc((p.fragments||{})['d'+day])}</strong></div><p class="muted small">Hidden clue: ${esc(d.hidden)}</p><a class="button" href="#/reports/${Math.min(day+1,15)}">${day===15?'View final file':'Next investigation'}</a>`:
 `<form id="answerForm" data-day="${day}"><label for="guess">Enter clearance answer</label><div class="form-line"><input class="field" id="guess" name="guess" type="text" maxlength="75" autocapitalize="characters" autocomplete="off" required placeholder="Access word or code"><button class="primary" type="submit">SUBMIT ANSWER</button></div></form><p class="small muted">Failed attempts: ${failures}. Answers ignore case, spaces, and hyphens.</p>`}
 </section><section class="card"><h2>💡 Classified hints</h2><p class="muted small">Three hint levels. Each new level is counted in your progress.</p><div class="actions">${[1,2,3].map(t=>`<button class="secondary" data-action="hint" data-day="${day}" data-tier="${t}" ${t>hintUsed+1?'disabled':''}>${t<=hintUsed?'Review':'Unlock'} hint ${t}</button>`).join('')}</div><div id="hintOutput">${cachedHints.get(day)||''}</div></section>
 <section class="card"><h2>📱 QR Signal ${String(day).padStart(2,'0')}</h2><div class="qr"><div class="qr-box" data-qr="${esc(qrURL)}"></div><div><p class="muted">Scan the signal with another device, or use the link below to reopen this case file.</p><a href="#/reports/${day}">Transmission link • Day ${day}</a></div></div></section>`,'CLASSIFIED REPORT');
}
function archive() {
 const done=DAYS.filter(d=>solved(d.id));
 shell(`<div class="hero"><h1>Evidence Archive</h1><p>Recovered case files automatically appear here as Agent Bunny solves investigations.</p></div>
 <section class="card"><h2>Recovered evidence • ${done.length}/15</h2>${done.length?`<div class="entries">${done.map(d=>`<div class="entry"><div class="label">E-${String(d.id).padStart(2,'0')} • DAY ${d.id}</div><h3>${esc(d.evidenceTitle)}</h3><p>${esc(d.evidence)}</p><p class="small muted">Clue: ${esc(d.hidden)}</p><a href="#/reports/${d.id}">Revisit report</a></div>`).join('')}</div>`:'<p class="muted">No evidence recovered yet. Begin with the first report.</p>'}</section>
 ${progress().vault_unlocked?`<section class="card"><h2>🔓 ARCHIVED FILE 0914-B</h2><p>An unexpected file has appeared in the archives. The record is password protected.</p><a href="#/0914-b" class="button">Open classified archive</a></section>`:''}`,'EVIDENCE ARCHIVE');
}
function board() {
 shell(`<div class="hero"><h1>Investigation Board</h1><p>Every recovered file is part of a larger pattern. Revisit the stamp in each cleared investigation.</p></div>
 <section class="card"><h2>Recovery map</h2><div class="grid-days">${DAYS.map(dayCard).join('')}</div></section>
 <section class="card"><h2>Unexplained symbols</h2><div class="list-inline">${DAYS.map(d=>`<span class="stamp ${solved(d.id)?'':'missing'}" title="Day ${d.id}">${solved(d.id)?esc((progress().fragments||{})['d'+d.id]):'?'}</span>`).join('')}</div><p class="muted small">The Informant's advice: “Every timestamp matters. Do not discard the tiny stamps.”</p></section>`,'INVESTIGATION BOARD');
}
function suspectPage() {
 shell(`<div class="hero"><h1>Suspect Database</h1><p>Four entities are entangled in Incident 626-A. None tells the whole story.</p></div><div class="cols">${suspects.map(s=>`<section class="card"><div class="label">${esc(s.role)}</div><h2>${esc(s.name)}</h2><p class="muted">${esc(s.description)}</p></section>`).join('')}</div>`,'FEDERATION PERSONNEL');
}
function vaultView() {
 const p=progress();const count=p.solved_days?.length||0;
 const stamps=DAYS.map(d=>((p.fragments||{})['d'+d.id]||'•')).join('');
 shell(`<div class="hero"><div class="seal">🔐</div><h1>Final Recovery Vault</h1><p>There has been a second investigation running alongside yours. Arrange the fifteen evidence stamps in chronological order to recover the vault key.</p></div>
 <section class="card"><h2>Meta puzzle assembly</h2><p class="muted">Evidence stamps: ${count} / 15</p><div class="list-inline">${DAYS.map(d=>`<span class="stamp ${solved(d.id)?'':'missing'}" title="Day ${d.id}">${solved(d.id)?esc((p.fragments||{})['d'+d.id]):'?'}</span>`).join('')}</div>
 <p class="small muted">Stamps can be found in the completed report and archive. Read them in day order; ignore spaces.</p>
 ${p.vault_unlocked?`<div class="success">✓ Vault already unlocked. Your recovered files are accessible.</div><button class="primary" data-action="open-vault">OPEN RECOVERED CONTENT</button>`:
 `<form id="vaultForm"><label for="meta">Vault access phrase</label><div class="form-line"><input id="meta" class="field" type="text" name="meta" autocomplete="off" placeholder="Enter all fifteen stamps" required><button class="primary">UNLOCK VAULT</button></div></form>`}
 ${count<15?'<div class="notice">All 15 investigations must be completed before the vault can open.</div>':''}</section><section id="vaultContent"></section>`,'FINAL VAULT');
}
function renderVaultContent(content) {
 if (!content) return;
 const el = document.getElementById('vaultContent');if(!el)return;
 el.innerHTML = `<section class="card"><div class="label">RECOVERY STATUS • ${esc(content.status)}</div><h1>${esc(content.heading)}</h1><p class="success">Artifact classification: <strong>${esc(content.classification)}</strong></p><h2>Recovered memories</h2><div class="cols">${(content.scrapbook||[]).map(item=>`<div class="entry"><h3>${esc(item.title)}</h3><p>${esc(item.caption)}</p>${safeLink(item.imageUrl)?`<a href="${safeLink(item.imageUrl)}" target="_blank" rel="noopener">View photo</a>`:''}</div>`).join('')}</div></section>
 <section class="card"><h2>A letter from Wyatt</h2><div class="word">${esc(content.letter)}</div></section><section class="card"><h2>Anniversary extras</h2><div class="entries">${['videoUrl','playlistUrl'].map((k,i)=>`<div class="entry"><strong>${i?'Playlist':'Video message'}:</strong> ${safeLink(content[k])?`<a href="${safeLink(content[k])}" target="_blank" rel="noopener">Open</a>`:'Coming soon — Wyatt can customize this in private SQL.'}</div>`).join('')}<div class="entry"><strong>Date reveal:</strong> ${esc(content.dateReveal||'Wyatt will reveal the real-world date plan soon.')}</div></div><p class="spaced"><a class="button" href="#/0914-b">Check recovered archive for a hidden file</a></p></section>`;
}
function secretView() {
 if (!progress().vault_unlocked){shell('<div class="notice">This archived file does not exist in your clearance level yet.</div>','RESTRICTED ARCHIVE');return;}
 shell(`<section class="hero"><div class="label">RECOVERED AFTER VAULT OPENING</div><h1>📂 ARCHIVED FILE 0914-B</h1><p>The Federation has no record of who created this final message. A single password remains.</p></section><section class="card"><form id="secretForm"><label for="secretpass">Archived file password</label><div class="form-line"><input type="password" id="secretpass" name="secretpass" class="field" autocomplete="off" required placeholder="Password"><button class="primary">DECRYPT FILE</button></div></form><div id="secretContent"></div></section>`,'CLASSIFIED ANNEX');
}
function secretContent(content) {
 const el=document.getElementById('secretContent');if(!el)return;
 el.innerHTML=`<div class="divider"></div><div class="label">${esc(content.title)}</div><h2>Classification: ${esc(content.classification)} • ${esc(content.status)}</h2><div class="word">${esc(content.letter)}</div>`;
}
function classified(page) {
 if(page==='/classified')return shell(`<section class="card"><h1>Classified Annex</h1><p>The wolf signature pointed toward an old classification label. One line remains legible:</p><div class="data">A FAMILY IS NOT ALWAYS THE ONE YOU ARE BORN INTO.</div><a href="#/archive/ohana">Follow the OHANA archive reference</a></section>`,'HIDDEN ARCHIVE');
 return shell(`<section class="card"><h1>OHANA Archive</h1><p>Someone left this memo behind:</p><div class="data">CHOSEN. STAYS. BELONGING.</div><p class="muted">The word was a clue long before anyone understood why.</p><a href="#/board">Return to the investigation board</a></section>`,'HIDDEN ARCHIVE');
}
function adminView() {
 const p=snapshot?.profile;const done=p?.solved_days?.length||0;
 const failed=Object.values(p?.failed_attempts||{}).reduce((a,n)=>a+Number(n||0),0);
 const notes=snapshot?.notes||[];
 shell(`<div class="hero"><div class="label">CLEARANCE LEVEL: ADMIN // AGENT WYATT</div><h1>Wyatt's Command Center</h1><p>Monitor Agent Bunny's investigation. The dashboard refreshes from Supabase approximately every 12 seconds.</p></div>
 ${snapshot.test_mode?`<div class="notice"><strong>⚠ TEST MODE ACTIVE.</strong> Dates are unlocked for rehearsal. Turn it off and reset Bella's progress before the November 30 launch.</div>`:''}
 ${p?`<div class="three">${metric('Current day',`${Math.min(15,done+1)} / 15`)}${metric('Evidence collected',`${done} / 15`)}${metric('Failed attempts',failed)}${metric('Hints used',p.hints_used||0)}${metric('Active time',`${Math.floor((p.time_seconds||0)/60)} min`)}${metric('Vault',p.vault_unlocked?'OPEN':'SEALED')}</div>
 <section class="card spaced"><h2>Player telemetry</h2><div class="cols"><div><div class="label">Last login</div><p>${esc(short(p.last_login))}</p></div><div><div class="label">Last activity</div><p>${esc(short(p.last_seen))}</p></div><div><div class="label">Current page</div><p>${esc(p.current_page)}</p></div><div><div class="label">Secret file</div><p>${p.secret_unlocked?'Recovered':'Not yet'}</p></div></div><p><strong>Solved days:</strong> ${esc((p.solved_days||[]).join(', ')||'None')}</p></section>`:
 `<div class="notice">Agent Bunny has not signed in yet. Her progress will appear after the first player login.</div>`}
 <section class="card"><h2>Testing & recovery controls</h2><p class="muted small">Use testing mode to rehearse before the actual release. Reset her progress afterwards. Turning off test mode restores date locks, but does not reset any progress by itself.</p>
 <div class="actions"><button class="${snapshot.test_mode?'danger':'secondary'}" data-action="${snapshot.test_mode?'test-off':'test-on'}">${snapshot.test_mode?'DISABLE TEST MODE':'ENABLE TEST MODE'}</button><button class="danger" data-action="reset">RESET BELLA'S PROGRESS</button></div>
 <div class="divider"></div><h3>Manually complete a puzzle</h3><div class="form-line"><select class="field" id="overrideDay" aria-label="Day to mark complete">${DAYS.map(d=>`<option value="${d.id}">Day ${d.id}: ${esc(d.title)}</option>`).join('')}</select><button class="secondary" data-action="complete-day">Mark complete</button></div>
 </section><section class="card"><h2>Send emergency transmission</h2><form id="adminNoteForm"><label for="noteText">Message to Agent Bunny</label><textarea class="field" rows="3" maxlength="500" name="note" id="noteText" placeholder="Secure message from Agent Wyatt…" required></textarea><div class="actions spaced"><button class="primary">SEND NOTE</button></div></form><div class="entries spaced">${notes.slice(0,5).map(n=>`<div class="note">${esc(n.message)} <div class="small muted">${esc(short(n.created_at))}</div></div>`).join('')}</div></section>
 <section class="card"><h2>Live case activity</h2><div class="entries">${(snapshot.events||[]).map(e=>`<div class="entry"><strong>${esc(e.event_type)}</strong> · ${esc(e.detail)}<div class="small muted">${esc(short(e.created_at))}</div></div>`).join('')||'<p class="muted">No activity recorded yet.</p>'}</div></section>`,'ADMINISTRATOR');
}
function render() {
 if (!snapshot){authView();return;}
 const path=pagePath();
 if(snapshot.role==='admin'){adminView();return;}
 if(path==='/dashboard'||path==='/'){dashboard();return;}
 if(path==='/reports'){reports();return;}
 const reportMatch=path.match(/^\/reports\/(\d{1,2})$/);
 if(reportMatch){report(Number(reportMatch[1]));return;}
 if(path==='/archive'){archive();return;}
 if(path==='/board'){board();return;}
 if(path==='/suspects'){suspectPage();return;}
 if(path==='/vault'||path==='/vault/final'){vaultView();return;}
 if(path==='/0914-b'){secretView();return;}
 if(path==='/classified'||path==='/archive/ohana'){classified(path);return;}
 go('/dashboard');
}
async function submitLogin(form) {
 selectedRole=form.querySelector('[name="role"]:checked')?.value||'player';
 const password=form.elements.password.value;
 const email=selectedRole==='admin'?cfg.adminEmail:cfg.playerEmail;
 if (!email || !password) throw new Error('Choose a role and enter its password.');
 busy=true;authView();
 const {data,error}=await client.auth.signInWithPassword({email,password});
 busy=false;
 if(error) throw new Error('Wrong password or unavailable account. Check Supabase Authentication → Users.');
 await refresh(false);
 if(snapshot.role!==selectedRole){await signout();throw new Error('The password is not authorized for that access level. Check the role assignment SQL.');}
 if(snapshot.role==='player')await track('login');
 go(snapshot.role==='admin'?'/admin':'/dashboard');
 await refresh();
}
async function attemptForm(form){
 const id=form.id;
 if(id==='loginForm')return await submitLogin(form);
 if(id==='answerForm'){
  const day=Number(form.dataset.day);
  const result=await rpc('ohana_solve',{p_day:day,p_guess:form.elements.guess.value});
  setFlash(result.correct ? `Recovered evidence E-${String(day).padStart(2,'0')}! A new meta stamp has been added.` : `That access code is incorrect. Attempt ${result.attempts||1}.`,result.correct?'success':'error');
 } else if(id==='vaultForm'){
  const result=await rpc('ohana_vault',{p_key:form.elements.meta.value});
  if(result.ok){setFlash('VAULT UNLOCKED. Recovery confirmed.');await refresh();renderVaultContent(result.content);return;}
  setFlash(result.message||'Incorrect access phrase.','error');
 } else if(id==='secretForm'){
  const result=await rpc('ohana_secret',{p_password:form.elements.secretpass.value});
  if(result.ok){setFlash('CLASSIFIED FILE RECOVERED.');await refresh();secretContent(result.content);return;}
  setFlash(result.message||'Incorrect password.','error');
 } else if(id==='adminNoteForm'){
  await rpc('ohana_admin',{p_action:'note',p_message:form.elements.note.value});setFlash('Your transmission was sent to Agent Bunny.');
 }
 await refresh();
}
async function clickAction(button) {
 const action=button.dataset.action;
 if(action==='logout'){await signout();return;}
 if(action==='hint'){
  const d=Number(button.dataset.day),tier=Number(button.dataset.tier);
  const result=await rpc('ohana_hint',{p_day:d,p_tier:tier});
  cachedHints.set(d,(cachedHints.get(d)||'')+`<div class="hint">Hint ${tier}: ${esc(result.hint)}</div>`);
  await refresh(false);render();return;
 }
 if(action==='open-vault'){
  const result=await rpc('ohana_vault',{p_key:''});if(result.ok)renderVaultContent(result.content);return;
 }
 if(action==='reset' && !confirm('Permanently reset Agent Bunny\'s solved days, hints, vault, and notes? This cannot be undone.'))return;
 if(action==='test-on' && !confirm('Enable TEST MODE? Bella can access future days until it is turned off.'))return;
 if(action==='test-off' && !confirm('Disable TEST MODE? Future days will be locked by date again.'))return;
 if(action==='complete-day' && !confirm('Mark this day complete for Bella without solving it?'))return;
 let p_action=({reset:'reset','test-on':'test_on','test-off':'test_off','complete-day':'complete'})[action];
 if(!p_action)return;
 const args={p_action};
 if(action==='complete-day')args.p_day=Number(document.getElementById('overrideDay').value);
 await rpc('ohana_admin',args);setFlash(`Admin action completed: ${p_action.replaceAll('_',' ')}.`);await refresh();
}

root.addEventListener('submit',async ev=>{
 const form=ev.target.closest('form');if(!form)return;ev.preventDefault();
 if(busy)return;
 busy=true;const btn=form.querySelector('button[type="submit"],button:not([type])');if(btn)btn.disabled=true;
 try{await attemptForm(form);}catch(err){busy=false;setFlash(err.message,'error'); if(snapshot)render();else authView(err.message);}
 finally{busy=false;const b=form.querySelector('button');if(b)b.disabled=false;}
});
root.addEventListener('click',async ev=>{
 const button=ev.target.closest('[data-action]');if(!button||busy)return;
 busy=true;button.disabled=true;
 try{await clickAction(button);}catch(err){setFlash(err.message,'error');render();}
 finally{busy=false;button.disabled=false;}
});
root.addEventListener('change',ev=>{if(ev.target?.name==='role')selectedRole=ev.target.value;});
window.addEventListener('hashchange',()=>{render();if(snapshot?.role==='player')track(pagePath());});

async function start(){
 if(!cfg.url?.startsWith('https://')||!cfg.publishableKey||cfg.publishableKey.includes('PASTE_')){
  authView('Setup needed: edit WEBSITE/config.js on GitHub with your Supabase Project URL and publishable key.');return;
 }
 if(!window.supabase?.createClient){authView('Supabase browser script could not load. Check your internet connection and refresh.');return;}
 try{
  client=window.supabase.createClient(cfg.url,cfg.publishableKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}});
  const {data,error}=await client.auth.getSession();if(error)throw error;
  if(data?.session){try{await refresh(false);}catch{await client.auth.signOut();snapshot=null;}}
  render();
  if(snapshot?.role==='player')await track('login');
  // The admin view refreshes roughly live without needing Realtime table SELECT permissions.
  setInterval(async()=>{
   if(!snapshot||busy||document.hidden)return;
   const active=document.activeElement;
   if(active && ['INPUT','TEXTAREA','SELECT'].includes(active.tagName))return;
   try{await refresh();}catch(err){console.warn('Refresh:',err.message);}
  },12000);
  setInterval(()=>{if(snapshot?.role==='player'&&!document.hidden)track(pagePath());},30000);
 }catch(err){authView('Connection failed: '+err.message);}
}
start();
