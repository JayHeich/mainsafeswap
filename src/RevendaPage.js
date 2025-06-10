// src/RevendaPage.js
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import LinkPage from './LinkPage';
import ConfirmPage from './ConfirmPage';

export default function RevendaPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [ticketName, setTicketName] = useState('');
  const [price, setPrice] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showLink, setShowLink] = useState(false);

  const handleGenerateLink = () => {
    if (ticketName && price) {
      setShowLink(true);
    } else {
      alert('Preencha todos os campos antes de continuar.');
    }
  };

  const handleBackFromLink = () => {
    setShowLink(false);
  };

  const howItWorks = [
    "Vendedor e comprador se conectam por um link da Safeswap",
    "O comprador envia o pagamento para a Safeswap (via Pix)",
    "O vendedor envia o ingresso",
    "O comprador confirma o recebimento no site",
    "A Safeswap libera o pagamento para o vendedor"
  ];

  return (
    <Routes>
      <Route
        path="/"
        element={
          <main className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#111827] text-[#e0f2f1] font-sans">
            {/* Header com efeito de vidro */}
            <header className="w-full p-4 backdrop-blur-md bg-[#1e293b]/70 shadow-lg flex justify-between items-center fixed top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#3ddad7] to-[#3b82f6] flex items-center justify-center shadow-lg">
                  <img src="/logo.png.jpg" alt="logo" className="h-8 w-8 rounded-lg" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#3ddad7] to-[#67e8f9]">Safeswap</h1>
              </div>
              <p className="text-sm bg-[#1e293b]/80 px-3 py-1 rounded-full text-[#94a3b8]">Seguro e rápido</p>
            </header>

            <section className="flex flex-col items-center justify-center text-center px-6 pt-20 pb-16 max-w-5xl mx-auto min-h-screen">
              {/* Botão Voltar */}
              {!role && !showForm && (
                <button
                  onClick={() => navigate('/')}
                  className="self-start text-[#94a3b8] hover:text-white text-sm mb-2 flex items-center gap-1 transition-all duration-300 hover:translate-x-[-4px]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                  Voltar
                </button>
              )}

              {!role && !showForm ? (
                <>
                  {/* Hero Section - Compacto */}
                  <div className="mb-6 relative">
                    <div className="absolute -z-10 w-64 h-64 rounded-full bg-[#3ddad7]/10 blur-3xl top-[-20%] left-[-10%]"></div>
                    <div className="absolute -z-10 w-64 h-64 rounded-full bg-[#3b82f6]/10 blur-3xl bottom-[-20%] right-[-10%]"></div>
                    
                    <h2 className="text-4xl font-bold mb-3 text-white leading-tight">
                      Intermediação de <span className="text-[#3ddad7]">revendas</span> de Ingressos
                    </h2>
                    <p className="text-lg text-[#cbd5e1] max-w-xl mb-4 mx-auto">
                      Compre ingressos de forma segura e rápida, sem se preocupar com fraudes ou problemas de pagamento.
                    </p>
                  </div>
                  
                  {/* Botões modernos e flutuantes - Movidos para cima */}
                  <div className="flex flex-col md:flex-row gap-6 mb-8 w-full max-w-lg mx-auto">
                    <button
                      onClick={() => {
                        setRole('comprador');
                        setShowForm(true);
                      }}
                      className="bg-gradient-to-r from-[#3b82f6] to-[#4f46e5] hover:translate-y-[-4px] px-8 py-4 rounded-xl text-white font-medium transition-all duration-300 shadow-lg hover:shadow-[#3b82f680] flex items-center justify-center gap-3 transform flex-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                      </svg>
                      Sou Comprador
                    </button>
                    <button
                      onClick={() => {
                        setRole('vendedor');
                        setShowForm(true);
                      }}
                      className="bg-gradient-to-r from-[#10b981] to-[#059669] hover:translate-y-[-4px] px-8 py-4 rounded-xl text-white font-medium transition-all duration-300 shadow-lg hover:shadow-[#10b98180] flex items-center justify-center gap-3 transform flex-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="1" x2="12" y2="23"></line>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                      </svg>
                      Sou Vendedor
                    </button>
                  </div>
                  
                  {/* Como funciona - Redesigned e compacto */}
                  <div className="w-full max-w-3xl mx-auto">
                    <h3 className="text-xl font-semibold mb-6 text-white inline-block relative">
                      Como funciona
                      <span className="absolute left-0 bottom-[-10px] w-1/4 h-1 bg-gradient-to-r from-[#3ddad7] to-transparent rounded-full"></span>
                    </h3>
                    <div className="grid md:grid-cols-5 gap-3">
                      {howItWorks.map((step, index) => (
                        <div key={index} className="bg-[#1e293b]/70 backdrop-blur-sm p-4 rounded-2xl shadow-lg hover:shadow-[#3ddad7]/20 hover:translate-y-[-4px] transition-all duration-300 flex flex-col items-center text-center">
                          <div className="bg-gradient-to-br from-[#3ddad7] to-[#3b82f6] w-10 h-10 rounded-full flex items-center justify-center mb-3 shadow-md">
                            <span className="text-[#0f172a] font-bold text-lg">{index + 1}</span>
                          </div>
                          <p className="text-[#cbd5e1] text-xs">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : showForm && !showLink ? (
                <>
                  {/* Formulário com visual moderno */}
                  <div className="bg-[#1e293b]/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg w-full max-w-md mx-auto relative overflow-hidden">
                    <div className="absolute -z-10 w-64 h-64 rounded-full bg-[#3ddad7]/10 blur-3xl top-[-20%] left-[-10%]"></div>
                    
                    <button
                      onClick={() => {
                        setRole(null);
                        setShowForm(false);
                      }}
                      className="text-sm text-[#94a3b8] mb-6 self-start flex items-center gap-1 hover:text-white transition-all duration-300"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                      </svg>
                      Voltar
                    </button>
                    
                    <h2 className="text-2xl font-semibold mb-6 text-white">
                      Preencha as informações do ingresso
                    </h2>
                    
                    <div className="space-y-4">
                      <div className="relative">
                        <input
                          placeholder="Nome do ingresso"
                          className="px-4 py-3 rounded-lg text-gray-900 w-full bg-white/90 focus:bg-white transition-all border-2 border-transparent focus:border-[#3ddad7] outline-none"
                          value={ticketName}
                          onChange={(e) => setTicketName(e.target.value)}
                        />
                      </div>
                      
                      <div className="relative">
                        <input
                          type="number"
                          placeholder="Preço combinado (R$)"
                          className="px-4 py-3 rounded-lg text-gray-900 w-full bg-white/90 focus:bg-white transition-all border-2 border-transparent focus:border-[#3ddad7] outline-none"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          min="0"
                          step="0.50"
                        />
                      </div>
                      
                      <button
                        className="bg-gradient-to-r from-[#3ddad7] to-[#2ec4b6] hover:translate-y-[-2px] text-black font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-[#3ddad7]/50 w-full transition-all duration-300 mt-4"
                        onClick={handleGenerateLink}
                      >
                        Gerar link
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <button onClick={handleBackFromLink} className="text-sm text-[#94a3b8] mb-4 self-start flex items-center gap-1 hover:text-white transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="19" y1="12" x2="5" y2="12"></line>
                      <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    Voltar
                  </button>
                  <LinkPage
                    ticketName={ticketName}
                    price={price}
                    role={role}
                    setStarted={setShowLink}
                    setRole={setRole}
                    setTicketName={setTicketName}
                    setPrice={setPrice}
                  />
                </>
              )}
            </section>
            
            {/* Footer com efeito de vidro */}
            <footer className="w-full p-4 backdrop-blur-md bg-[#1e293b]/50 text-center text-[#94a3b8] text-sm">
              Safeswap © {new Date().getFullYear()} - A forma mais segura de revender ingressos
            </footer>
          </main>
        }
      />
      <Route path="/confirmar" element={<ConfirmPage />} />
    </Routes>
  );
}