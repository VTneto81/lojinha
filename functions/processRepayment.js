import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
Deno.serve(async (req) => {
  if (req.method !== 'POST') return Response.json({ error: 'Método não permitido' }, { status: 405 });
  try {
    const base44 = createClientFromRequest(req);
    const { repasse_id, payment_method, transaction_id } = await req.json();
    if (!repasse_id) return Response.json({ error: 'repasse_id obrigatório' }, { status: 400 });
    const repasses = await base44.asServiceRole.entities.Repasse.filter({ id: repasse_id });
    const repasse = repasses[0];
    if (!repasse) return Response.json({ error: 'Repasse não encontrado' }, { status: 404 });
    await base44.asServiceRole.entities.Repasse.update(repasse_id, { status: 'pago', paid_at: new Date().toISOString() });
    await base44.asServiceRole.entities.TransactionLog.create({ repasse_id, order_id: repasse.order_id, event_type: 'payment_confirmed', status: 'success', details: { partner: repasse.mom_name, amount: repasse.repasse_value, payment_method: payment_method || 'pix', transaction_id: transaction_id || null } }).catch(() => null);
    return Response.json({ success: true, repasse_id, status: 'pago', message: 'Pagamento confirmado' });
  } catch (error) { return Response.json({ error: error.message, success: false }, { status: 500 }); }
});