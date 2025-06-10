// src/ConfirmPage.js
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function ConfirmPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const ticket = params.get('ingresso');
  const price = params.get('valor');
  const role = params.get('role');
  const source = params.get('source');

  const actionText = role === 'comprador' ? 'vender' : 'comprar';

  useEffect(() => {
    if (status === 'confirmed' || status === 'rejected') {
      const timer = setTimeout(() => {
        if (status === 'confirmed') {
          if (source === 'vendedor') {
            navigate(`/pagamento?valor=${encodeURIComponent(price)}`);
          } else {
            const channel = new BroadcastChannel('safeswap_channel');
            channel.postMessage('go_to_payment');
            navigate('/aguardando');
            channel.close();
          }
        } else {
          navigate('/cancelado');
        }
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [status, navigate, price, source]);

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => {
      setStatus('confirmed');
      setLoading(false);
    }, 800);
  };

  const handleReject = () => {
    setLoading(true);
    setTimeout(() => {
      setStatus('rejected');
      setLoading(false);
    }, 800);
  };

  const formatPrice = (value) => {
    return parseFloat(value).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white font-sans flex flex-col">
      <header className="w-full p-4 md:p-6 shadow-lg bg-gray-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 rounded-xl blur-sm opacity-50"></div>
              <img src="/logo.png.jpg" alt="logo" className="h-10 w-10 rounded-xl relative z-10" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Safeswap
            </h1>
          </div>
          <p className="text-sm text-gray-400 font-medium hidden sm:block">Seguro e rápido</p>
        </div>
      </header>

      <section className="flex-1 flex flex-col justify-center items-center px-4 py-12 sm:px-6 max-w-lg mx-auto w-full">
        {!ticket || !price || !role ? (
          <div className="text-center bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-700 w-full">
            <div className="flex justify-center mb-6">
              <div className="h-16 w-16 bg-red-500/20 rounded-full flex items-center justify-center">
                <span className="text-3xl">❌</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-3">Link inválido</h1>
            <p className="text-gray-400">Faltam informações necessárias na URL.</p>
          </div>
        ) : status === 'confirmed' ? (
          <div className="text-center bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-700 w-full">
            <div className="flex justify-center mb-6">
              <div className="h-16 w-16 bg-green-500/20 rounded-full flex items-center justify-center">
                <span className="text-3xl">✅</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-3">Operação confirmada!</h1>
            <p className="text-gray-400">Redirecionando para o próximo passo...</p>
            <div className="mt-6 flex justify-center">
              <div className="w-12 h-1 bg-gray-700 rounded-full relative overflow-hidden">
                <div className="absolute top-0 left-0 h-full bg-green-500 animate-pulse w-full"></div>
              </div>
            </div>
          </div>
        ) : status === 'rejected' ? (
          <div className="text-center bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-700 w-full">
            <div className="flex justify-center mb-6">
              <div className="h-16 w-16 bg-red-500/20 rounded-full flex items-center justify-center">
                <span className="text-3xl">❌</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-3">Operação recusada</h1>
            <p className="text-gray-400">Redirecionando para a mensagem de cancelamento...</p>
            <div className="mt-6 flex justify-center">
              <div className="w-12 h-1 bg-gray-700 rounded-full relative overflow-hidden">
                <div className="absolute top-0 left-0 h-full bg-red-500 animate-pulse w-full"></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-700 w-full">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Confirmação de operação</h1>
              <p className="text-gray-400">Revise os detalhes da sua operação</p>
            </div>
            
            <div className="mb-8 bg-gray-900/60 p-6 rounded-xl border border-gray-700">
              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-sm text-gray-400">Operação</p>
                  <p className="text-lg font-semibold">
                    <span className={role === 'comprador' ? 'text-red-400' : 'text-green-400'}>
                      {actionText.toUpperCase()}
                    </span> ingresso
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-400">Ingresso</p>
                  <p className="text-lg font-semibold">{ticket}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-400">Valor</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                    {formatPrice(price)}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleConfirm}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <span>✅ Confirmar</span>
                )}
              </button>
              <button
                onClick={handleReject}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <span>❌ Cancelar</span>
                )}
              </button>
            </div>
          </div>
        )}
      </section>
      
      <footer className="py-4 text-center text-gray-500 text-sm">
        <p>© 2025 Safeswap • Todos os direitos reservados</p>
      </footer>
    </main>
  );
}