import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });
    const { submission_id, status } = await req.json();
    if (!submission_id || !status) return Response.json({ error: 'submission_id e status são obrigatórios' }, { status: 400 });
    const submission = await base44.asServiceRole.entities.Submission.get(submission_id);
    if (!submission) return Response.json({ error: 'Submissão não encontrada' }, { status: 404 });
    const momEmail = submission.mom_email;
    if (!momEmail) return Response.json({ success: false, message: 'Mãe não possui e-mail cadastrado.' });
    const isApproved = status === 'aprovado' || status === 'publicado';
    const subject = isApproved ? '✅ Seu produto foi aprovado na Lojinha da Mamãe!' : '❌ Atualização sobre seu anúncio';
    const body = isApproved ? 'Olá, ' + submission.mom_name + '! Seu produto ' + submission.product_name + ' foi APROVADO! 🎉' : 'Olá, ' + submission.mom_name + '! Infelizmente seu anúncio ' + submission.product_name + ' não foi aprovado desta vez.';
    await base44.asServiceRole.integrations.Core.SendEmail({ to: momEmail, subject, body });
    return Response.json({ success: true, message: 'E-mail enviado para ' + momEmail });
  } catch (error) { return Response.json({ error: error.message }, { status: 500 }); }
});