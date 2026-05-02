import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
Deno.serve(async (req) => {
  if (req.method !== 'POST') return Response.json({ error: 'Método não permitido' }, { status: 405 });
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json();
    if (!payload.customer_name || !payload.customer_phone || !payload.items?.length) return Response.json({ error: 'Dados incompletos' }, { status: 400 });
    const total = payload.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const order = await base44.entities.Order.create({ customer_name: payload.customer_name, customer_email: payload.customer_email || '', customer_phone: payload.customer_phone, customer_cpf: payload.customer_cpf || '', customer_address: payload.customer_address || '', customer_city: payload.customer_city || '', items: payload.items, total, status: 'novo', notes: payload.notes || '' });
    await base44.asServiceRole.entities.TransactionLog.create({ order_id: order.id, event_type: 'order_created', status: 'success', details: { customer: payload.customer_name, total, items_count: payload.items.length } }).catch(() => null);
    return Response.json({ success: true, order_id: order.id, total, message: 'Pedido processado com sucesso' }, { status: 201 });
  } catch (error) { return Response.json({ error: error.message, success: false }, { status: 500 }); }
});