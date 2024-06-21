import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import PaymentHistory from './pages/PaymentHistory';
import SavingsGraph from './components/SavingsGraph';
import Chatbot from './components/Chatbot';
import Recommendation from './components/Recommendation';

import Budget from './pages/Budget';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/payment-history" element={<PaymentHistory />} />
        <Route path="/payment-history/savings" element={<SavingsGraph />} />
        <Route path="/budget-saving" element={<Budget />} />
        <Route path="/ai-chatbot" element={<Chatbot />} /> 
        <Route path="/recommendation" element={<Recommendation />} />
      </Routes>
    </Router>
  );
};

export default App;
