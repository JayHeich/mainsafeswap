import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const DadosPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [contactMethod, setContactMethod] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1: entrada de dados, 2: confirmação, 3: sucesso
  const [paymentData, setPaymentData] = useState(null);

  // Capturar dados do pagamento da URL ou state
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const paymentId = urlParams.get('payment_id') || location.state?.paymentId;
    const status = urlParams.get('status') || location.state?.status;
    const valor = location.state?.valor;
    const festa = location.state?.festa;

    if (paymentId && status) {
      setPaymentData({
        paymentId,
        status,
        valor,
        festa
      });
      
      // Se não há dados de pagamento válidos, redirecionar para home
      if (status !== 'approved') {
        console.warn('Status do pagamento não é aprovado:', status);
        navigate('/', { replace: true });
      }
    } else {
      // Se não há dados de pagamento, usar dados simulados para desenvolvimento
      const mockPaymentData = {
        paymentId: 'MP-12345678',
        status: 'approved',
        valor: 150.00,
        festa: {
          nome: 'Festa de Verão 2025'
        }
      };
      setPaymentData(mockPaymentData);
    }
  }, [location, navigate]);

  // Phone input mask para formato brasileiro (DDD + 9 dígitos)
  const formatWhatsAppNumber = (input) => {
    const numericInput = input.replace(/\D/g, '');
    
    if (numericInput.length <= 2) {
      return numericInput;
    } else if (numericInput.length <= 7) {
      return `(${numericInput.slice(0, 2)}) ${numericInput.slice(2)}`;
    } else {
      return `(${numericInput.slice(0, 2)}) ${numericInput.slice(2, 7)}-${numericInput.slice(7, 11)}`;
    }
  };

  const handleWhatsAppChange = (e) => {
    setWhatsapp(formatWhatsAppNumber(e.target.value));
  };

  // Validação de e-mail
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  
  // Validação de WhatsApp (DDD + 9 dígitos = 11 dígitos no total)
  const validateWhatsApp = (number) => {
    const numericOnly = number.replace(/\D/g, '');
    return numericOnly.length === 11;
  };

  // Função para ir para a etapa de confirmação
  const handleProceedToConfirmation = () => {
    setError('');
    
    if (contactMethod === 'email') {
      if (!validateEmail(email)) {
        setError('Por favor, insira um e-mail válido');
        return;
      }
    } else if (contactMethod === 'whatsapp') {
      if (!validateWhatsApp(whatsapp)) {
        setError('Por favor, insira um número de WhatsApp válido com DDD + 9 dígitos');
        return;
      }
    } else {
      setError('Por favor, selecione um método de contato');
      return;
    }
    
    setStep(2);
  };

  // 🔧 CORREÇÃO: Função para enviar os dados para o backend (PORTA CORRIGIDA)
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');
    
    try {
      console.log('Enviando dados para backend...', {
        contactMethod,
        email: email || null,
        whatsapp: whatsapp || null,
        paymentData
      });

      // 🎯 CORREÇÃO: Porta alterada de 5000 para 3001
      const response = await fetch('http://localhost:3001/api/send-ticket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contactMethod,
          email: contactMethod === 'email' ? email : null,
          whatsapp: contactMethod === 'whatsapp' ? whatsapp : null,
          paymentData: paymentData // Incluir dados do pagamento
        }),
      });

      console.log('Resposta do servidor:', response.status);

      // Verificar se a resposta é válida
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log('Dados recebidos:', data);

      if (data.success) {
        setStep(3);
      } else {
        setError(data.message || 'Erro ao enviar ingresso');
      }
    } catch (error) {
      console.error('Erro ao conectar com o servidor:', error);
      
      // Mensagem de erro mais específica
      if (error.message.includes('fetch')) {
        setError('Erro de conexão. Verifique se o servidor backend está rodando na porta 3001.');
      } else {
        setError('Erro de conexão. Verifique se o servidor está rodando.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Função para voltar para edição dos dados
  const handleBackToEdit = () => {
    setStep(1);
    setError('');
  };

  // Função para reiniciar o processo
  const handleReset = () => {
    navigate('/');
  };

  // Se não há dados de pagamento, mostrar loading
  if (!paymentData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-400 mx-auto mb-4"></div>
          <p>Validando pagamento...</p>
        </div>
      </div>
    );
  }
  
  // =================== TELA DE SUCESSO ===================
  if (step === 3) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-700">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-teal-500/20 rounded-full mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Ingresso enviado!</h2>
            <p className="text-teal-400 text-lg">
              Seu ingresso foi enviado com sucesso.
            </p>
            
            {/* Informações do pagamento */}
            <div className="mt-6 p-4 rounded-xl bg-gray-750 border border-gray-700">
              <p className="text-gray-300 text-sm mb-2">
                <strong>Pagamento:</strong> #{paymentData.paymentId}
              </p>
              {paymentData.valor && (
                <p className="text-gray-300 text-sm mb-2">
                  <strong>Valor:</strong> R$ {paymentData.valor.toFixed(2)}
                </p>
              )}
              {paymentData.festa?.nome && (
                <p className="text-gray-300 text-sm">
                  <strong>Evento:</strong> {paymentData.festa.nome}
                </p>
              )}
            </div>
            
            <div className="mt-6 p-4 rounded-xl bg-gray-750 border border-gray-700">
              <p className="text-gray-300">
                {contactMethod === 'email' 
                  ? (
                      <>
                        <span className="text-teal-400">📧</span> Verifique sua caixa de entrada!<br />
                        <span className="text-sm">Enviamos seu ingresso para: <strong>{email}</strong></span>
                      </>
                    )
                  : (
                      <>
                        <span className="text-teal-400">📱</span> Ingresso enviado via WhatsApp!<br />
                        <span className="text-sm">Número: <strong>{whatsapp}</strong></span>
                      </>
                    )}
              </p>
            </div>
            
            {contactMethod === 'email' && (
              <div className="mt-4 p-3 bg-blue-900/30 border border-blue-700 rounded-lg">
                <p className="text-blue-200 text-sm">
                  💡 <strong>Dica:</strong> Verifique também sua pasta de spam ou lixo eletrônico
                </p>
              </div>
            )}
          </div>
          
          <div className="mt-10">
            <button 
              onClick={handleReset}
              className="w-full py-4 bg-teal-500 hover:bg-teal-400 text-white font-medium rounded-lg transition-all duration-300 flex items-center justify-center"
            >
              <span>Voltar ao início</span>
            </button>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-700">
            <p className="text-gray-400 text-center text-sm">
              Qualquer dúvida, entre em contato: <span className="text-teal-400">suporte@safeswap.com</span>
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  // =================== TELA DE CONFIRMAÇÃO ===================
  if (step === 2) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-700">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-500/20 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Confirme seus dados</h2>
            <p className="text-gray-300">
              Verifique se as informações abaixo estão corretas
            </p>
          </div>
          
          <div className="bg-gray-750 rounded-xl p-5 mb-8 border border-gray-700">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-teal-500/20 flex items-center justify-center mr-3">
                {contactMethod === 'email' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                )}
              </div>
              <div>
                <p className="text-gray-400 text-sm">Método de contato</p>
                <p className="text-white font-medium">{contactMethod === 'email' ? 'E-mail' : 'WhatsApp'}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-teal-500/20 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-gray-400 text-sm">{contactMethod === 'email' ? 'Seu e-mail' : 'Seu WhatsApp'}</p>
                <p className="text-white font-medium break-words">{contactMethod === 'email' ? email : whatsapp}</p>
              </div>
            </div>
          </div>
          
          {error && (
            <div className="mb-6 p-3 bg-red-900/50 border border-red-700 rounded-lg">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <button
              onClick={handleBackToEdit}
              className="py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-all duration-300 flex items-center justify-center border border-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Editar
            </button>
            
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="py-3 px-4 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all duration-300 flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enviando...
                </>
              ) : (
                <>
                  Confirmar e Enviar
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =================== TELA INICIAL (SELEÇÃO DE CONTATO) ===================
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-700">
        {/* Botão voltar */}
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => navigate(-1)} 
            className="text-gray-400 hover:text-white transition-colors flex items-center group"
          >
            <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            <span>Voltar</span>
          </button>
          <span className="text-xs bg-green-500 text-white px-3 py-1 rounded-full">Pagamento Aprovado ✓</span>
        </div>

        {/* Logo e Cabeçalho */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <span className="text-white text-4xl font-bold">Safe</span>
            <span className="text-teal-400 text-4xl font-bold">Swap</span>
          </div>
          <p className="text-gray-300 mb-6">
            Seu pagamento foi aprovado! Agora informe como deseja receber seu ingresso.
          </p>
          
          {/* Resumo do pagamento */}
          {paymentData && (
            <div className="bg-gray-700/50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-400 mb-2">Pagamento aprovado:</p>
              <p className="text-xl font-bold text-green-400">
                {paymentData.valor ? `R$ ${paymentData.valor.toFixed(2)}` : 'Valor aprovado'}
              </p>
              {paymentData.festa?.nome && (
                <p className="text-sm text-gray-300 mt-2">{paymentData.festa.nome}</p>
              )}
            </div>
          )}
        </div>

        {/* Seleção do Método de Contato */}
        <div className="mb-8">
          <div className="block text-gray-300 text-sm font-medium mb-3">Escolha como receber seu ingresso:</div>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              className={`flex items-center justify-center p-4 rounded-lg border ${
                contactMethod === 'email'
                  ? 'bg-teal-500/20 border-teal-500/40 text-white'
                  : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-650'
              } transition-all duration-200`}
              onClick={() => setContactMethod('email')}
            >
              <div className="flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="font-medium">E-mail</span>
              </div>
            </button>
            <button
              type="button"
              className={`flex items-center justify-center p-4 rounded-lg border ${
                contactMethod === 'whatsapp'
                  ? 'bg-teal-500/20 border-teal-500/40 text-white'
                  : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-650'
              } transition-all duration-200`}
              onClick={() => setContactMethod('whatsapp')}
            >
              <div className="flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span className="font-medium">WhatsApp</span>
              </div>
            </button>
          </div>
        </div>

        {/* Campos de Entrada */}
        {contactMethod === 'email' && (
          <div className="mb-6">
            <div className="block text-gray-300 text-sm font-medium mb-2">Seu e-mail</div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <input
                type="email"
                className="pl-10 w-full py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 text-white placeholder-gray-400"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
        )}

        {contactMethod === 'whatsapp' && (
          <div className="mb-6">
            <div className="block text-gray-300 text-sm font-medium mb-2">Seu número de WhatsApp</div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <input
                type="tel"
                className="pl-10 w-full py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 text-white placeholder-gray-400"
                placeholder="(11) 99999-9999"
                value={whatsapp}
                onChange={handleWhatsAppChange}
                maxLength={15}
              />
            </div>
            <p className="mt-2 text-xs text-gray-400">Formato: (DDD) + 9 dígitos</p>
          </div>
        )}

        {/* Mensagem de Erro */}
        {error && (
          <div className="mb-6 p-3 bg-red-900/50 border border-red-700 rounded-lg">
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}

        {/* Botão Continuar */}
        <button
          onClick={handleProceedToConfirmation}
          disabled={!contactMethod}
          className={`w-full py-4 rounded-lg flex items-center justify-center font-medium ${
            !contactMethod 
              ? 'bg-gray-700 cursor-not-allowed text-gray-500' 
              : 'bg-teal-500 hover:bg-teal-400 text-white'
          } transition-colors duration-300`}
        >
          Continuar
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Rodapé */}
        <div className="mt-8 pt-6 border-t border-gray-700">
          <p className="text-gray-400 text-xs text-center">
            Ao continuar, você concorda com nossos <button className="text-teal-400 hover:underline">Termos de Uso</button> e <button className="text-teal-400 hover:underline">Política de Privacidade</button>.
          </p>
        </div>
      </div>

      {/* Logo da marca no rodapé */}
      <div className="fixed bottom-4 left-0 w-full flex justify-center">
        <div className="text-gray-500 text-sm font-bold">
          <span className="text-white">Safe</span><span className="text-teal-400">Swap</span>
        </div>
      </div>
    </div>
  );
};

export default DadosPage;