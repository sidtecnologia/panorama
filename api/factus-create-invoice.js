const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));
export default async function (req, res) {
  const FACTUS_BASE = process.env.FACTUS_BASE_URL;
  const CLIENT_ID = process.env.FACTUS_CLIENT_ID;
  const CLIENT_SECRET = process.env.FACTUS_CLIENT_SECRET;
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });
  const payload = req.body;
  if (!payload || !payload.order) return res.status(400).json({ error: 'missing_order' });
  try {
    const authRes = await fetch(`${FACTUS_BASE}/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET })
    });
    const authJson = await authRes.json();
    const token = authJson?.access_token;
    if (!token) return res.status(500).json({ error: 'no_token', auth: authJson });
    const body = {
      body: {
        document: {
          tipo_documento: payload.order.document_type || '13',
          numero_documento: payload.order.document_number || '',
          razon_social: payload.order.customer_name,
          email: payload.order.email || '',
          telefono: payload.order.phone || ''
        },
        items: (payload.order.order_items || []).map(it => ({
          descripcion: it.name,
          cantidad: it.qty,
          unidad: 'UN',
          valor_unitario: it.price,
          tipo_impuesto: 'IVA',
          porcentaje_impuesto: 19
        })),
        pagos: [
          {
            forma_pago: payload.order.payment_method || 'Efectivo',
            total: payload.order.total_amount || 0
          }
        ],
        referencia: payload.order.id || null
      }
    };
    const r = await fetch(`${FACTUS_BASE}/crear-validar-factura`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(body)
    });
    const json = await r.json();
    return res.status(r.ok ? 200 : 400).json({ success: r.ok, result: json });
  } catch (e) {
    return res.status(500).json({ error: 'request_failed', detail: String(e) });
  }
}