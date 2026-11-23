// Haalt de laatste AIS-gegevens van de schepen op via AISstream.io en schrijft tracking.json.
// Draait in GitHub Actions (Node 22, ingebouwde WebSocket). De API-sleutel komt uit het secret AISSTREAM_API_KEY.
import fs from 'node:fs';

const KEY = process.env.AISSTREAM_API_KEY;
if (!KEY) { console.error('AISSTREAM_API_KEY ontbreekt (repository secret).'); process.exit(1); }

const OUT = process.env.OUT_FILE || 'tracking.json';
const PREV = process.env.PREV_FILE || 'prev.json';
const LISTEN_MS = Number(process.env.LISTEN_SECONDS || 300) * 1000;

const planning = JSON.parse(fs.readFileSync('planning.json', 'utf8'));
const ships = (planning.ships || []).filter(s => /^\d{9}$/.test(String(s.mmsi || '')));
const names = Object.fromEntries(ships.map(s => [String(s.mmsi), s.name]));
const mmsis = Object.keys(names).slice(0, 50);
console.log(`Volgt ${mmsis.length} schepen:`, mmsis.map(m => `${names[m]} (${m})`).join(', '));

let prev = {};
try { prev = JSON.parse(fs.readFileSync(PREV, 'utf8')).vessels || {}; } catch (e) {}
const vessels = {};
for (const m of mmsis) vessels[m] = { ...(prev[m] || {}), mmsi: m, name: names[m] };

const seenPos = new Set(), seenStatic = new Set();
let count = 0, fatal = false;

const parseTime = s => {
  const m = /^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})/.exec(String(s || ''));
  return m ? `${m[1]}T${m[2]}Z` : new Date().toISOString();
};
const okNum = (v, bad) => (typeof v === 'number' && !Number.isNaN(v) && v !== bad) ? v : null;

function etaToISO(e) {
  if (!e || !e.Month || !e.Day) return null;
  const now = new Date();
  const hour = e.Hour >= 24 ? 0 : (e.Hour || 0), min = e.Minute >= 60 ? 0 : (e.Minute || 0);
  let d = new Date(Date.UTC(now.getUTCFullYear(), e.Month - 1, e.Day, hour, min));
  if (d < new Date(now - 60 * 86400e3)) d = new Date(Date.UTC(now.getUTCFullYear() + 1, e.Month - 1, e.Day, hour, min));
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

function handle(msg) {
  if (msg.error) { console.error('AISstream:', msg.error); fatal = true; return; }
  const meta = msg.MetaData || {};
  const m = String(meta.MMSI || '');
  const v = vessels[m];
  if (!v) return;
  count++;
  const t = msg.MessageType, body = (msg.Message || {})[t] || {};
  if (t === 'PositionReport' || t === 'StandardClassBPositionReport' || t === 'ExtendedClassBPositionReport') {
    const lat = okNum(body.Latitude ?? meta.latitude, 91), lon = okNum(body.Longitude ?? meta.longitude, 181);
    if (lat == null || lon == null) return;
    v.lat = lat; v.lon = lon;
    v.sog = okNum(body.Sog, 102.3);
    v.cog = okNum(body.Cog, 360);
    v.heading = okNum(body.TrueHeading, 511);
    if (typeof body.NavigationalStatus === 'number') v.navStatus = body.NavigationalStatus;
    v.positionAt = parseTime(meta.time_utc);
    seenPos.add(m);
  } else if (t === 'ShipStaticData') {
    v.destination = String(body.Destination || '').replace(/@+/g, '').trim();
    v.eta = etaToISO(body.Eta);
    if (body.ImoNumber) v.imo = body.ImoNumber;
    v.staticAt = parseTime(meta.time_utc);
    seenStatic.add(m);
  }
}

const allSeen = () => seenPos.size === mmsis.length && seenStatic.size === mmsis.length;

function listenOnce(msLeft) {
  return new Promise(resolve => {
    const ws = new WebSocket(process.env.AIS_URL || 'wss://stream.aisstream.io/v0/stream');
    let done = false;
    const finish = () => { if (done) return; done = true; clearTimeout(timer); try { ws.close(); } catch (e) {} resolve(); };
    const timer = setTimeout(finish, msLeft);
    ws.onopen = () => ws.send(JSON.stringify({
      APIKey: KEY,
      BoundingBoxes: [[[-90, -180], [90, 180]]],
      FiltersShipMMSI: mmsis,
      FilterMessageTypes: ['PositionReport', 'StandardClassBPositionReport', 'ShipStaticData']
    }));
    ws.onmessage = async ev => {
      let text = ev.data;
      if (typeof text !== 'string') text = (text instanceof Blob) ? await text.text() : Buffer.from(text).toString('utf8');
      let msg; try { msg = JSON.parse(text); } catch (e) { return; }
      handle(msg);
      if (fatal || allSeen()) finish();
    };
    ws.onerror = e => { console.error('WebSocket-fout:', (e && e.message) || ''); finish(); };
    ws.onclose = finish;
  });
}

// Blijf luisteren tot de tijd om is; sluit AISstream de verbinding eerder, maak dan opnieuw verbinding.
const deadline = Date.now() + LISTEN_MS;
let attempts = 0;
while (mmsis.length && !fatal && !allSeen() && Date.now() < deadline - 5000 && attempts < 20) {
  attempts++;
  await listenOnce(deadline - Date.now());
  if (fatal || allSeen() || Date.now() >= deadline - 5000) break;
  console.log('Verbinding gesloten voor het einde van het luistervenster; opnieuw verbinden...');
  await new Promise(r => setTimeout(r, 3000));
}

console.log(`Verbindingen: ${attempts}. Berichten ontvangen: ${count}. Posities: ${seenPos.size}/${mmsis.length}, statische gegevens: ${seenStatic.size}/${mmsis.length}.`);
if (fatal) process.exit(1);

fs.writeFileSync(OUT, JSON.stringify({
  updatedAt: new Date().toISOString(),
  listenSeconds: LISTEN_MS / 1000,
  messages: count,
  vessels
}, null, 2) + '\n');
