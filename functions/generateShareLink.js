import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
Deno.serve(async (req) => {
  try {
    const { product_id, product_name, product_price, product_image } = await req.json();
    if (!product_id || !product_name) return Response.json({ error: 'Parâmetros obrigatórios faltando' }, { status: 400 });
    const appUrl = new URL(req.url).origin;
    const productUrl = appUrl + '/produto/' + product_id;
    const caption = '✨ Olha esse produto lindo na *Lojinha da Mamãe*! 🧸\n\n*' + product_name + '*\n💰 R$ ' + Number(product_price || 0).toFixed(2).replace('.', ',') + '\n\n🛍️ Confira: ' + productUrl + '\n\n#LojinhaDaMamae #Infantil #MaeEmpreendedora';
    return Response.json({ caption, productUrl, og_title: product_name, og_image: product_image || '' });
  } catch (error) { return Response.json({ error: error.message }, { status: 500 }); }
});