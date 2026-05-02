import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
export default function OrderSuccess() {
  return (
    <div className="min-h-screen bg-pink-50">
      <Header />
      <div className="max-w-md mx-auto text-center py-24 px-4">
        <div className="text-7xl mb-6">🎉</div>
        <h1 className="text-3xl font-extrabold text-pink-600 mb-3">Pedido Enviado!</h1>
        <p className="text-gray-600 mb-2">Seu pedido foi registrado e você foi redirecionado ao WhatsApp para confirmar com a loja.</p>
        <p className="text-gray-500 text-sm mb-8">Em breve entraremos em contato! 💕</p>
        <Link to="/" className="bg-pink-500 hover:bg-pink-600 text-white font-bold px-8 py-3 rounded-full inline-block transition-colors">Continuar comprando</Link>
      </div>
      <Footer />
    </div>
  );
}