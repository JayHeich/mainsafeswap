// backend/mercadoPagoController.js
const { MercadoPagoConfig, Payment } = require('mercadopago');
const dotenv = require('dotenv');

// Carregar variáveis de ambiente
dotenv.config();

// Log para verificar se o token está carregado
console.log('=== Configuração Mercado Pago ===');
console.log('Access Token configurado:', process.env.MERCADOPAGO_ACCESS_TOKEN ? 'Sim' : 'Não');
console.log('Ambiente:', process.env.MERCADOPAGO_ACCESS_TOKEN?.startsWith('TEST-') ? 'TESTE' : 'PRODUÇÃO');

// Configurar cliente do Mercado Pago
const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN
});

// Criar instância de Payment
const payment = new Payment(client);

// Função para detectar tipo de cartão pelos primeiros dígitos
function detectCardType(cardNumber) {
  // Remove espaços e mantém apenas números
  const cleanNumber = cardNumber.replace(/\s+/g, '');
  
  // Visa: começa com 4
  if (cleanNumber.startsWith('4')) {
    return 'visa';
  }
  
  // Mastercard: começa com 5 ou 2 (novo range)
  if (cleanNumber.startsWith('5') || (cleanNumber.startsWith('2') && cleanNumber.length >= 2 && cleanNumber.substring(0, 2) >= '22' && cleanNumber.substring(0, 2) <= '27')) {
    return 'master';
  }
  
  // American Express: começa com 34 ou 37
  if (cleanNumber.startsWith('34') || cleanNumber.startsWith('37')) {
    return 'amex';
  }
  
  // Diners: começa com 30, 36, 38
  if (cleanNumber.startsWith('30') || cleanNumber.startsWith('36') || cleanNumber.startsWith('38')) {
    return 'diners';
  }
  
  // Elo: ranges específicos
  const eloRanges = ['636368', '438935', '504175', '451416', '636297', '5067', '4576', '4011'];
  for (let range of eloRanges) {
    if (cleanNumber.startsWith(range)) {
      return 'elo';
    }
  }
  
  // Hipercard: começa com 606282
  if (cleanNumber.startsWith('606282')) {
    return 'hipercard';
  }
  
  // Se não detectar, retorna null para deixar o MP detectar
  return null;
}

// Criar pagamento PIX
exports.createPixPayment = async (req, res) => {
  try {
    console.log('\n=== CRIANDO PAGAMENTO PIX ===');
    console.log('Dados recebidos:', JSON.stringify(req.body, null, 2));
    
    const { 
      transaction_amount, 
      description, 
      payer,
      metadata 
    } = req.body;

    const payment_data = {
      transaction_amount: Number(transaction_amount),
      description: description || 'Ingresso para festa',
      payment_method_id: 'pix',
      payer: {
        email: payer?.email || 'cliente@email.com'
      }
    };

    console.log('Enviando para MP:', payment_data);

    const result = await payment.create({ body: payment_data });

    console.log('PIX criado com sucesso!', result.id);

    res.json({
      id: result.id,
      status: result.status,
      status_detail: result.status_detail,
      point_of_interaction: result.point_of_interaction
    });

  } catch (error) {
    console.error('ERRO PIX:', error);
    res.status(500).json({
      error: 'Erro ao processar pagamento PIX',
      message: error.message
    });
  }
};

