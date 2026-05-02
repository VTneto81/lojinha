import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const allRepasses = await base44.asServiceRole.entities.Repasse.list('-created_date', 1000);
    const pendingRepasses = allRepasses.filter(r => (r.status === 'pendente' || r.status === 'a_pagar') && new Date(r.created_date) <= thirtyDaysAgo);
    if (pendingRepasses.length === 0) return Response.json({ success: true, message: 'Nenhum repasse pendente há mais de 30 dias', notified: 0 });
    return Response.json({ success: true, message: pendingRepasses.length + ' repasses pendentes encontrados', notified: pendingRepasses.length });
  } catch (error) { return Response.json({ success: false, error: error.message }, { status: 500 }); }
});