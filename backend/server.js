// backend/server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const routes = require('./routes');

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ================================
// 📧 CONFIGURAÇÃO DO EMAIL (OPCIONAL)
// ================================

let transporter = null;
try {
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    const nodemailer = require('nodemailer');
    transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    console.log('📧 Email configurado');
  }
} catch (error) {
  console.log('⚠️  Email não configurado (nodemailer não instalado)');
}

// ================================
// 🛠️ MIDDLEWARES
// ================================

app.use(cors({
  origin: 'http://localhost:3000', // URL do seu frontend React
  credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Log de requisições em desenvolvimento
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

// ================================
// 🌐 ROTAS
// ================================

// Rota de teste para verificar se a API está funcionando
app.get('/', (req, res) => {
  res.json({ 
    message: 'API do Mercado Pago funcionando!',
    version: '1.0.0',
    endpoints: {
      createPixPayment: 'POST /api/create-pix-payment',
      processCardPayment: 'POST /api/process-card-payment',
      sendTicket: 'POST /api/send-ticket',
      checkPaymentStatus: 'GET /api/payment-status/:paymentId',
      webhook: 'POST /api/webhooks/mercadopago'
    }
  });
});

// 📧 Rota para enviar ingresso por email (NOVA - só funciona se nodemailer estiver instalado)
app.post('/api/send-ticket', async (req, res) => {
  try {
    const { contactMethod, email, whatsapp, paymentData } = req.body;

    console.log('Enviando ingresso:', { 
      contactMethod, 
      email: email ? email.substring(0, 3) + '***' : null,
      whatsapp: whatsapp ? whatsapp.substring(0, 3) + '***' : null
    });

    // Validação básica
    if (!contactMethod || (!email && !whatsapp)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Dados incompletos' 
      });
    }

    // Se for WhatsApp, simular por enquanto
    if (contactMethod === 'whatsapp') {
      console.log(`WhatsApp ticket simulado para: ${whatsapp}`);
      return res.json({ 
        success: true, 
        message: 'Ticket enviado via WhatsApp (simulado)' 
      });
    }

    // Se for email
    if (contactMethod === 'email') {
      if (!email) {
        return res.status(400).json({ 
          success: false, 
          message: 'E-mail não fornecido' 
        });
      }

      // Se nodemailer não estiver configurado, simular
      if (!transporter) {
        console.log(`Email simulado para: ${email}`);
        return res.json({ 
          success: true, 
          message: 'Email enviado com sucesso! (simulado - configure EMAIL_USER e EMAIL_PASS no .env para envio real)',
          ticketId: `SAFE-${Date.now().toString(36).toUpperCase()}`
        });
      }

      // Gerar código do ingresso
      const ticketCode = `SAFE-${Date.now().toString(36).toUpperCase()}`;

      // Template básico do email
      const emailTemplate = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Seu Ingresso SafeSwap</title>
        </head>
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px;">
            <h1 style="color: #14b8a6; text-align: center;">SafeSwap</h1>
            <h2 style="color: #333;">🎫 Seu Ingresso Chegou!</h2>
            <p>Parabéns! Seu ingresso SafeSwap foi gerado com sucesso.</p>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <h3 style="color: #14b8a6;">Código do Ingresso</h3>
              <p style="font-family: monospace; font-size: 20px; font-weight: bold; color: #333;">${ticketCode}</p>
            </div>

            ${paymentData ? `
            <div style="background-color: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4>Detalhes do Pagamento:</h4>
              <p><strong>Evento:</strong> ${paymentData.festa?.nome || 'SafeSwap Event'}</p>
              <p><strong>Valor:</strong> R$ ${paymentData.valor ? Number(paymentData.valor).toFixed(2) : '0,00'}</p>
              <p><strong>ID Pagamento:</strong> ${paymentData.paymentId || 'N/A'}</p>
            </div>
            ` : ''}
            
            <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
              <p><strong>Informações Importantes:</strong></p>
              <ul>
                <li>Este ingresso é único e intransferível</li>
                <li>Apresente este e-mail na entrada do evento</li>
                <li>Guarde bem este comprovante</li>
              </ul>
            </div>
            
            <p style="text-align: center; color: #666; font-size: 12px; margin-top: 30px;">
              SafeSwap - Ingressos Seguros<br>
              Dúvidas: suporte@safeswap.com
            </p>
          </div>
        </body>
        </html>
      `;

      // Enviar email
      const mailOptions = {
        from: `"SafeSwap" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: '🎫 Seu Ingresso SafeSwap',
        html: emailTemplate
      };

      await transporter.sendMail(mailOptions);
      console.log(`✅ Email enviado para: ${email}`);
      
      return res.json({ 
        success: true, 
        message: 'Ingresso enviado com sucesso!',
        ticketId: ticketCode
      });
    }

  } catch (error) {
    console.error('❌ Erro ao enviar ingresso:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor',
      details: error.message
    });
  }
});

// ================================
// 🔗 USAR SUAS ROTAS ORIGINAIS
// ================================

// Usar as rotas da API (suas rotas originais do Mercado Pago)
app.use(routes);

// ================================
// 🛡️ TRATAMENTO DE ERROS
// ================================

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro:', err.stack);
  
  res.status(err.status || 500).json({ 
    error: 'Algo deu errado!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Erro interno do servidor',
    status: err.status || 500
  });
});

// Rota 404
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Rota não encontrada',
    message: `A rota ${req.method} ${req.path} não existe`
  });
});

// ================================
// 🚀 INICIALIZAÇÃO
// ================================

// Iniciar servidor
app.listen(PORT, () => {
  console.log('=================================');
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log('=================================');
  
  // Verificar se as credenciais estão configuradas
  if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
    console.warn('⚠️  AVISO: MERCADOPAGO_ACCESS_TOKEN não configurado no .env');
  } else {
    console.log('✅ Mercado Pago Access Token configurado');
  }

  if (transporter) {
    console.log('✅ Email configurado e funcionando');
  } else if (process.env.EMAIL_USER) {
    console.log('⚠️  Email parcialmente configurado (pode ter problema na senha)');
  } else {
    console.log('ℹ️  Email não configurado (funcionará em modo simulado)');
  }

  console.log('=================================');
});

// Tratamento de erros não capturados
process.on('unhandledRejection', (err) => {
  console.error('Erro não tratado:', err);
  process.exit(1);
});

module.exports = app;