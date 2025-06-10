import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Configuração do Mercado Pago - PUBLIC KEY CONFIGURADA
const MERCADO_PAGO_PUBLIC_KEY = 'TEST-63319c0b-3d7e-4fd4-9a08-b97ef21fc423';

export default function Pagamento() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pixData, setPixData] = useState(null);
  const [cardFormData, setCardFormData] = useState({
    cardNumber: '',
    cardholderName: '',
    expirationMonth: '',
    expirationYear: '',
    securityCode: '',
    identificationType: 'CPF',
    identificationNumber: '',
    email: ''
  });

  // Pegar dados do state ou da URL como fallback
  const valor = location.state?.valor || parseFloat(new URLSearchParams(location.search).get('valor') || '0');
  const metodo = location.state?.metodo || new URLSearchParams(location.search).get('metodo') || 'pix';
  const festa = location.state?.festa;
  const quantidades = location.state?.quantidades;

  // Debug para verificar os dados recebidos
  useEffect(() => {
    console.log('Dados recebidos no pagamento:', {
      valor: valor,
      metodo: metodo,
      festa: festa,
      state: location.state
    });
  }, [valor, metodo, festa, location.state]);

  useEffect(() => {
    // Carregar SDK do Mercado Pago
    const script = document.createElement('script');
    script.src = 'https://sdk.mercadopago.com/js/v2';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      // Inicializar Mercado Pago quando o script carregar
      if (window.MercadoPago) {
        window.mp = new window.MercadoPago(MERCADO_PAGO_PUBLIC_KEY);
        console.log('Mercado Pago SDK carregado com sucesso!');
      }
    };

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Função para criar pagamento PIX
  const createPixPayment = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/create-pix-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transaction_amount: valor,
          description: `Ingresso para ${festa?.nome || 'festa'}`,
          payment_method_id: 'pix',
          payer: {
            email: cardFormData.email || 'cliente@email.com'
          },
          metadata: {
            festa_id: festa?.id,
            festa_nome: festa?.nome,
            quantidades: quantidades
          }
        })
      });

      const data = await response.json();
      
      if (data.point_of_interaction) {
        setPixData({
          qr_code: data.point_of_interaction.transaction_data.qr_code,
          qr_code_base64: data.point_of_interaction.transaction_data.qr_code_base64,
          payment_id: data.id
        });

        // 🆕 SIMULAÇÃO: Após 15 segundos, simular pagamento aprovado (APENAS PARA TESTES)
        // Em produção, isso será feito via webhook do Mercado Pago
        setTimeout(() => {
          console.log('Simulando pagamento PIX aprovado...');
          navigate('/dados', { 
            state: { 
              paymentId: data.id,
              status: 'approved',
              valor: valor,
              festa: festa
            } 
          });
        }, 15000); // 15 segundos para dar tempo de testar

      } else {
        setError(data.error || 'Erro ao gerar QR Code. Tente novamente.');
      }
    } catch (err) {
      setError('Erro ao gerar pagamento PIX. Verifique se o servidor está rodando.');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  // 🔧 FUNÇÃO CORRIGIDA: Processar pagamento com cartão
  const processCardPayment = async () => {
    setLoading(true);
    setError('');

    try {
      // Validar campos antes de enviar
      if (!validateCardForm()) {
        setError('Por favor, preencha todos os campos corretamente.');
        setLoading(false);
        return;
      }

      // Criar token do cartão usando SDK do Mercado Pago
      if (window.mp) {
        try {
          // Dados do cartão para criar o token
          const cardData = {
            cardNumber: cardFormData.cardNumber.replace(/\s/g, ''),
            cardholderName: cardFormData.cardholderName,
            cardExpirationMonth: String(cardFormData.expirationMonth).padStart(2, '0'),
            cardExpirationYear: `20${cardFormData.expirationYear}`,
            securityCode: cardFormData.securityCode,
            identificationType: cardFormData.identificationType,
            identificationNumber: cardFormData.identificationNumber.replace(/\D/g, '')
          };

          console.log('🔧 Dados do cartão para token:', cardData);

          const token = await window.mp.createCardToken(cardData);
          
          console.log('🎯 Token criado:', token);

          if (!token || !token.id) {
            throw new Error('Falha ao criar token do cartão');
          }

          // 🔧 CORREÇÃO: Payload limpo para o backend
          const paymentPayload = {
            token: token.id,
            transaction_amount: valor,
            description: `Ingresso para ${festa?.nome || 'festa'}`,
            installments: 1,
            // 🎯 REMOVIDO: payment_method_id fixo - deixa o MP detectar automaticamente
            // 🎯 REMOVIDO: issuer_id - pode causar conflitos
            payer: {
              email: cardFormData.email,
              identification: {
                type: cardFormData.identificationType,
                number: cardFormData.identificationNumber.replace(/\D/g, '')
              }
            },
            metadata: {
              festa_id: festa?.id,
              festa_nome: festa?.nome,
              quantidades: quantidades
            }
          };

          console.log('🚀 Enviando para backend:', paymentPayload);

          // Enviar token para o backend
          const response = await fetch('/api/process-card-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(paymentPayload)
          });

          const data = await response.json();
          
          console.log('🎯 Resposta do backend:', data);
          
          if (data.status === 'approved') {
            console.log('✅ Pagamento aprovado! Método detectado:', data.payment_method_id);
            
            // Redirecionar para /dados
            navigate('/dados', { 
              state: { 
                paymentId: data.id,
                status: data.status,
                valor: valor,
                festa: festa,
                paymentMethod: data.payment_method_id // Incluir método detectado
              } 
            });
          } else {
            setError(`Pagamento ${data.status}. ${data.message || data.status_detail || 'Tente novamente.'}`);
          }
        } catch (tokenError) {
          console.error('❌ Erro ao criar token:', tokenError);
          setError('Erro ao processar dados do cartão. Verifique as informações.');
        }
      } else {
        // Fallback se o SDK não carregar
        console.error('❌ SDK do Mercado Pago não carregado');
        setError('Erro ao carregar sistema de pagamento. Recarregue a página.');
      }
    } catch (err) {
      setError('Erro ao processar pagamento. Verifique se o servidor está rodando.');
      console.error('❌ Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  // Validar formulário do cartão
  const validateCardForm = () => {
    return (
      cardFormData.email &&
      cardFormData.cardNumber.length >= 16 &&
      cardFormData.cardholderName &&
      cardFormData.expirationMonth &&
      cardFormData.expirationYear &&
      cardFormData.securityCode.length >= 3 &&
      cardFormData.identificationNumber.length >= 11
    );
  };

  // Formatar número do cartão
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  // Renderizar formulário de PIX
  const renderPixForm = () => (
    <div className="space-y-6">
      {!pixData ? (
        <>
          <div className="text-center">
            <div className="w-20 h-20 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">📱</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Pagamento via PIX</h3>
            <p className="text-gray-400">Rápido, seguro e sem taxas adicionais</p>
          </div>

          <div className="bg-gray-700/50 rounded-lg p-4">
            <p className="text-sm text-gray-300 mb-2">Valor a pagar:</p>
            <p className="text-2xl font-bold text-teal-400">R$ {valor.toFixed(2)}</p>
          </div>

          {/* Email para PIX */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              E-mail (para receber o comprovante)
            </label>
            <input
              type="email"
              value={cardFormData.email}
              onChange={(e) => setCardFormData({...cardFormData, email: e.target.value})}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-white"
              placeholder="seu@email.com"
            />
          </div>

          <button
            onClick={createPixPayment}
            disabled={loading || valor === 0}
            className="w-full py-4 bg-teal-500 text-white font-medium rounded-lg transition-all hover:bg-teal-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Gerando PIX...' : 'Gerar código PIX'}
          </button>
        </>
      ) : (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">PIX Gerado!</h3>
            <p className="text-gray-400">Escaneie o QR Code ou copie o código</p>
          </div>

          {/* QR Code */}
          {pixData.qr_code_base64 && (
            <div className="bg-white p-4 rounded-lg mx-auto w-fit">
              <img 
                src={`data:image/png;base64,${pixData.qr_code_base64}`} 
                alt="QR Code PIX" 
                className="w-64 h-64"
              />
            </div>
          )}

          {/* Código PIX Copia e Cola */}
          <div className="space-y-2">
            <label className="text-sm text-gray-400">PIX Copia e Cola:</label>
            <div className="bg-gray-700/50 rounded-lg p-4 break-all">
              <p className="text-xs font-mono text-gray-300">{pixData.qr_code}</p>
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(pixData.qr_code)}
              className="w-full py-3 bg-gray-700 text-white font-medium rounded-lg transition-all hover:bg-gray-600"
            >
              Copiar código PIX
            </button>
          </div>

          {/* 🆕 NOVO: Botão para simular pagamento aprovado (APENAS PARA TESTES) */}
          <div className="border-t border-gray-600 pt-4">
            <p className="text-xs text-gray-400 text-center mb-3">⚠️ Modo de teste:</p>
            <button
              onClick={() => navigate('/dados', { 
                state: { 
                  paymentId: pixData.payment_id,
                  status: 'approved',
                  valor: valor,
                  festa: festa
                } 
              })}
              className="w-full py-3 bg-green-600 text-white font-medium rounded-lg transition-all hover:bg-green-500"
            >
              🧪 Simular Pagamento Aprovado
            </button>
          </div>

          <div className="text-center text-sm text-gray-400">
            <p>Após o pagamento, você será redirecionado automaticamente</p>
          </div>
        </div>
      )}
    </div>
  );

  // Renderizar formulário de cartão
  const renderCardForm = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-20 h-20 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-4xl">💳</span>
        </div>
        <h3 className="text-xl font-semibold mb-2">Pagamento com Cartão</h3>
        <p className="text-gray-400">Crédito ou débito • Aceita Visa, Master, Amex</p>
      </div>

      <div className="bg-gray-700/50 rounded-lg p-4">
        <p className="text-sm text-gray-300 mb-2">Valor a pagar:</p>
        <p className="text-2xl font-bold text-teal-400">R$ {valor.toFixed(2)}</p>
      </div>

      <div className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            E-mail
          </label>
          <input
            type="email"
            required
            value={cardFormData.email}
            onChange={(e) => setCardFormData({...cardFormData, email: e.target.value})}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-white"
            placeholder="seu@email.com"
          />
        </div>

        {/* Número do Cartão */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Número do Cartão
          </label>
          <input
            type="text"
            required
            maxLength="19"
            value={cardFormData.cardNumber}
            onChange={(e) => setCardFormData({
              ...cardFormData, 
              cardNumber: formatCardNumber(e.target.value)
            })}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-white"
            placeholder="0000 0000 0000 0000"
          />
          <p className="text-xs text-gray-400 mt-1">Aceita Visa, Mastercard, American Express</p>
        </div>

        {/* Nome no Cartão */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Nome no Cartão
          </label>
          <input
            type="text"
            required
            value={cardFormData.cardholderName}
            onChange={(e) => setCardFormData({
              ...cardFormData, 
              cardholderName: e.target.value.toUpperCase()
            })}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-white"
            placeholder="NOME COMPLETO"
          />
        </div>

        {/* Validade e CVV */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Validade
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                required
                maxLength="2"
                value={cardFormData.expirationMonth}
                onChange={(e) => setCardFormData({
                  ...cardFormData, 
                  expirationMonth: e.target.value.replace(/\D/g, '')
                })}
                className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-white"
                placeholder="MM"
              />
              <input
                type="text"
                required
                maxLength="2"
                value={cardFormData.expirationYear}
                onChange={(e) => setCardFormData({
                  ...cardFormData, 
                  expirationYear: e.target.value.replace(/\D/g, '')
                })}
                className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-white"
                placeholder="AA"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              CVV
            </label>
            <input
              type="text"
              required
              maxLength="4"
              value={cardFormData.securityCode}
              onChange={(e) => setCardFormData({
                ...cardFormData, 
                securityCode: e.target.value.replace(/\D/g, '')
              })}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-white"
              placeholder="123"
            />
          </div>
        </div>

        {/* CPF */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            CPF do Titular
          </label>
          <input
            type="text"
            required
            maxLength="14"
            value={cardFormData.identificationNumber}
            onChange={(e) => {
              let value = e.target.value.replace(/\D/g, '');
              if (value.length <= 11) {
                value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
              }
              setCardFormData({...cardFormData, identificationNumber: value});
            }}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-white"
            placeholder="000.000.000-00"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <button
        onClick={processCardPayment}
        disabled={loading || valor === 0}
        className="w-full py-4 bg-teal-500 text-white font-medium rounded-lg transition-all hover:bg-teal-400 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Processando...' : 'Finalizar Pagamento'}
      </button>

      {/* 🆕 NOVO: Botão para simular pagamento aprovado (APENAS PARA TESTES) */}
      <div className="border-t border-gray-600 pt-4">
        <p className="text-xs text-gray-400 text-center mb-3">⚠️ Modo de teste:</p>
        <button
          onClick={() => navigate('/dados', { 
            state: { 
              paymentId: 'MP-TEST-' + Date.now(),
              status: 'approved',
              valor: valor,
              festa: festa
            } 
          })}
          className="w-full py-3 bg-green-600 text-white font-medium rounded-lg transition-all hover:bg-green-500"
        >
          🧪 Simular Pagamento Aprovado
        </button>
      </div>
    </div>
  );

  // Se o valor for 0, mostrar erro
  if (valor === 0) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4 md:p-6">
        <div className="max-w-md mx-auto">
          <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6">
            <h2 className="text-xl font-bold text-red-400 mb-4">Erro no pagamento</h2>
            <p className="text-gray-300 mb-6">Nenhum valor foi informado para o pagamento.</p>
            <button 
              onClick={() => navigate(-1)} 
              className="w-full py-3 bg-teal-500 text-white font-medium rounded-lg transition-all hover:bg-teal-400"
            >
              Voltar ao checkout
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-6">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate(-1)} 
            className="text-gray-400 hover:text-white transition-colors flex items-center group"
          >
            <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            <span>Voltar</span>
          </button>
          <span className="text-xs bg-teal-500 text-white px-3 py-1 rounded-full">Pagamento Seguro</span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-1">Pagamento</h1>
          <p className="text-gray-400">Complete sua compra de forma segura</p>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
          <div className="p-6">
            {metodo === 'pix' ? renderPixForm() : renderCardForm()}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center space-x-4 text-xs text-gray-500">
          <span>Pagamento processado por</span>
          <img 
            src="https://http2.mlstatic.com/frontend-assets/mp-web-navigation/ui-navigation/5.21.22/mercadopago/logo__large@2x.png" 
            alt="Mercado Pago" 
            className="h-6 filter brightness-75"
          />
        </div>
      </div>
    </div>
  );
}