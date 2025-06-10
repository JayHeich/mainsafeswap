import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function FAQPage() {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('compradores');
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFaqData, setFilteredFaqData] = useState({});

  useEffect(() => {
    // Efeito de entrada suave
    setIsLoaded(true);
    
    // Inicialização do FAQ filtrado
    setFilteredFaqData(faqData);
  }, []);

  // Atualiza os resultados da pesquisa quando o texto ou a aba ativa mudam
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredFaqData(faqData);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = {};

    Object.keys(faqData).forEach(category => {
      filtered[category] = faqData[category].filter(item => 
        item.question.toLowerCase().includes(query) || 
        item.answer.toLowerCase().includes(query)
      );
    });

    setFilteredFaqData(filtered);
  }, [searchQuery, activeTab]);

  const toggleQuestion = (id) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      // Já estamos filtrando em tempo real, então não precisamos fazer nada extra aqui
      e.preventDefault();
    }
  };

  // Dados do FAQ organizados por categoria
  const faqData = {
    organizadores: [
      {
        id: 'org1',
        question: 'Como posso cadastrar meu evento na plataforma da SafeSwap?',
        answer: 'Basta entrar em contato com nossa equipe pelo e-mail <a href="mailto:atendimento@safeswapbr.com" class="text-teal-400 hover:underline">atendimento@safeswapbr.com</a>. Teremos o prazer em auxiliá-lo no processo de cadastro.'
      },
      {
        id: 'org2',
        question: 'A SafeSwap cobra alguma taxa sobre os ingressos vendidos?',
        answer: 'Não cobramos taxa de saque para organizadores. A única cobrança é uma taxa de processamento de <span class="font-bold text-teal-400">5% paga pelo consumidor</span>, sem custos adicionais para a organização do evento.'
      },
      {
        id: 'org3',
        question: 'O que é o "Bônus SafeSwap"?',
        answer: 'Trata-se de um incentivo financeiro oferecido a organizadores como forma de reconhecimento pela preferência pela nossa plataforma.'
      },
      {
        id: 'org4',
        question: 'A plataforma permite o acompanhamento em tempo real das vendas?',
        answer: 'Sim. Organizadores têm acesso a um painel completo com informações em tempo real sobre ingressos vendidos e receita gerada.'
      },
      {
        id: 'org5',
        question: 'Como é realizado o repasse dos valores arrecadados?',
        answer: 'Os valores das vendas são depositados diretamente na conta da agência responsável assim que a compra é efetuada. Além disso, o organizador ainda recebe o Bônus SafeSwap posteriormente.'
      }
    ],
    compradores: [
      {
        id: 'comp1',
        question: 'Como posso encontrar festas disponíveis para o próximo final de semana?',
        answer: 'Em nossa página de eventos, é possível <span class="font-bold text-teal-400">filtrar por data, local e faixa de preço</span>, facilitando a busca por eventos que atendam às suas preferências.'
      },
      {
        id: 'comp2',
        question: 'É possível transferir meu ingresso para outra pessoa após a compra?',
        answer: 'Sim. Nossa plataforma intermedia a revenda com segurança, protegendo ambas as partes envolvidas na transação.'
      },
      {
        id: 'comp3',
        question: 'A SafeSwap oferece suporte em caso de problemas com minha compra?',
        answer: 'Sim. Nosso atendimento está disponível por <span class="font-bold text-teal-400">WhatsApp</span> no número <a href="https://wa.me/5511933478389" class="text-teal-400 hover:underline">(11) 93347-8389</a> ou por <span class="font-bold text-teal-400">e-mail</span> em <a href="mailto:atendimento@safeswapbr.com" class="text-teal-400 hover:underline">atendimento@safeswapbr.com</a>.'
      },
      {
        id: 'comp4',
        question: 'Como sei se o ingresso que estou comprando é legítimo?',
        answer: 'Todos os ingressos vendidos pela SafeSwap passam por nossa verificação de autenticidade. Além disso, oferecemos garantia total em caso de qualquer problema com seu ingresso.'
      },
      {
        id: 'comp5',
        question: 'Quais formas de pagamento são aceitas?',
        answer: 'Aceitamos cartões de crédito, débito, PIX e boleto bancário para maior conveniência dos nossos usuários.'
      }
    ]
  };

  // Renderizar as perguntas e respostas
  const renderFAQItems = (category) => {
    if (!filteredFaqData[category] || filteredFaqData[category].length === 0) {
      return (
        <div className="text-center py-8 text-gray-400">
          <p>Nenhuma pergunta encontrada para sua busca.</p>
          <p className="mt-2 text-sm">Tente outros termos ou entre em contato conosco.</p>
        </div>
      );
    }

    return filteredFaqData[category].map((item) => (
      <div 
        key={item.id}
        className={`bg-[#1e293b]/80 backdrop-blur-sm rounded-xl overflow-hidden border border-[#3ddad7]/10 shadow-lg transition-all duration-300 ${expandedQuestions[item.id] ? 'shadow-cyan-500/10' : ''} mb-4`}
      >
        <button
          onClick={() => toggleQuestion(item.id)}
          className="w-full text-left p-5 flex justify-between items-center hover:bg-[#3ddad7]/10 transition-all duration-300"
        >
          <span className="text-white font-medium pr-6">{item.question}</span>
          <div className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-teal-400 to-cyan-500 text-white font-bold transition-transform duration-300 ${expandedQuestions[item.id] ? 'rotate-45' : ''}`}>
            {expandedQuestions[item.id] ? '×' : '+'}
          </div>
        </button>
        <div 
          className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedQuestions[item.id] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
        >
          <div className="p-5 border-t border-[#3ddad7]/10 bg-[#0f172a]/80 text-gray-300" dangerouslySetInnerHTML={{ __html: item.answer }}></div>
        </div>
      </div>
    ));
  };

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
        {/* Botão de volta no canto esquerdo com seta */}
        <div className="w-full max-w-4xl mx-auto mb-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-teal-400 hover:text-teal-300 transition-all duration-300 group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-lg font-medium">Voltar ao início</span>
          </button>
        </div>

        <div className="w-full max-w-4xl mx-auto">
          {/* Logo centralizado */}
          <div className="flex justify-center mb-4">
            <img
              src="/logo.png.jpg"
              alt="Safeswap Logo"
              className="h-16 w-16 rounded-xl shadow-lg"
            />
          </div>
          
          {/* Seção de título com ícone de FAQ */}
          <div className="flex flex-col items-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500">
                Perguntas Frequentes
              </span>
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full mb-2"></div>
            <p className="text-gray-300 text-center max-w-2xl mt-4">
              Encontre respostas para as dúvidas mais comuns sobre a SafeSwap.
            </p>
          </div>

          {/* Tabs de navegação */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex p-1 rounded-xl bg-[#1e293b]/50 backdrop-blur-sm border border-[#3ddad7]/10">
              <button
                className={`py-2 px-6 rounded-lg font-medium transition-all duration-300 ${activeTab === 'compradores' 
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg' 
                  : 'text-gray-300 hover:text-white hover:bg-[#3ddad7]/10'}`}
                onClick={() => setActiveTab('compradores')}
              >
                🧑‍🎤 Compradores
              </button>
              <button
                className={`py-2 px-6 rounded-lg font-medium transition-all duration-300 ${activeTab === 'organizadores' 
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg' 
                  : 'text-gray-300 hover:text-white hover:bg-[#3ddad7]/10'}`}
                onClick={() => setActiveTab('organizadores')}
              >
                🧑‍💼 Organizadores
              </button>
            </div>
          </div>

          {/* Barra de pesquisa animada */}
          <div className="relative mb-10">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ filter: 'none', backdropFilter: 'none' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input 
              type="text" 
              placeholder="Buscar uma pergunta..."
              className="w-full py-3 pl-12 pr-4 bg-[#1e293b]/50 backdrop-blur-sm border border-[#3ddad7]/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              value={searchQuery}
              onChange={handleSearch}
              onKeyPress={handleKeyPress}
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <span className="text-xs text-gray-400">Pressione Enter para buscar</span>
            </div>
          </div>

          {/* Conteúdo do FAQ */}
          <div className="bg-[#1e293b]/30 backdrop-blur-md rounded-2xl border border-[#3ddad7]/10 shadow-xl p-6 md:p-8">
            {/* Título da seção */}
            <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
              <span className="text-2xl">{activeTab === 'compradores' ? '🧑‍🎤' : '🧑‍💼'}</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500">
                Dúvidas de {activeTab === 'compradores' ? 'Compradores de Ingressos' : 'Organizadores de Eventos'}
              </span>
            </h2>
            
            {/* Perguntas e respostas */}
            <div className="space-y-4">
              {renderFAQItems(activeTab)}
            </div>

            {/* Seção de "Não encontrou sua pergunta?" */}
            <div className="mt-10 py-6 px-6 bg-[#0f172a]/80 rounded-xl border border-[#3ddad7]/10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Não encontrou o que procurava?</h3>
                <p className="text-gray-400 text-sm">Nossa equipe está pronta para ajudar com qualquer dúvida adicional.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a 
                  href="https://wa.me/5511933478389" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  WhatsApp
                </a>
                <a 
                  href="mailto:atendimento@safeswapbr.com" 
                  className="bg-[#3ddad7]/10 hover:bg-[#3ddad7]/20 text-[#3ddad7] px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  E-mail
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-sm text-[#94a3b8] border-t border-[#1e293b] py-6 px-4 mt-12 bg-[#0f172a]">
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
              <a href="https://instagram.com/safeswap_" target="_blank" rel="noopener noreferrer" className="text-[#3ddad7] hover:underline font-medium">safeswap_</a>
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