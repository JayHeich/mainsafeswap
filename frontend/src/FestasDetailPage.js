import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function FestaDetailPage() {
  const navigate = useNavigate();
  const { state: { festa } = {} } = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isDressCodeOpen, setIsDressCodeOpen] = useState(false);
  const [isLineUpOpen, setIsLineUpOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('about');

  useEffect(() => {
    // Trigger fade-in animation
    setTimeout(() => setIsVisible(true), 100);
    window.scrollTo(0, 0);
  }, []);

  if (!festa) {
    navigate('/', { replace: true });
    return null;
  }

  const displayDate = (iso) => {
    const [year, month, day] = iso.split('-');
    return `${day}/${month}/${year}`;
  };

  // Create Google Maps URL with custom styling for a cleaner look
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(festa.endereco)}&z=15&output=embed`;

  // Verificar se existem informações de line-up e dress code
  const hasLineUp = festa.lineup && festa.lineup.length > 0;
  const hasDressCode = festa.dressCode && festa.dressCode.length > 0;

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
    setActiveSection(sectionId);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#0f172a] to-[#0f1a2f] text-white font-sans">
      {/* Hero Section */}
      <div className="relative w-full h-[70vh] overflow-hidden">
        {festa.imagem && (
          <>
            <div className="absolute inset-0 z-0">
              <img
                src={festa.imagem}
                alt={festa.nome}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a]/70 via-[#0f172a]/60 to-[#0f172a] z-10"></div>
            </div>
            <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1NiIgaGVpZ2h0PSIxMDAiPgo8cmVjdCB3aWR0aD0iNTYiIGhlaWdodD0iMTAwIiBmaWxsPSIjMGYxNzJhIj48L3JlY3Q+CjxwYXRoIGQ9Ik0yOCA2NkwwIDUwTDAgMTZMMjggMEw1NiAxNkw1NiA1MEwyOCA2NkwyOCAxMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzBkOWViYSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMiI+PC9wYXRoPgo8cGF0aCBkPSJNMjggMEwyOCAzNEw1NiA1MEw1NiAxNiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMGQ5ZWJhIiBzdHJva2Utb3BhY2l0eT0iMC4wNSIgc3Ryb2tlLXdpZHRoPSIyIj48L3BhdGg+Cjwvc3ZnPg==')] opacity-10 z-5"></div>
          </>
        )}

        {/* Navigation Bar */}
        <div className="relative z-20 w-full px-4 py-5">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <button
              onClick={() => navigate(-1)}
              className="group flex items-center text-lg text-white/90 hover:text-teal-300 transition-all duration-300 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10"
            >
              <span className="transform transition-transform duration-300 group-hover:-translate-x-1">←</span>
              <span className="ml-2">Voltar</span>
            </button>
            
            <div className="hidden md:flex space-x-2">
              <button 
                onClick={() => scrollToSection('about')}
                className={`px-4 py-2 text-sm rounded-full border transition-all duration-300 ${
                  activeSection === 'about' 
                    ? 'border-teal-400 text-teal-300 bg-teal-400/10' 
                    : 'border-white/10 text-white/80 hover:border-white/30'
                }`}
              >
                Sobre
              </button>
              <button 
                onClick={() => scrollToSection('location')}
                className={`px-4 py-2 text-sm rounded-full border transition-all duration-300 ${
                  activeSection === 'location' 
                    ? 'border-teal-400 text-teal-300 bg-teal-400/10' 
                    : 'border-white/10 text-white/80 hover:border-white/30'
                }`}
              >
                Local
              </button>
              <button 
                onClick={() => scrollToSection('tickets')}
                className={`px-4 py-2 text-sm rounded-full border transition-all duration-300 ${
                  activeSection === 'tickets' 
                    ? 'border-teal-400 text-teal-300 bg-teal-400/10' 
                    : 'border-white/10 text-white/80 hover:border-white/30'
                }`}
              >
                Ingressos
              </button>
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className={`absolute bottom-0 left-0 right-0 z-20 px-4 pb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="bg-black/30 backdrop-blur-sm text-white px-4 py-2 rounded-full flex items-center space-x-2 border border-white/10">
                <span className="text-teal-400">📅</span>
                <span className="font-medium">{displayDate(festa.data)}</span>
              </div>
              <div className="bg-black/30 backdrop-blur-sm text-white px-4 py-2 rounded-full flex items-center space-x-2 border border-white/10">
                <span className="text-teal-400">📍</span>
                <span className="font-medium">{festa.local}</span>
              </div>
            </div>
            
            <h1 className="text-5xl sm:text-7xl font-black tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-teal-100 to-teal-300">
                {festa.nome}
              </span>
            </h1>
            
            <div className="mt-10 flex flex-wrap gap-4">
              <button
                onClick={() => navigate('/checkout', { state: { festa } })}
                className="px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold text-lg rounded-xl shadow-lg transition-all duration-300 hover:shadow-teal-400/30 hover:-translate-y-1 flex items-center justify-center"
              >
                <span className="mr-2">🎫</span> Comprar Ingresso
              </button>
              
              <button
                onClick={() => scrollToSection('about')}
                className="px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 font-medium text-lg rounded-xl transition-all duration-300 hover:bg-white/20"
              >
                Saiba mais
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`relative z-20 max-w-7xl mx-auto px-4 sm:px-6 py-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {/* About Section */}
        <div id="about" className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center">
            <div className="h-8 w-2 bg-gradient-to-b from-teal-400 to-cyan-500 rounded-full mr-4"></div>
            Sobre o Evento
          </h2>
          <div className="h-px w-full bg-gradient-to-r from-teal-400/20 to-transparent mb-8"></div>
          
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-xl">
            <p className="text-gray-200 leading-relaxed text-lg">{festa.descricao}</p>
          </div>
        </div>
        
        {/* Location Section */}
        <div id="location" className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center">
            <div className="h-8 w-2 bg-gradient-to-b from-teal-400 to-cyan-500 rounded-full mr-4"></div>
            Localização
          </h2>
          <div className="h-px w-full bg-gradient-to-r from-teal-400/20 to-transparent mb-8"></div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-xl flex flex-col justify-center">
              <div className="bg-teal-500/10 rounded-full p-3 w-16 h-16 flex items-center justify-center mb-6">
                <span className="text-teal-400 text-2xl">📌</span>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4">Endereço</h3>
              <p className="text-gray-300 text-lg leading-relaxed">{festa.endereco}</p>
              
              <a 
                href={`https://maps.google.com/maps?q=${encodeURIComponent(festa.endereco)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center text-teal-300 hover:text-teal-100 transition-colors"
              >
                <span>Ver no Google Maps</span>
                <span className="ml-2">↗</span>
              </a>
            </div>
            
            <div className="relative overflow-hidden rounded-2xl shadow-2xl border border-white/10 h-72 md:h-auto">
              {/* Overlay de carregamento */}
              <div className={`absolute inset-0 bg-[#0f172a]/70 backdrop-blur-sm flex items-center justify-center z-20 transition-opacity duration-500 ${isMapLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                <div className="w-12 h-12 border-3 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
              
              {/* Container do mapa */}
              <iframe
                title="Localização do evento"
                src={mapSrc}
                className="w-full h-full"
                allowFullScreen
                loading="lazy"
                onLoad={() => setIsMapLoaded(true)}
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>

        {/* Tickets Section */}
        <div id="tickets" className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center">
            <div className="h-8 w-2 bg-gradient-to-b from-teal-400 to-cyan-500 rounded-full mr-4"></div>
            Categorias de Ingressos
          </h2>
          <div className="h-px w-full bg-gradient-to-r from-teal-400/20 to-transparent mb-8"></div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(festa.categorias).map(([cat, preco], idx) => (
              <div
                key={cat}
                className="bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 shadow-xl transition-all duration-300 hover:shadow-teal-400/20 hover:-translate-y-1 group"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div className="bg-teal-500/10 rounded-full p-3 w-14 h-14 flex items-center justify-center">
                      <span className="text-teal-400 text-2xl">🎟️</span>
                    </div>
                    <div className="font-black text-2xl bg-gradient-to-r from-teal-300 to-cyan-300 bg-clip-text text-transparent">
                      R$ {preco}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-4">{cat}</h3>
                  
                  <div className="h-px w-full bg-white/10 mb-6"></div>
                  
                  <button
                    onClick={() => navigate('/checkout', { state: { festa, selectedCategory: cat } })}
                    className="w-full py-3 bg-white/10 hover:bg-teal-500/20 border border-white/10 group-hover:border-teal-400/30 text-white font-medium rounded-xl transition-all duration-300 flex items-center justify-center"
                  >
                    Selecionar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Line-Up Section */}
        <div className="mb-20">
          <button 
            className="w-full flex justify-between items-center bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 transition-all duration-300 hover:border-teal-400/30 group"
            onClick={() => setIsLineUpOpen(!isLineUpOpen)}
          >
            <div className="flex items-center">
              <div className="bg-teal-500/10 rounded-full p-3 w-14 h-14 flex items-center justify-center mr-4">
                <span className="text-teal-400 text-2xl">🎵</span>
              </div>
              <h2 className="text-3xl font-bold text-white">Line-Up</h2>
            </div>
            <div className={`w-10 h-10 rounded-full bg-white/10 group-hover:bg-teal-500/20 flex items-center justify-center transition-all duration-300 ${isLineUpOpen ? 'rotate-180' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </div>
          </button>
          
          {/* Conteúdo Colapsável do Line-Up */}
          <div className={`overflow-hidden transition-all duration-500 ${isLineUpOpen ? 'max-h-[2000px] opacity-100 mt-6' : 'max-h-0 opacity-0'}`}>
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-xl">
              {hasLineUp ? (
                <>
                  <p className="text-gray-200 leading-relaxed text-lg mb-8">
                    Confira as atrações confirmadas para este evento:
                  </p>
                  
                  <div className="space-y-6">                  
                    {festa.lineup.map((artista, index) => (
                      <div 
                        key={index} 
                        className="flex items-center bg-white/5 p-6 rounded-xl border border-white/10 hover:border-teal-400/20 transition-all duration-300 group"
                      >
                        <div className="mr-6 w-12 h-12 rounded-full bg-teal-500/10 flex items-center justify-center text-2xl group-hover:bg-teal-500/20 transition-all duration-300">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-white group-hover:text-teal-300 transition-all duration-300">{artista.nome}</h3>
                          <div className="flex items-center text-gray-400 mt-2">
                            <span className="text-teal-400 mr-2">⏰</span>
                            <span>{artista.horario}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="relative">
                    <div className="absolute inset-0 bg-teal-400/20 rounded-full animate-ping opacity-75"></div>
                    <div className="relative bg-teal-500/10 rounded-full p-6 text-teal-400 text-5xl">🎵</div>
                  </div>
                  <p className="text-gray-300 text-center text-2xl font-bold mt-8">Informações indisponíveis</p>
                  <p className="text-gray-400 text-center mt-3 max-w-md">O line-up deste evento ainda não foi divulgado. Fique atento para atualizações!</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Dress Code Section */}
        <div className="mb-20">
          <button 
            className="w-full flex justify-between items-center bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 transition-all duration-300 hover:border-teal-400/30 group"
            onClick={() => setIsDressCodeOpen(!isDressCodeOpen)}
          >
            <div className="flex items-center">
              <div className="bg-teal-500/10 rounded-full p-3 w-14 h-14 flex items-center justify-center mr-4">
                <span className="text-teal-400 text-2xl">👗</span>
              </div>
              <h2 className="text-3xl font-bold text-white">Dress Code</h2>
            </div>
            <div className={`w-10 h-10 rounded-full bg-white/10 group-hover:bg-teal-500/20 flex items-center justify-center transition-all duration-300 ${isDressCodeOpen ? 'rotate-180' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </div>
          </button>
          
          {/* Conteúdo Colapsável */}
          <div className={`overflow-hidden transition-all duration-500 ${isDressCodeOpen ? 'max-h-[2000px] opacity-100 mt-6' : 'max-h-0 opacity-0'}`}>
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-xl">
              {hasDressCode ? (
                <>
                  <p className="text-gray-200 leading-relaxed text-lg mb-8">
                    Sugerimos trajes elegantes para aproveitar ao máximo a experiência do evento.
                    Confira algumas inspirações para o seu look:
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {festa.dressCode.map((item, index) => (
                      <div key={index} className="bg-white/5 rounded-xl overflow-hidden border border-white/10 transition-all duration-300 hover:shadow-lg hover:shadow-teal-400/10 group">
                        <div className="relative overflow-hidden">
                          <img 
                            src={item.src} 
                            alt={item.desc} 
                            className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>
                        </div>
                        <div className="p-4">
                          <p className="text-white text-center font-medium">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="relative">
                    <div className="absolute inset-0 bg-teal-400/20 rounded-full animate-ping opacity-75"></div>
                    <div className="relative bg-teal-500/10 rounded-full p-6 text-teal-400 text-5xl">👗</div>
                  </div>
                  <p className="text-gray-300 text-center text-2xl font-bold mt-8">Informações indisponíveis</p>
                  <p className="text-gray-400 text-center mt-3 max-w-md">O dress code deste evento ainda não foi divulgado. Fique atento para atualizações!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="relative z-20 pt-12 pb-32 bg-[#0f172a]/80 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent mb-6">{festa.nome}</h3>
            <p className="text-gray-400 mb-8">Não perca essa experiência incrível!</p>
            
            <button
              onClick={() => navigate('/checkout', { state: { festa } })}
              className="px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold text-lg rounded-xl shadow-lg transition-all duration-300 hover:shadow-teal-400/30 hover:-translate-y-1 flex items-center justify-center mx-auto"
            >
              <span className="mr-2">🎫</span> Comprar Ingresso Agora
            </button>
          </div>
          
          <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-white/50 text-sm mb-4 sm:mb-0">© 2025 Todos os direitos reservados</p>
            <div className="flex space-x-4">
              <a href="#" className="text-white/70 hover:text-teal-400 transition-colors duration-300">Política de Privacidade</a>
              <a href="#" className="text-white/70 hover:text-teal-400 transition-colors duration-300">Termos de Uso</a>
              <a href="#" className="text-white/70 hover:text-teal-400 transition-colors duration-300">Contato</a>
            </div>
          </div>
        </div>
      </div>

      {/* Botão de compra flutuante em telas móveis */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 py-3 bg-[#0f172a]/90 backdrop-blur-md border-t border-white/10 shadow-xl">
        <button
          onClick={() => navigate('/checkout', { state: { festa } })}
          className="w-full py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold text-lg rounded-xl shadow-lg transition-all duration-300 hover:shadow-teal-400/30 hover:-translate-y-1 flex items-center justify-center"
        >
          <span className="mr-2">🎫</span> Comprar Ingresso
        </button>
      </div>

      {/* Efeitos de fundo */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        {/* Blur circles */}
        <div className="absolute top-1/4 left-[-10%] w-96 h-96 bg-teal-400 rounded-full filter blur-[120px] opacity-10 animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[30rem] h-[30rem] bg-cyan-500 rounded-full filter blur-[120px] opacity-10 animate-pulse-slow-offset"></div>
        <div className="absolute top-[60%] right-[20%] w-64 h-64 bg-teal-200 rounded-full filter blur-[100px] opacity-5 animate-pulse-slow"></div>
        
        {/* Particle effect */}
        <div className="absolute inset-0 opacity-30 mix-blend-screen" 
             style={{
               backgroundImage: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%)',
               backgroundSize: '3px 3px',
               backgroundRepeat: 'repeat'
             }}>
        </div>
      </div>

      {/* Estilos adicionais */}
      <style jsx global>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.08; transform: scale(1); }
          50% { opacity: 0.15; transform: scale(1.05); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 10s infinite ease-in-out;
        }
        @keyframes pulse-slow-offset {
          0%, 100% { opacity: 0.08; transform: scale(1); }
          50% { opacity: 0.12; transform: scale(1.05); }
        }
        .animate-pulse-slow-offset {
          animation: pulse-slow-offset 14s infinite ease-in-out;
        }
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
}