import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    const { order_id } = await req.json();
    if (!order_id) return Response.json({ error: 'order_id é obrigatório' }, { status: 400 });
    const order = await base44.asServiceRole.entities.Order.filter({ id: order_id }, "-created_date", 1);
    if (!order || order.length === 0) return Response.json({ error: 'Pedido não encontrado' }, { status: 404 });
    const orderData = order[0];
    if (orderData.status !== "entregue") return Response.json({ message: "Pedido não está em status 'entregue'", status: orderData.status });
    const [products, submissions] = await Promise.all([
      base44.asServiceRole.entities.Product.list("-created_date", 500),
      base44.asServiceRole.entities.Submission.filter({ status: "publicado" })
    ]);
    const repasses = [];
    for (const item of orderData.items || []) {
      const product = products.find(p => p.id === item.product_id);
      if (!product) continue;
      const submission = submissions.find(s => s.product_name === item.product_name);
      if (!submission) continue;
      const commissionPercent = 20;
      const totalSale = item.price * item.quantity;
      const repasseValue = totalSale * (1 - commissionPercent / 100);
      const existingRepasse = await base44.asServiceRole.entities.Repasse.filter({ order_id, product_name: item.product_name });
      if (existingRepasse && existingRepasse.length > 0) continue;
      const repasse = await base44.asServiceRole.entities.Repasse.create({ mom_instagram: submission.mom_instagram, mom_name: submission.mom_name, mom_whatsapp: submission.mom_whatsapp || "", submission_id: submission.id, product_name: item.product_name, product_price: item.price, commission_percent: commissionPercent, repasse_value: repasseValue, status: "a_pagar", order_id, notes: `Venda de ${item.quantity} unidade(s) — Pedido #${order_id.slice(-6).toUpperCase()}` });
      repasses.push(repasse);
    }
    return Response.json({ success: true, order_id, repasses_created: repasses.length, repasses });
  } catch (error) { return Response.json({ error: error.message }, { status: 500 }); }
});