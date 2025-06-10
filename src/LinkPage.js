// src/LinkPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LinkPage({ ticketName, price, role, setStarted, setRole, setTicketName, setPrice }) {
  const navigate = useNavigate();
  const baseUrl = window.location.origin;
  const generatedLink = `${baseUrl}/#/confirmar?ingresso=${encodeURIComponent(ticketName)}&valor=${encodeURIComponent(price)}&role=${encodeURIComponent(role)}&source=${encodeURIComponent(role)}`;
  const sendText = role === 'comprador' ? 'vendedor' : 'comprador';
  const [copied, setCopied] = useState(false);
  const [listening, setListening] = useState(true);
  
  // Formata o preço para exibição
  const formattedPrice = parseFloat(price).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });

  useEffect(() => {
    if (role !== 'comprador') return; // só escuta se o comprador gerou o link

    const channel = new BroadcastChannel('safeswap_channel');
    channel.onmessage = (event) => {
      if (event.data === 'go_to_payment') {
        navigate(`/pagamento?valor=${encodeURIComponent(price)}`);
      }
    };

    return () => {
      channel.close();
      setListening(false);
    };
  }, [role, navigate, price]);

  const copyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    
    // Reset copied state after 3 seconds
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  const shareLink = () => {
    if (navigator.share) {
      navigator.share({
        title: 'SafeSwap - Link de transação',
        text: `Link para ${role === 'comprador' ? 'compra' : 'venda'} do ingresso: ${ticketName}`,
        url: generatedLink,
      })
      .catch((error) => console.log('Erro ao compartilhar', error));
    } else {
      copyLink();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white font-sans flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg bg-gray-800/60 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-700">
          <div className="flex items-center justify-center mb-6">
            <div className="h-16 w-16 bg-blue-500/20 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-blue-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
              </svg>
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Seu link está pronto!</h2>
            <p className="text-gray-400">
              Envie este link para o {sendText} para continuar com a transação
            </p>
          </div>

          {/* Detalhes da operação */}
          <div className="bg-gray-900/50 p-5 rounded-xl border border-gray-700 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">Ingresso</p>
                <p className="font-semibold text-lg truncate">{ticketName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Valor</p>
                <p className="font-semibold text-lg text-green-400">{formattedPrice}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Seu papel</p>
                <p className="font-semibold text-lg capitalize">{role}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Status</p>
                {role === 'comprador' && listening ? (
                  <div className="flex items-center">
                    <span className="h-2 w-2 bg-yellow-400 rounded-full animate-pulse mr-2"></span>
                    <p className="font-semibold text-yellow-400">Aguardando...</p>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <span className="h-2 w-2 bg-blue-400 rounded-full mr-2"></span>
                    <p className="font-semibold text-blue-400">Link gerado</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Link gerado */}
          <div className="mb-8">
            <p className="text-sm text-gray-400 mb-2">Link para compartilhar:</p>
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 overflow-hidden">
              <p className="text-sm md:text-base text-blue-400 break-all font-mono">{generatedLink}</p>
            </div>
          </div>

          {/* Botões de ação */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
              onClick={copyLink}
            >
              {copied ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  Link copiado!
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                  </svg>
                  Copiar link
                </>
              )}
            </button>
            
            {navigator.share && (
              <button
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                onClick={shareLink}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                </svg>
                Compartilhar
              </button>
            )}
          </div>

          {/* Informações adicionais */}
          <div className="mt-8 p-4 border border-gray-700 rounded-lg bg-gray-900/30">
            <div className="flex items-start gap-3 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
              <span className="text-sm">
                {role === 'comprador' 
                  ? "Quando o vendedor abrir o link, você será notificado para realizar o pagamento." 
                  : "Quando o comprador abrir o link, ele será direcionado para realizar o pagamento."}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center text-gray-500 text-sm">
        <p>© 2025 Safeswap • Todos os direitos reservados</p>
      </footer>
    </div>
  );
}