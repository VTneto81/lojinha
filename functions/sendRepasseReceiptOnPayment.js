import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import { jsPDF } from 'npm:jspdf@4.0.0';
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { event, data } = await req.json();
    if (!data || data.status !== 'pago') return Response.json({ success: true, message: 'Repasse não foi marcado como pago, ignorando' });
    const repasse = data;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.setFillColor(52, 211, 153); doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setTextColor(255,255,255); doc.setFontSize(20); doc.setFont('helvetica','bold');
    doc.text('Lojinha da Mae - Comprovante de Repasse', pageWidth / 2, 22, { align: 'center' });
    doc.setTextColor(0,0,0); doc.setFontSize(11); let y = 55;
    doc.text('Parceira: ' + repasse.mom_name, 20, y); y += 8;
    doc.text('Produto: ' + repasse.product_name, 20, y); y += 8;
    const repF = Number(repasse.repasse_value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    doc.setFont('helvetica','bold'); doc.setTextColor(16,185,129);
    doc.text('VALOR REPASSADO: ' + repF, 20, y);
    try { await base44.asServiceRole.entities.TransactionLog.create({ order_id: repasse.order_id || '', repasse_id: event?.entity_id || '', event_type: 'notification_sent', status: 'success', details: { partner: repasse.mom_name, amount: repasse.repasse_value, product: repasse.product_name } }); } catch (e) { }
    return Response.json({ success: true, message: 'Comprovante gerado para ' + repasse.mom_name, repasse_id: event?.entity_id });
  } catch (error) { return Response.json({ success: false, error: error.message }, { status: 500 }); }
});