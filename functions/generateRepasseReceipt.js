import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import { jsPDF } from 'npm:jspdf@4.0.0';
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Acesso restrito' }, { status: 403 });
    const { repasse_id } = await req.json();
    if (!repasse_id) return Response.json({ error: 'repasse_id é obrigatório' }, { status: 400 });
    const repasse = await base44.asServiceRole.entities.Repasse.read(repasse_id);
    if (!repasse) return Response.json({ error: 'Repasse não encontrado' }, { status: 404 });
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFillColor(52, 211, 153); doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setTextColor(255, 255, 255); doc.setFontSize(24); doc.setFont('helvetica', 'bold');
    doc.text('Lojinha da Mae', pageWidth / 2, 15, { align: 'center' });
    doc.setFontSize(12); doc.setFont('helvetica', 'normal');
    doc.text('Comprovante de Repasse', pageWidth / 2, 28, { align: 'center' });
    doc.setTextColor(0,0,0); let yPos = 50;
    doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.text('INFORMACOES DA PARCEIRA', 20, yPos); yPos += 10;
    doc.setFont('helvetica', 'normal'); doc.setFontSize(10);
    doc.text('Nome: ' + repasse.mom_name, 20, yPos); yPos += 7;
    doc.text('Instagram: @' + repasse.mom_instagram, 20, yPos); yPos += 7;
    if (repasse.mom_whatsapp) { doc.text('WhatsApp: ' + repasse.mom_whatsapp, 20, yPos); yPos += 7; }
    yPos += 5; doc.setFont('helvetica', 'bold');
    doc.text('DETALHES DO PRODUTO', 20, yPos); yPos += 10;
    doc.setFont('helvetica', 'normal'); doc.text('Produto: ' + repasse.product_name, 20, yPos); yPos += 12;
    doc.setFont('helvetica', 'bold'); doc.text('CALCULO FINANCEIRO', 20, yPos); yPos += 10;
    doc.setFont('helvetica', 'normal');
    const priceF = Number(repasse.product_price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const commF = Number(repasse.product_price * (repasse.commission_percent / 100)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const repF = Number(repasse.repasse_value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    doc.text('Valor de Venda: ' + priceF, 20, yPos); yPos += 7;
    doc.text('Comissao da Loja (' + repasse.commission_percent + '%): ' + commF, 20, yPos); yPos += 10;
    doc.setFont('helvetica', 'bold'); doc.setFontSize(12); doc.setTextColor(16,185,129);
    doc.text('VALOR A REPASSAR: ' + repF, 20, yPos); yPos += 15;
    doc.setTextColor(0,0,0); doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.text('PAGAMENTO', 20, yPos); yPos += 10;
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9);
    if (repasse.pix_key) { doc.text('Chave PIX: ' + repasse.pix_key, 20, yPos); yPos += 7; }
    const paidDate = repasse.paid_at ? new Date(repasse.paid_at).toLocaleDateString('pt-BR') : '-';
    doc.text('Data de Pagamento: ' + paidDate, 20, yPos); yPos += 7;
    doc.text('Status: ' + (repasse.status === 'pago' ? 'PAGO' : 'PENDENTE'), 20, yPos);
    if (repasse.notes) { yPos += 10; doc.setFont('helvetica', 'bold'); doc.text('OBSERVACOES', 20, yPos); yPos += 7; doc.setFont('helvetica', 'normal'); doc.text(doc.splitTextToSize(repasse.notes, 160), 20, yPos); }
    doc.setFontSize(8); doc.setTextColor(128,128,128);
    const footerY = pageHeight - 20;
    doc.text('Comprovante gerado em ' + new Date().toLocaleDateString('pt-BR'), pageWidth / 2, footerY, { align: 'center' });
    doc.text('Lojinha da Mae - Marketplace Infantil Colaborativo', pageWidth / 2, footerY + 5, { align: 'center' });
    const pdfBytes = doc.output('arraybuffer');
    return new Response(pdfBytes, { status: 200, headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename="comprovante-repasse.pdf"' } });
  } catch (error) { return Response.json({ error: error.message }, { status: 500 }); }
});