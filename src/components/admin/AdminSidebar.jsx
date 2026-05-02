import { Package, ShoppingBag, Share2, Users, Banknote, FileText, DollarSign, BarChart3, UserCheck, Archive, Home } from "lucide-react";
const SECTIONS = [
  { title: "Visão Geral", items: [{ id: "inicio", label: "Início", icon: Home }] },
  { title: "Gerenciamento", items: [{ id: "products", label: "Produtos", icon: Package }, { id: "orders", label: "Pedidos", icon: ShoppingBag }, { id: "submissions", label: "Anúncios", icon: Share2 }] },
  { title: "Parceiras", items: [{ id: "partners", label: "Todas as Parceiras", icon: Users }, { id: "partnerDetails", label: "Detalhes Parceira", icon: UserCheck }, { id: "social", label: "Redes Sociais", icon: Share2 }] },
  { title: "Financeiro", items: [{ id: "repasses", label: "Repasses", icon: Banknote }, { id: "repasseReport", label: "Relatório", icon: FileText }, { id: "monthlyClosing", label: "Fechamento", icon: BarChart3 }, { id: "financial", label: "Gestão Financeira", icon: DollarSign }, { id: "archive", label: "Arquivo", icon: Archive }] }
];
export default function AdminSidebar({ activeTab, onTabChange }) {
  return (
    <aside className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white h-screen sticky top-0 overflow-y-auto">
      <div className="p-6 border-b border-slate-700"><h2 className="text-xl font-extrabold">Admin</h2><p className="text-xs text-slate-400 mt-1">Lojinha da Mamãe</p></div>
      <nav className="p-4 space-y-6">
        {SECTIONS.map((section) => (
          <div key={section.title}>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">{section.title}</p>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button key={item.id} onClick={() => onTabChange(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${isActive ? "bg-blue-600 text-white shadow-lg" : "text-slate-300 hover:bg-slate-700 hover:text-white"}`}>
                    <Icon className="w-4 h-4 flex-shrink-0" /><span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}