import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    const { order_id } = await req.json();
    if (!order_id) return Response.json({ error: 'order_id é obrigatório' }, { status: 400 });
    const orders = await base44.asServiceRole.entities.Order.filter({ id: order_id });
    if (!orders || orders.length === 0) return Response.json({ error: 'Pedido não encontrado' }, { status: 404 });
    const order = orders[0];
    if (!order.customer_email) return Response.json({ message: 'Nenhum email cadastrado para o cliente', order_id });
    if (order.status !== 'confirmado') return Response.json({ message: "Pedido não está em status 'confirmado'", status: order.status });
    const itemsHtml = (order.items || []).map(item => '<tr><td>' + item.product_name + '</td><td>x' + item.quantity + '</td><td>R$ ' + (item.price * item.quantity).toFixed(2).replace('.', ',') + '</td></tr>').join('');
    const emailBody = '<h1>Pedido Confirmado!</h1><p>Olá ' + order.customer_name + ', seu pedido foi confirmado!</p><table>' + itemsHtml + '</table><p><strong>Total: R$ ' + order.total.toFixed(2).replace('.', ',') + '</strong></p>';
    await base44.integrations.Core.SendEmail({ to: order.customer_email, subject: '✅ Pedido Confirmado #' + order.id?.slice(-6).toUpperCase() + ' - Lojinha da Mamãe', body: emailBody, from_name: 'Lojinha da Mamãe' });
    return Response.json({ success: true, message: 'Email enviado para ' + order.customer_email, order_id });
  } catch (error) { return Response.json({ error: error.message }, { status: 500 }); }
});