// Processar pagamento com cartão (CORRIGIDO)
exports.processCardPayment = async (req, res) => {
  try {
    console.log('\n=== PROCESSANDO PAGAMENTO CARTÃO ===');
    console.log('Body completo:', JSON.stringify(req.body, null, 2));
    
    const {
      token,
      transaction_amount,
      installments,
      payment_method_id,
      payer
    } = req.body;

    if (!token) {
      return res.status(400).json({
        error: 'Token não fornecido'
      });
    }

    // 🔧 CORREÇÃO: Não enviar payment_method_id fixo
    // Deixar o Mercado Pago detectar automaticamente baseado no token
    const payment_data = {
      token: token,
      transaction_amount: Number(transaction_amount),
      installments: Number(installments) || 1,
      // 🎯 REMOVIDO: payment_method_id fixo
      payer: {
        email: payer?.email || 'test@test.com',
        identification: payer?.identification ? {
          type: payer.identification.type || 'CPF',
          number: payer.identification.number
        } : undefined
      }
    };

    console.log('🔧 Enviando para Mercado Pago (SEM payment_method_id fixo):', JSON.stringify(payment_data, null, 2));

    try {
      const result = await payment.create({ body: payment_data });

      console.log('✅ PAGAMENTO CRIADO!');
      console.log('ID:', result.id);
      console.log('Status:', result.status);
      console.log('Detalhes:', result.status_detail);
      console.log('🎯 Método de pagamento detectado:', result.payment_method_id);

      // Retornar resposta de sucesso
      res.json({
        id: result.id,
        status: result.status,
        status_detail: result.status_detail,
        payment_method_id: result.payment_method_id, // Incluir o método detectado
        message: result.status === 'approved' ? 'Pagamento aprovado!' : `Pagamento ${result.status}`
      });

    } catch (mpError) {
      console.error('❌ Erro do Mercado Pago:', mpError);
      
      // Log mais detalhado do erro
      if (mpError.cause && Array.isArray(mpError.cause)) {
        mpError.cause.forEach((c, i) => {
          console.error(`Causa ${i}:`, JSON.stringify(c, null, 2));
        });
      }
      
      throw mpError;
    }

  } catch (error) {
    console.error('=== ERRO FINAL ===');
    console.error('Tipo:', error.constructor.name);
    console.error('Mensagem:', error.message);
    console.error('Código:', error.code);
    console.error('Status:', error.status);
    
    if (error.cause && Array.isArray(error.cause)) {
      error.cause.forEach((c, i) => {
        console.error(`Causa ${i}:`, c);
      });
    }
    
    // Mensagens de erro mais amigáveis
    let userMessage = 'Erro ao processar pagamento';
    
    if (error.message === 'bin_not_found') {
      userMessage = 'Cartão não reconhecido. Verifique os dados do cartão.';
    } else if (error.message === 'diff_param_bins') {
      userMessage = 'Dados do cartão incompatíveis. Verifique as informações.';
    } else if (error.message.includes('invalid_parameter')) {
      userMessage = 'Dados do cartão inválidos. Verifique as informações.';
    }
    
    res.status(error.status || 500).json({
      error: userMessage,
      message: error.message,
      cause: error.cause,
      details: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

// Webhook
exports.webhook = async (req, res) => {
  try {
    const { type, data } = req.body;
    console.log('Webhook recebido:', type);
    
    if (type === 'payment' && data?.id) {
      const result = await payment.get({ id: data.id });
      console.log('Pagamento atualizado:', result.status);
    }
    
    res.status(200).send('OK');
  } catch (error) {
    console.error('Erro webhook:', error);
    res.status(200).send('OK');
  }
};

// Verificar status
exports.checkPaymentStatus = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const result = await payment.get({ id: paymentId });
    
    res.json({
      id: result.id,
      status: result.status,
      status_detail: result.status_detail,
      payment_method_id: result.payment_method_id
    });
  } catch (error) {
    res.status(404).json({
      error: 'Pagamento não encontrado'
    });
  }
};

// Função auxiliar para mensagens de erro
function getRejectMessage(status_detail) {
  const messages = {
    'cc_rejected_bad_filled_card_number': 'Número do cartão inválido',
    'cc_rejected_bad_filled_date': 'Data de validade inválida',
    'cc_rejected_bad_filled_other': 'Dados do cartão inválidos',
    'cc_rejected_bad_filled_security_code': 'Código de segurança inválido',
    'cc_rejected_blacklist': 'Cartão não autorizado',
    'cc_rejected_call_for_authorize': 'Entre em contato com seu banco',
    'cc_rejected_card_disabled': 'Cartão desabilitado',
    'cc_rejected_duplicated_payment': 'Pagamento duplicado',
    'cc_rejected_high_risk': 'Pagamento recusado por segurança',
    'cc_rejected_insufficient_amount': 'Saldo insuficiente',
    'cc_rejected_other_reason': 'Pagamento recusado'
  };

  return messages[status_detail] || 'Pagamento não processado';
}