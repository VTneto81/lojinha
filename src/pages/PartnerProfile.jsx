import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/store/ProductCard";
import { Instagram, Phone, ExternalLink, ArrowLeft, Package } from "lucide-react";

export default function PartnerProfile() {
  const { instagram } = useParams();
  const [partner, setPartner] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Submission.list("-created_date", 500).then(subs => {
      const handle = decodeURIComponent(instagram).replace("@", "");
      const herSubs = subs.filter(s => s.mom_instagram?.replace("@", "") === handle);
      if (herSubs.length > 0) {
        const s = herSubs[0];
        setPartner({ name: s.mom_name, instagram: s.mom_instagram, whatsapp: s.mom_whatsapp, email: s.mom_email, social_link: s.social_link, totalSubmissions: herSubs.length, publishedCount: herSubs.filter(x => x.status === "publicado").length });
      }
    });
    base44.entities.Product.filter({ is_active: true }).then(allProducts => {
      base44.entities.Submission.filter({ status: "publicado" }).then(pubSubs => {
        const handle = decodeURIComponent(instagram).replace("@", "");
        const herPubSubs = pubSubs.filter(s => s.mom_instagram?.replace("@", "") === handle);
        const herProductNames = new Set(herPubSubs.map(s => s.product_name?.toLowerCase()));
        setProducts(allProducts.filter(p => herProductNames.has(p.name?.toLowerCase())));
        setLoading(false);
      });
    });
  }, [instagram]);

  if (loading) return (
    <div className="min-h-screen bg-slate-50"><Header />
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="h-40 bg-white rounded-3xl animate-pulse mb-6" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">{Array(6).fill(0).map((_, i) => <div key={i} className="h-64 bg-white rounded-2xl animate-pulse" />)}</div>
      </div><Footer /></div>
  );

  if (!partner) return (
    <div className="min-h-screen bg-slate-50"><Header />
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-2xl font-bold text-gray-700 mb-2">Parceira não encontrada</h1>
        <Link to="/" className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold">Voltar à loja</Link>
      </div><Footer /></div>
  );

  const igHandle = partner.instagram?.replace("@", "");

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="bg-gradient-to-br from-blue-600 via-teal-500 to-cyan-400 pt-12 pb-24 px-4 text-center text-white">
        <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-4xl mx-auto mb-4 shadow-lg">👩</div>
        <h1 className="text-3xl font-extrabold drop-shadow">{partner.name}</h1>
        {partner.instagram && <p className="text-white/80 text-lg mt-1">{partner.instagram}</p>}
      </div>
      <div className="max-w-3xl mx-auto px-4 -mt-10 mb-8">
        <div className="bg-white rounded-3xl shadow-lg p-6 border border-slate-100">
          <div className="flex flex-wrap gap-3 justify-center mb-5">
            {partner.instagram && <a href={`https://instagram.com/${igHandle}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 bg-pink-50 text-pink-600 hover:bg-pink-100 border border-pink-200 px-4 py-2 rounded-full text-sm font-semibold transition-colors"><Instagram className="w-4 h-4" /> {partner.instagram}</a>}
            {partner.whatsapp && <a href={`https://wa.me/55${partner.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 px-4 py-2 rounded-full text-sm font-semibold transition-colors"><Phone className="w-4 h-4" /> Chamar no WhatsApp</a>}
            {partner.social_link && <a href={partner.social_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 bg-teal-50 text-teal-600 hover:bg-teal-100 border border-teal-200 px-4 py-2 rounded-full text-sm font-semibold transition-colors"><ExternalLink className="w-4 h-4" /> Ver perfil</a>}
          </div>
          <div className="flex justify-center gap-8 text-center">
            <div><p className="text-2xl font-extrabold text-blue-600">{partner.totalSubmissions}</p><p className="text-xs text-gray-400 mt-0.5">Anúncios enviados</p></div>
            <div className="w-px bg-slate-100" />
            <div><p className="text-2xl font-extrabold text-green-600">{partner.publishedCount}</p><p className="text-xs text-gray-400 mt-0.5">Publicados</p></div>
            <div className="w-px bg-slate-100" />
            <div><p className="text-2xl font-extrabold text-teal-600">{products.length}</p><p className="text-xs text-gray-400 mt-0.5">Na loja agora</p></div>
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 pb-12">
        <h2 className="text-xl font-extrabold text-gray-800 mb-5 flex items-center gap-2"><Package className="w-5 h-5 text-blue-600" /> Produtos de {partner.name}</h2>
        {products.length === 0 ? (
          <div className="text-center py-16 text-gray-400"><div className="text-5xl mb-3">📦</div><p>Nenhum produto publicado ainda</p></div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">{products.map(p => <ProductCard key={p.id} product={p} />)}</div>
        )}
        <div className="mt-10 text-center">
          <Link to="/" className="flex items-center justify-center gap-2 text-blue-600 hover:underline font-semibold"><ArrowLeft className="w-4 h-4" /> Ver todos os produtos da loja</Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}