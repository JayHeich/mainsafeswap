import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Componente Accordion com estilo personalizado
const Accordion = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="bg-[#1e293b]/80 backdrop-blur-sm rounded-xl overflow-hidden border border-[#3ddad7]/10 shadow-lg transition-all duration-300 hover:shadow-xl">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 text-white hover:bg-[#3ddad7]/10 focus:outline-none focus:ring-2 focus:ring-[#3ddad7] transition-all duration-300"
      >
        <span className="text-lg font-medium">{title}</span>
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-teal-400 to-cyan-500 text-white font-bold">
          {isOpen ? "−" : "+"}
        </span>
      </button>
      {isOpen && (
        <div className="p-5 bg-[#0f172a]/80 text-gray-300">
          {children}
        </div>
      )}
    </div>
  );
};

export default function AboutPage() {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Efeito de entrada suave
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#0f1a2f] text-white flex flex-col relative overflow-hidden">
      {/* Elementos decorativos de fundo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[-10%] w-96 h-96 rounded-full bg-teal-400 opacity-5 blur-[100px]"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-96 h-96 rounded-full bg-cyan-500 opacity-5 blur-[100px]"></div>
        <div className="absolute bottom-[30%] left-[20%] w-72 h-72 rounded-full bg-emerald-600 opacity-3 blur-[80px]"></div>
      </div>

      {/* Conteúdo principal */}
      <div className={`flex-grow flex flex-col items-center px-6 md:px-12 py-12 transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
        {/* Botão de volta com seta */}
        <button
          onClick={() => navigate("/")}
          className="self-start mb-8 text-teal-400 hover:text-teal-300 transition flex items-center gap-2 group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="font-medium">Voltar ao início</span>
        </button>

        <div className="w-full max-w-4xl mx-auto">
          {/* Seção de título com logo */}
          <div className="flex flex-col items-center mb-12">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-400/20 to-cyan-500/20 rounded-full backdrop-blur-sm border border-white/10 -z-10 scale-150"></div>
              <img
                src="/logo.png.jpg"
                alt="Safeswap Logo"
                className="h-32 w-32 rounded-3xl shadow-2xl transform transition-all duration-500 hover:scale-105 hover:rotate-3 z-10"
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500">
                Sobre a SafeSwap
              </span>
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full mb-6"></div>
          </div>

          {/* Conteúdo principal */}
          <div className="bg-[#1e293b]/30 backdrop-blur-md rounded-2xl border border-[#3ddad7]/10 shadow-xl p-8 md:p-10">
            <p className="text-lg mb-6 text-gray-300 leading-relaxed">
              A <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500 font-bold">SafeSwap</span> é a solução definitiva para quem busca comprar ingressos de forma 
              <span className="mx-1 px-3 py-0.5 bg-teal-500/20 text-teal-300 rounded-full text-sm font-medium">fácil</span>, 
              <span className="mx-1 px-3 py-0.5 bg-cyan-500/20 text-cyan-300 rounded-full text-sm font-medium">segura</span> e 
              <span className="mx-1 px-3 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full text-sm font-medium">rápida</span>. 
              Nossa plataforma combina tecnologia de ponta e processos verificados para garantir que você receba ingressos legítimos em instantes, sem complicações.
            </p>

            <p className="text-lg mb-10 text-gray-300 leading-relaxed">
              Além da venda direta, promovemos <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500 font-bold">intermediações seguras de revenda</span>, atuando como garantia para compradores e vendedores. O pagamento fica em custódia até que a transferência do ingresso seja confirmada, reduzindo riscos e aumentando a confiança em cada negociação.
            </p>

            {/* Estatísticas */}
            <div className="grid grid-cols-3 gap-4 mb-10">
              <div className="bg-[#0f172a]/80 p-5 rounded-xl border border-[#3ddad7]/10 flex flex-col items-center">
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500 mb-1">100%</div>
                <div className="text-sm text-gray-400">Seguro</div>
              </div>
              <div className="bg-[#0f172a]/80 p-5 rounded-xl border border-[#3ddad7]/10 flex flex-col items-center">
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500 mb-1">5%</div>
                <div className="text-sm text-gray-400">Taxa de processamento</div>
              </div>
              <div className="bg-[#0f172a]/80 p-5 rounded-xl border border-[#3ddad7]/10 flex flex-col items-center">
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500 mb-1">0%</div>
                <div className="text-sm text-gray-400">Taxa de saque</div>
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500">Nossos diferenciais</h2>

            <div className="space-y-4">
              <Accordion title="🌟 Venda Simplificada">
                Com apenas alguns cliques, adquira seu ingresso e receba confirmação instantânea por e-mail ou WhatsApp. Nossa interface intuitiva torna o processo rápido e descomplicado.
              </Accordion>

              <Accordion title="🔒 Pagamento em Custódia">
                Asseguramos que seu dinheiro só seja liberado quando todas as partes confirmarem a transação, oferecendo total segurança financeira para compradores e vendedores.
              </Accordion>

              <Accordion title="📲 Validação Automatizada">
                Utilizamos QR codes exclusivos e validadores rápidos para autenticar ingressos na entrada do evento, garantindo praticidade e confiabilidade.
              </Accordion>
              
              <Accordion title="💼 Suporte Personalizado">
                Nossa equipe está sempre disponível para resolver suas dúvidas e garantir que sua experiência seja perfeita do início ao fim.
              </Accordion>
            </div>
            
            {/* CTA */}
            <div className="mt-12 flex flex-col items-center">
              <button
                onClick={() => navigate('/festas')}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white px-8 py-4 rounded-xl text-lg font-bold transition duration-300 transform hover:scale-[1.03] hover:shadow-lg shadow-md flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Encontrar eventos
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-sm text-[#94a3b8] border-t border-[#1e293b] py-6 px-4 bg-[#0f172a]">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <p className="flex items-center justify-center sm:justify-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <a href="mailto:ajuda@safeswapbr.com" className="text-[#3ddad7] hover:underline">ajuda@safeswapbr.com</a>
            </p>
            <p className="flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <a href="https://wa.me/5511933478389" target="_blank" rel="noopener noreferrer" className="text-[#3ddad7] hover:underline">(11) 93347-8389</a>
            </p>
            <p className="flex items-center justify-center sm:justify-end gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
              <a href="https://instagram.com/safeswap_" target="_blank" rel="noopener noreferrer" className="text-[#3ddad7] hover:underline">safeswap_</a>
            </p>
          </div>
          
          <div className="text-xs text-gray-500 text-center mt-4">
            © {new Date().getFullYear()} Safeswap. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}