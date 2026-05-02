import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { event, data } = await req.json();
    if (!data || data.status !== 'confirmado') return Response.json({ success: true, message: 'Pedido não confirmado, ignorando' });
    const order = data;
    const ADMIN_WHATSAPP = Deno.env.get('ADMIN_WHATSAPP_NUMBER') || '';
    if (!ADMIN_WHATSAPP) return Response.json({ success: true, message: 'WhatsApp do admin não configurado' });
    const itemsText = (order.items || []).map(i => '• ' + i.product_name + ' x' + i.quantity).join('\n');
    const totalFormatted = Number(order.total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const msg = '🎉 *NOVO PEDIDO CONFIRMADO!*\n\n📦 *Cliente:* ' + order.customer_name + '\n📱 *Tel:* ' + order.customer_phone + '\n\n' + itemsText + '\n\n💰 *Total:* ' + totalFormatted;
    const n8nWebhook = Deno.env.get('N8N_WEBHOOK_URL');
    if (n8nWebhook) { await fetch(n8nWebhook, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ event: 'admin_notification', type: 'new_order', phone: ADMIN_WHATSAPP.replace(/\D/g, ''), message: msg }) }); }
    return Response.json({ success: true, message: 'Alerta enviado' });
  } catch (error) { return Response.json({ success: false, error: error.message }, { status: 500 }); }
});