import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
Deno.serve(async (req) => {
  try {
    const payload = await req.json();
    const N8N_WEBHOOK_URL = Deno.env.get('N8N_WEBHOOK_URL');
    if (!N8N_WEBHOOK_URL) return Response.json({ error: 'N8N_WEBHOOK_URL não configurada', success: false }, { status: 500 });
    const { event, data, old_data } = payload;
    const n8nPayload = { event_type: event?.type || 'unknown', entity_type: event?.entity_name || 'Order', entity_id: event?.entity_id || data?.id, timestamp: new Date().toISOString(), data, old_data: old_data || null };
    const response = await fetch(N8N_WEBHOOK_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(n8nPayload) });
    if (!response.ok) throw new Error('N8N retornou: ' + response.status);
    const result = await response.json();
    return Response.json({ success: true, n8n_response: result, message: 'Dados enviados para N8N com sucesso' });
  } catch (error) { return Response.json({ error: error.message, success: false }, { status: 500 }); }
});