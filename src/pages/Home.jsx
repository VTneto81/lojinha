import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/store/ProductCard";
import CartDrawer from "@/components/store/CartDrawer";
import { useCart } from "@/lib/useCart";
import { Input } from "@/components/ui/input";
import { Search, LogIn } from "lucide-react";
import FeaturedCarousel from "@/components/store/FeaturedCarousel";

const CATEGORIES = ["todos", "roupas", "brinquedos", "acessórios", "outros"];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [partnerStats, setPartnerStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("todos");
  const [activePartner, setActivePartner] = useState("todos");
  const { addToCart } = useCart();
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    Promise.all([
      base44.entities.Product.filter({ is_active: true }),
      base44.entities.Submission.filter({ status: "publicado" })
    ]).then(([prods, subs]) => {
      setProducts(prods);
      setSubmissions(subs);
      const stats = {};
      subs.forEach(s => { const key = s.mom_instagram; stats[key] = (stats[key] || 0) + 1; });
      setPartnerStats(stats);
      setLoading(false);
    });
  }, []);

  const partners = Array.from(new Set(
    submissions.filter(s => s.status === "publicado").map(s => ({ instagram: s.mom_instagram, name: s.mom_name })).filter(p => p.instagram)
  )).sort((a, b) => a.name.localeCompare(b.name));

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "todos" || p.category === activeCategory;
    const matchPartner = activePartner === "todos" || submissions.find(s => s.status === "publicado" && s.product_name === p.name && s.mom_instagram === activePartner);
    return matchSearch && matchCat && matchPartner;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <section className="bg-gradient-to-br from-blue-600 via-teal-500 to-cyan-400 text-white py-16 px-4 text-center">
        <div className="text-6xl mb-4">🧸</div>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-3 drop-shadow">Lojinha da Mamãe</h1>
        <p className="text-lg md:text-xl opacity-90 max-w-md mx-auto mb-6">Roupinhas e brinquedos cheios de amor para os seus pequenos! 🌟</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
          <Link to="/portal-parceira" className="flex items-center justify-center gap-2 bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-full font-extrabold shadow-lg transition-all transform hover:scale-105">
            <LogIn className="w-5 h-5" /> Área da Parceira
          </Link>
          <Link to="/enviar-anuncio" className="flex items-center justify-center gap-2 bg-yellow-300 text-gray-800 hover:bg-yellow-400 px-6 py-3 rounded-full font-extrabold shadow-lg transition-all transform hover:scale-105">
            ✨ Enviar Produto
          </Link>
        </div>
      </section>
      <FeaturedCarousel products={products} />
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-4 h-4 text-pink-400" />
            <Input placeholder="Buscar produtos..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 border-slate-200 focus:ring-blue-400" />
          </div>
        </div>
        <div className="space-y-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-1.5 rounded-full font-semibold text-sm transition-all ${activeCategory === cat ? "bg-blue-600 text-white shadow" : "bg-white text-blue-600 border border-blue-200 hover:bg-blue-50"}`}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
          {partners.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setActivePartner("todos")} className={`px-4 py-1.5 rounded-full font-semibold text-sm transition-all ${activePartner === "todos" ? "bg-teal-600 text-white shadow" : "bg-white text-teal-600 border border-teal-200 hover:bg-teal-50"}`}>
                👥 Todas as parceiras
              </button>
              {partners.map(p => (
                <button key={p.instagram} onClick={() => setActivePartner(p.instagram)} className={`px-4 py-1.5 rounded-full font-semibold text-sm transition-all flex items-center gap-1 ${activePartner === p.instagram ? "bg-teal-600 text-white shadow" : "bg-white text-teal-600 border border-teal-200 hover:bg-teal-50"}`}>
                  ⭐ {p.name}
                </button>
              ))}
            </div>
          )}
        </div>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array(8).fill(0).map((_, i) => <div key={i} className="bg-white rounded-2xl h-64 animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-pink-400"><div className="text-5xl mb-3">🧸</div><p className="text-lg font-semibold">Nenhum produto encontrado</p></div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map(product => <ProductCard key={product.id} product={product} onAddToCart={addToCart} isPremiumPartner={partnerStats[product.mom_instagram] >= 3} />)}
          </div>
        )}
      </section>
      <CartDrawer />
      <Footer />
    </div>
  );
}