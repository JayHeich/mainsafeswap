// src/FestasPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import festasJson from './festas.json';

export default function FestasPage() {
  const [festas, setFestas] = useState([]);
  const [dataSelecionada, setDataSelecionada] = useState(null);
  const [mostrarCalendario, setMostrarCalendario] = useState(false);
  const [mostrarFiltroPreco, setMostrarFiltroPreco] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 0]);
  const [maxPrice, setMaxPrice] = useState(0);
  const [filtroPrecoModificado, setFiltroPrecoModificado] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Adicionar propriedades de preço mínimo e máximo para cada festa
    const festasComPrecos = festasJson.map(festa => {
      const precos = Object.values(festa.categorias || {});
      return {
        ...festa,
        preco_min: precos.length > 0 ? Math.min(...precos) : 0,
        preco_max: precos.length > 0 ? Math.max(...precos) : 0
      };
    });

    const ordenadas = [...festasComPrecos].sort(
      (a, b) => new Date(a.data) - new Date(b.data)
    );
    
    // Encontrar o maior preço disponível entre todos os ingressos
    const maiorPreco = ordenadas.reduce((max, festa) => {
      return Math.max(max, festa.preco_max || 0);
    }, 0);
    
    setMaxPrice(maiorPreco);
    setPriceRange([0, maiorPreco]); // Inicializar com o range completo
    setFestas(ordenadas);
  }, []);

  const festasFiltradas = festas
    .filter((f) =>
      dataSelecionada ? f.data === dataSelecionada.toISOString().split('T')[0] : true
    )
    .filter((f) =>
      f.nome.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((f) => {
      // Se o filtro não foi modificado, não aplicar filtro de preço
      if (!filtroPrecoModificado) {
        return true;
      }
      return f.preco_min <= priceRange[1] && f.preco_max >= priceRange[0];
    });

  const displayDate = (iso) => {
    const [year, month, day] = iso.split('-');
    return `${day}/${month}/${year}`;
  };
  
  const handlePriceChange = (e, index) => {
    const newRange = [...priceRange];
    const newValue = parseInt(e.target.value);
    
    // Garantir que o preço mínimo não seja maior que o preço máximo
    // E que o preço máximo não seja menor que o preço mínimo
    if (index === 0) { // Preço mínimo
      newRange[index] = Math.min(newValue, priceRange[1]);
    } else { // Preço máximo
      newRange[index] = Math.max(newValue, priceRange[0]);
    }
    
    setPriceRange(newRange);
    setFiltroPrecoModificado(true); // Marcar que o usuário mexeu no filtro
  };
  
  const limparFiltros = () => {
    setDataSelecionada(null);
    setPriceRange([0, maxPrice]);
    setSearchTerm('');
    setFiltroPrecoModificado(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#0f1a2f] text-white p-6 font-sans">
      <header className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="flex items-center space-x-4 mb-4 md:mb-0">
          <span
            className="text-3xl cursor-pointer hover:text-teal-300"
            onClick={() => navigate('/')}
          >
            ←
          </span>
          <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-500">
            Festas Disponíveis
          </span>
        </h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="🔍 Pesquisar festa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 bg-white bg-opacity-10 placeholder-gray-400 text-white px-4 py-2 rounded-full focus:outline-none"
          />
          <div className="flex gap-2">
            <button 
              onClick={() => setMostrarFiltroPreco(!mostrarFiltroPreco)} 
              className="bg-white bg-opacity-10 hover:bg-opacity-20 px-3 py-2 rounded-full text-sm transition flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              Filtro de Preço
            </button>
            
            {(dataSelecionada || filtroPrecoModificado || searchTerm) && (
              <button 
                onClick={limparFiltros}
                className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-3 py-2 rounded-full text-sm flex items-center gap-1 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Limpar
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar com Calendário e Filtros */}
        <div className="lg:col-span-1">  
          {/* Calendário */}
          <div className="p-4 bg-[#1e293b]/50 backdrop-blur-sm rounded-2xl mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">📅 Calendário</h2>
              <button
                onClick={() => setMostrarCalendario(!mostrarCalendario)}
                className="text-sm text-teal-400 hover:text-teal-300"
              >
                {mostrarCalendario ? 'Esconder' : 'Mostrar'}
              </button>
            </div>
            
            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${mostrarCalendario ? 'max-h-[26rem] opacity-100' : 'max-h-0 opacity-0'}`}>
              <Calendar
                onChange={setDataSelecionada}
                value={dataSelecionada}
                className="text-gray-200"
                nextLabel={<span className="calendar-nav">›</span>}
                prevLabel={<span className="calendar-nav">‹</span>}
                tileClassName={({ date, view }) =>
                  view === 'month' && festas.some(f => f.data === date.toISOString().split('T')[0])
                    ? 'event-day'
                    : undefined
                }
                formatMonthYear={(locale, date) => (
                  <span className="text-teal-400 font-semibold">
                    {date.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}
                  </span>
                )}
              />
            </div>
            
            {dataSelecionada && (
              <button
                onClick={() => setDataSelecionada(null)}
                className="mt-3 text-sm underline text-teal-400"
              >
                Ver todas as festas
              </button>
            )}
          </div>
          
          {/* Filtro de preço */}
          <div className="p-4 bg-[#1e293b]/50 backdrop-blur-sm rounded-2xl mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Filtro de Preço</h2>
              <button
                onClick={() => setMostrarFiltroPreco(!mostrarFiltroPreco)}
                className="text-sm text-teal-400 hover:text-teal-300"
              >
                {mostrarFiltroPreco ? 'Esconder' : 'Mostrar'}
              </button>
            </div>
            
            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${mostrarFiltroPreco ? 'max-h-[20rem] opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-300 mb-2">
                  <span>Preço Mínimo:</span>
                  <span className="text-teal-400 font-medium">R$ {priceRange[0]}</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max={maxPrice} 
                  step="10"
                  value={priceRange[0]}
                  onChange={(e) => handlePriceChange(e, 0)}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              
              <div>
                <div className="flex justify-between text-sm text-gray-300 mb-2">
                  <span>Preço Máximo:</span>
                  <span className="text-teal-400 font-medium">R$ {priceRange[1]}</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max={maxPrice} 
                  step="10"
                  value={priceRange[1]}
                  onChange={(e) => handlePriceChange(e, 1)}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              
              <div className="mt-4 p-3 bg-[#0f172a]/60 rounded-xl text-sm">
                <p className="text-center text-gray-300">Mostrando eventos com preços entre:</p>
                <p className="text-center text-teal-400 font-bold mt-1">R$ {priceRange[0]} e R$ {priceRange[1]}</p>
              </div>
            </div>
          </div>
          
          {/* Status de filtros - visível apenas em desktop */}
          <div className="hidden lg:block p-4 bg-[#1e293b]/50 backdrop-blur-sm rounded-2xl">
            <h2 className="text-xl font-semibold mb-4">Filtros Ativos</h2>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">Data:</span>
                <span className="text-white">{dataSelecionada ? dataSelecionada.toLocaleDateString() : 'Todas'}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-300">Preço:</span>
                <span className="text-white">{filtroPrecoModificado ? `R$ ${priceRange[0]} - R$ ${priceRange[1]}` : 'Todos'}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-300">Busca:</span>
                <span className="text-white">{searchTerm || 'Nenhuma'}</span>
              </div>
              
              <div className="pt-3 border-t border-white border-opacity-10">
                <div className="flex justify-between">
                  <span className="text-gray-300">Eventos Encontrados:</span>
                  <span className="text-teal-400 font-bold">{festasFiltradas.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Festas Grid */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-8">
          {festasFiltradas.length === 0 ? (
            <div className="text-center text-gray-400 col-span-full pt-10 bg-[#1e293b]/50 backdrop-blur-sm rounded-2xl p-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xl font-semibold mb-2">Nenhuma festa encontrada</p>
              <p className="text-gray-400 mb-4">Tente ajustar seus filtros para ver mais resultados.</p>
              <button 
                onClick={limparFiltros}
                className="bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 px-4 py-2 rounded-full text-sm transition"
              >
                Limpar todos os filtros
              </button>
            </div>
          ) : (
            festasFiltradas.map((f) => (
              <div
                key={f.nome}
                className="bg-[#1e293b]/50 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition"
              >
                {f.imagem && (
                  <div className="relative h-48 w-full overflow-hidden rounded-t-2xl">
                    <img
                      src={f.imagem}
                      alt={f.nome}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-5 space-y-2">
                  <h3 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-500">
                    {f.nome}
                  </h3>
                  <span className="text-sm inline-block bg-teal-600/30 text-teal-300 px-3 py-1 rounded-full">
                    {displayDate(f.data)}
                  </span>
                  {f.descricao && (
                    <p className="text-gray-200 text-sm line-clamp-3">
                      {f.descricao}
                    </p>
                  )}
                  <button
                    onClick={() => navigate('/evento', { state: { festa: f } })}
                    className="w-full mt-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-gray-900 font-bold rounded-full hover:opacity-90 transition"
                  >
                    🎫 Ver Detalhes
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Notificação de resultados filtrados */}
      {(dataSelecionada || filtroPrecoModificado || searchTerm) && festasFiltradas.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-teal-500 to-cyan-500 px-4 py-2 rounded-full shadow-lg transition-all duration-300 flex items-center gap-2">
          <span className="text-sm font-medium">Exibindo {festasFiltradas.length} evento{festasFiltradas.length !== 1 ? 's' : ''}</span>
          <button 
            onClick={limparFiltros}
            className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded-full transition"
          >
            Limpar
          </button>
        </div>
      )}

      {/* Calendar Custom Styles */}
      <style jsx>{`
        .react-calendar {
          background: transparent;
          border: none;
          font-family: inherit;
        }
        .react-calendar__navigation {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }
        .calendar-nav {
          display: inline-block;
          width: 2rem;
          height: 2rem;
          line-height: 2rem;
          text-align: center;
          border-radius: 9999px;
          background: rgba(45, 212, 191, 0.2);
          color: #0f172a;
          cursor: pointer;
          font-size: 1.25rem;
        }
        .react-calendar__month-view__weekdays {
          text-transform: uppercase;
          font-size: 0.75rem;
          color: #94a3b8;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          padding-bottom: 0.5rem;
        }
        .react-calendar__tile {
          padding: 0.5rem 0;
          border-radius: 0.5rem;
        }
        .react-calendar__tile:hover {
          background: rgba(45, 212, 191, 0.1);
        }
        .react-calendar__tile--now {
          border: 2px solid #2dd4bf !important;
          background: transparent !important;
          color: #2dd4bf !important;
        }
        .react-calendar__tile--active {
          background: #2dd4bf !important;
          color: #0f172a !important;
        }
        .event-day {
          position: relative;
        }
        .event-day::after {
          content: '';
          position: absolute;
          bottom: 4px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 4px;
          background: #2dd4bf;
          border-radius: 50%;
        }
        /* Estilo para os sliders de preço */
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #2dd4bf;
          cursor: pointer;
          margin-top: -9px;
          border: 2px solid #0f172a;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          transition: all 0.2s ease;
        }
        
        input[type=range]::-webkit-slider-thumb:hover {
          transform: scale(1.1);
        }
        
        input[type=range]::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #2dd4bf;
          cursor: pointer;
          border: 2px solid #0f172a;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          transition: all 0.2s ease;
        }
        
        input[type=range]::-moz-range-thumb:hover {
          transform: scale(1.1);
        }
        
        input[type=range] {
          -webkit-appearance: none;
          height: 8px;
          border-radius: 5px;
          background: #334155;
          outline: none;
          padding: 0;
          margin: 0;
        }
        
        input[type=range]::-webkit-slider-runnable-track {
          width: 100%;
          height: 8px;
          cursor: pointer;
          border-radius: 5px;
        }
        
        input[type=range]::-moz-range-track {
          width: 100%;
          height: 8px;
          cursor: pointer;
          border-radius: 5px;
        }
      `}</style>
    </div>
  );
}