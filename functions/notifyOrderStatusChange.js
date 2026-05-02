import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { event, data, old_data } = await req.json();
    if (!data || event.type !== 'update') return Response.json({ success: true });
    const newStatus = data.status;
    const oldStatus = old_data?.status;
    if (!newStatus || newStatus === oldStatus) return Response.json({ success: true, message: 'Status não mudou' });
    await base44.asServiceRole.entities.TransactionLog.create({ order_id: data.id, event_type: 'notification_sent', status: 'success', details: { old_status: oldStatus, new_status: newStatus, customer: data.customer_name } }).catch(() => null);
    return Response.json({ success: true, message: 'Status change logged: ' + oldStatus + ' -> ' + newStatus });
  } catch (error) { return Response.json({ error: error.message, success: false }, { status: 500 }); }
});