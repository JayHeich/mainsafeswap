// backend/routes.js
const express = require('express');
const router = express.Router();
const mercadoPagoController = require('./mercadoPagoController');

// Middleware para validar requisições
const validatePaymentRequest = (req, res, next) => {
  const { transaction_amount } = req.body;
  
  if (!transaction_amount || transaction_amount <= 0) {
    return res.status(400).json({
      error: 'Valor inválido',
      message: 'O valor da transação deve ser maior que zero'
    });
  }
  
  next();
};

// Rotas da API do Mercado Pago
router.post('/api/create-pix-payment', validatePaymentRequest, mercadoPagoController.createPixPayment);
router.post('/api/process-card-payment', validatePaymentRequest, mercadoPagoController.processCardPayment);
router.post('/api/webhooks/mercadopago', mercadoPagoController.webhook);
router.get('/api/payment-status/:paymentId', mercadoPagoController.checkPaymentStatus);

// Rota de teste da API
router.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API funcionando corretamente!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Rota para verificar configuração
router.get('/api/config/check', (req, res) => {
  const hasAccessToken = !!process.env.MERCADOPAGO_ACCESS_TOKEN;
  const hasPublicKey = !!process.env.MERCADOPAGO_PUBLIC_KEY;
  
  res.json({
    configured: hasAccessToken && hasPublicKey,
    accessToken: hasAccessToken ? 'Configurado' : 'Não configurado',
    publicKey: hasPublicKey ? 'Configurado' : 'Não configurado',
    tokenPreview: process.env.MERCADOPAGO_ACCESS_TOKEN ? 
      process.env.MERCADOPAGO_ACCESS_TOKEN.substring(0, 20) + '...' : 
      'Não configurado',
    message: hasAccessToken && hasPublicKey 
      ? 'Mercado Pago configurado corretamente!' 
      : 'Configure as credenciais no arquivo .env'
  });
});

// Rota de teste simples para pagamento
router.post('/api/test-payment-simple', async (req, res) => {
  try {
    const { MercadoPagoConfig, Payment } = require('mercadopago');
    
    console.log('=== TESTE DE PAGAMENTO SIMPLES ===');
    
    const client = new MercadoPagoConfig({ 
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN
    });
    
    const payment = new Payment(client);
    
    const testData = {
      transaction_amount: 100,
      token: req.body.token,
      description: 'Test Payment',
      installments: 1,
      payment_method_id: req.body.payment_method_id || 'visa',
      payer: {
        email: 'test@test.com',
        first_name: 'Test',
        last_name: 'User',
        identification: {
          type: 'CPF',
          number: '12345678909'
        }
      }
    };
    
    console.log('Dados de teste:', JSON.stringify(testData, null, 2));
    
    const result = await payment.create({ body: testData });
    
    console.log('Resultado:', result);
    
    res.json({
      success: true,
      result: result
    });
  } catch (error) {
    console.error('Erro no teste simples:', error);
    console.error('Detalhes:', JSON.stringify(error, null, 2));
    
    res.status(500).json({ 
      error: error.message,
      details: error.cause || error
    });
  }
});

// Rota para testar conexão com Mercado Pago
router.get('/api/test-mp-connection', async (req, res) => {
  try {
    const { MercadoPagoConfig, Payment } = require('mercadopago');
    
    const client = new MercadoPagoConfig({ 
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN
    });
    
    // Testar se consegue criar uma instância
    const payment = new Payment(client);
    
    res.json({
      success: true,
      message: 'Conexão com Mercado Pago estabelecida',
      tokenConfigured: !!process.env.MERCADOPAGO_ACCESS_TOKEN
    });
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao conectar com Mercado Pago',
      message: error.message
    });
  }
});

// Rota para testar token diretamente
router.post('/api/test-token', async (req, res) => {
  try {
    const { MercadoPagoConfig, Payment } = require('mercadopago');
    
    console.log('=== TESTE DIRETO DE TOKEN ===');
    console.log('Token recebido:', req.body.token);
    
    const client = new MercadoPagoConfig({ 
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN
    });
    
    const payment = new Payment(client);
    
    // Pagamento mínimo para teste
    const testData = {
      token: req.body.token,
      transaction_amount: 100,
      description: 'Teste de Token',
      installments: 1,
      payment_method_id: 'visa',
      payer: {
        email: 'test@test.com'
      }
    };
    
    console.log('Testando com dados:', testData);
    
    const result = await payment.create({ body: testData });
    
    res.json({
      success: true,
      status: result.status,
      id: result.id,
      detail: result.status_detail
    });
  } catch (error) {
    console.error('Erro no teste de token:', error);
    res.status(500).json({ 
      error: error.message,
      cause: error.cause
    });
  }
});

// Rota super simples para teste direto
router.post('/api/test-simple-payment', async (req, res) => {
  try {
    const { MercadoPagoConfig, Payment } = require('mercadopago');
    
    const client = new MercadoPagoConfig({ 
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN
    });
    
    const payment = new Payment(client);
    
    // Dados mínimos absolutos
    const result = await payment.create({ 
      body: {
        token: req.body.token,
        transaction_amount: 100,
        installments: 1,
        payer: {
          email: 'test@test.com'
        }
      }
    });
    
    res.json({
      success: true,
      id: result.id,
      status: result.status
    });
  } catch (error) {
    console.error('Erro teste simples:', error);
    res.status(500).json({ 
      error: error.message,
      cause: error.cause
    });
  }
});

module.exports = router;