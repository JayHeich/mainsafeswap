// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import HomePage from './HomePage';
import RevendaPage from './RevendaPage';
import FestasPage from './FestasPage';
import FestaDetailPage from './FestasDetailPage';
import ConfirmPage from './ConfirmPage';
import Pagamento from './pagamento'; // Corrigido para P maiúsculo conforme o nome do arquivo
import Checkout from './checkout'; // Corrigido para C maiúsculo conforme o nome do arquivo
import DadosPage from './dados'; // 👈 NOVO: Importar página de dados
import AboutPage from './AboutPage';
import FAQPage from './FAQPage';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

function Cancelado() {
  return (
    <main className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Operação cancelada</h1>
        <p className="text-gray-400">Você recusou a transação.</p>
      </div>
    </main>
  );
}

function Aguardando() {
  return (
    <main className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">
          Aguardando pagamento do outro usuário
        </h1>
        <p className="text-gray-400">
          Você será notificado quando o pagamento for concluído.
        </p>
      </div>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/festas" element={<FestasPage />} />
        <Route path="/evento" element={<FestaDetailPage />} />
        <Route path="/revenda" element={<RevendaPage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/confirmar" element={<ConfirmPage />} />
        <Route path="/pagamento" element={<Pagamento />} />
        <Route path="/dados" element={<DadosPage />} /> {/* 👈 NOVO: Rota para página de dados */}
        <Route path="/cancelado" element={<Cancelado />} />
        <Route path="/aguardando" element={<Aguardando />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/faq" element={<FAQPage />} />
      </Routes>
    </Router>
  </React.StrictMode>
);