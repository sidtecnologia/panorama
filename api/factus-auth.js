const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));
export default async function (req, res) {
  const FACTUS_BASE = process.env.FACTUS_BASE_URL;
  const CLIENT_ID = process.env.FACTUS_CLIENT_ID;
  const CLIENT_SECRET = process.env.FACTUS_CLIENT_SECRET;
  if (!FACTUS_BASE || !CLIENT_ID || !CLIENT_SECRET) return res.status(500).json({ error: 'missing_config' });
  try {
    const r = await fetch(`${FACTUS_BASE}/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET })
    });
    const json = await r.json();
    return res.status(r.ok ? 200 : 400).json(json);
  } catch (e) {
    return res.status(500).json({ error: 'request_failed', detail: String(e) });
  }
}