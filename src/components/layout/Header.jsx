import { Link } from "react-router-dom";
import { ShoppingCart, Store, Settings } from "lucide-react";
import { useCart } from "@/lib/useCart";
import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import CartDrawer from "@/components/store/CartDrawer";

export default function Header() {
  const { cartCount } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [user, setUser] = useState(null);
  useEffect(() => { base44.auth.me().then(setUser).catch(() => null); }, []);
  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🧸</span>
            <div>
              <span className="text-xl font-extrabold text-blue-600">Lojinha</span>
              <span className="text-xl font-extrabold text-teal-500"> da Mamãe</span>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            {user?.role === "admin" && (
              <Link to="/admin" className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-3 py-1.5 rounded-full transition-colors">
                <Settings className="w-3.5 h-3.5" /> Painel Admin
              </Link>
            )}
            <Link to="/portal-parceira" className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-teal-600 hover:text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 px-3 py-1.5 rounded-full transition-colors">
              <Store className="w-3.5 h-3.5" /> Portal da Amiga
            </Link>
            <button onClick={() => setCartOpen(true)} className="relative bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-400 text-xs font-bold text-gray-800 rounded-full w-5 h-5 flex items-center justify-center">{cartCount}</span>
              )}
            </button>
          </div>
        </div>
      </header>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}