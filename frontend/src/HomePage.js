import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import festasJson from './festas.json';

export default function HomePage() {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [proximosEventos, setProximosEventos] = useState([]);

  useEffect(() => {
    // Efeito de entrada suave
    setIsLoaded(true);
    
    // Ordenar festas por data e pegar as 3 próximas
    const hoje = new Date();
    const festasOrdenadas = [...festasJson]
      .filter(festa => new Date(festa.data) >= hoje) // Apenas festas futuras
      .sort((a, b) => new Date(a.data) - new Date(b.data)) // Ordenar por data crescente
      .slice(0, 3); // Pegar as 3 próximas
    
    setProximosEventos(festasOrdenadas);
  }, []);
  
  // Função para formatar a data
  const formatarData = (dataISO) => {
    const [ano, mes, dia] = dataISO.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#0f1a2f] text-white flex flex-col relative overflow-hidden">
      {/* Elementos decorativos de fundo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[-10%] w-96 h-96 rounded-full bg-teal-400 opacity-5 blur-[100px]"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-96 h-96 rounded-full bg-cyan-500 opacity-5 blur-[100px]"></div>
        <div className="absolute bottom-[30%] left-[20%] w-72 h-72 rounded-full bg-emerald-600 opacity-3 blur-[80px]"></div>
      </div>

      {/* Header com navegação */}
      <header className="relative z-10 px-6 py-4 md:px-12 lg:px-16 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png.jpg"
            alt="Safeswap Logo"
            className="h-10 w-10 rounded-xl shadow-lg"
          />
          <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500">
            Safeswap
          </span>
        </div>
        
        <div className="hidden md:flex gap-6 text-sm">
          <button
            onClick={() => navigate('/about')}
            className="text-gray-300 hover:text-white transition"
          >
            Sobre
          </button>
          <button 
            onClick={() => navigate('/faq')}
            className="text-gray-300 hover:text-white transition"
          >
            Ajuda
          </button>
          <button 
            onClick={() => navigate('/festas')}
            className="text-gray-300 hover:text-white transition"
          >
            Eventos
          </button>
        </div>
      </header>

      {/* Hero Section com conteúdo principal */}
      <div className={`flex-grow flex flex-col items-center justify-center px-6 md:px-12 transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
        <div className="w-full max-w-4xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          {/* Lado esquerdo - Texto e botões */}
          <div className="flex flex-col items-start md:items-start text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500">
                Ingressos seguros, <br />experiências incríveis
              </span>
            </h1>
            
            <p className="text-gray-300 text-lg mb-8 max-w-md">
              Compre e revenda ingressos com total segurança para os melhores eventos
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <button
                onClick={() => navigate('/festas')}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white px-8 py-4 rounded-xl text-lg font-bold transition duration-300 transform hover:scale-[1.03] hover:shadow-lg shadow-md flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Comprar ingressos
              </button>
              
              <button
                onClick={() => navigate('/revenda')}
                className="bg-transparent border border-teal-400 text-teal-400 hover:bg-teal-400/10 px-6 py-4 rounded-xl text-lg font-medium transition duration-300 flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m-8 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                Revender
              </button>
            </div>
            
            {/* Indicadores de confiança */}
            <div className="mt-10 grid grid-cols-3 gap-4 w-full">
              <div className="flex flex-col items-center">
                <div className="text-teal-400 text-xl font-bold">100%</div>
                <div className="text-xs text-gray-400">Seguro</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-teal-400 text-xl font-bold">5%</div>
                <div className="text-xs text-gray-400">Taxa de processamento</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-teal-400 text-xl font-bold">0%</div>
                <div className="text-xs text-gray-400">Taxa de saque</div>
              </div>
            </div>
          </div>
          
          {/* Lado direito - Logo com borda cyan */}
          <div className="hidden md:flex justify-center items-center">
            <div className="group">
              <div className="p-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 shadow-lg group-hover:shadow-cyan-500/20 transition-all duration-300">
                <img
                  src="/logo.png.jpg"
                  alt="Safeswap Logo"
                  className="w-64 h-64 object-cover rounded-lg transition-all duration-500 group-hover:scale-[1.02] shadow-md"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Seção de eventos próximos - visível apenas em telas maiores */}
      <div className="hidden lg:block relative z-10 bg-[#1e293b]/50 backdrop-blur-sm p-8 rounded-t-3xl -mb-8 mt-8 mx-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500">
            Próximos eventos
          </h2>
          <button 
            onClick={() => navigate('/festas')}
            className="text-teal-400 text-sm hover:underline flex items-center gap-1"
          >
            Ver todos
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          {proximosEventos.length > 0 ? (
            proximosEventos.map((festa) => (
              <div 
                key={festa.id || festa.nome} 
                className="bg-[#0f172a] rounded-xl overflow-hidden hover:bg-[#1e293b] transition cursor-pointer hover:shadow-lg" 
                onClick={() => navigate('/evento', { state: { festa } })}
              >
                <div className="h-32 overflow-hidden">
                  {festa.imagem ? (
                    <img src={festa.imagem} alt={festa.nome} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-teal-400/20 to-cyan-500/20 flex items-center justify-center">
                      <span className="text-sm text-gray-400">{festa.nome}</span>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-white">{festa.nome}</h3>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-gray-400">{formatarData(festa.data)}</p>
                    <span className="text-xs bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-full">
                      R$ {Math.min(...Object.values(festa.categorias))}+
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            // Fallback para quando não há eventos ainda
            [1, 2, 3].map((item) => (
              <div key={item} className="bg-[#0f172a] rounded-xl p-3 hover:bg-[#1e293b] transition cursor-pointer hover:shadow-lg" onClick={() => navigate('/festas')}>
                <div className="h-32 bg-gray-800 rounded-lg mb-2 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-teal-400/20 to-cyan-500/20 flex items-center justify-center">
                    <span className="text-sm text-gray-400">Carregando eventos...</span>
                  </div>
                </div>
                <h3 className="font-medium text-white">Evento em breve</h3>
                <p className="text-xs text-gray-400 mt-1">Aguarde</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer com informações de contato e redes sociais */}
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
    </main>
  );
}