
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';

import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import StoreSetupWizard from './pages/StoreSetupWizard';
import PublicStore from './pages/PublicStore';
import ProductEditor from './pages/ProductEditor';
import AdminDashboard from './pages/AdminDashboard';
import StoreSettings from './pages/StoreSettings';
import { Login, Register } from './pages/Auth';
import { Terms, Disclaimer, Privacy } from './pages/Legal';

const App: React.FC = () => {
  React.useEffect(() => {
    // Hydrate local cache from Supabase on load
    import('./services/mockDb').then(({ mockDb }) => {
      mockDb.syncWithCloud();
    });
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/setup" element={<StoreSetupWizard />} />
            <Route path="/settings" element={<StoreSettings />} />
            <Route path="/products/new" element={<ProductEditor />} />
            <Route path="/products/:id" element={<ProductEditor />} />
            <Route path="/s/:storeName" element={<PublicStore />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};


export default App;
