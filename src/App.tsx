import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { RoleSwitcher } from './components/common/RoleSwitcher';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { DemoAccountsModal } from './components/common/DemoAccountsModal';
import { GuidedScenarioModal } from './components/demo/GuidedScenarioModal';
import { CartModal } from './components/consumer/CartModal';
import { ComplaintModal } from './components/consumer/ComplaintModal';
import { QRCodeModal, QRDataPayload } from './components/common/QRCodeModal';
import { AIAssistantChat } from './components/ai/AIAssistantChat';

// Pages
import { LandingPage } from './pages/LandingPage';
import { Marketplace } from './pages/Marketplace';
import { AIDemandForecast } from './pages/farmer/AIDemandForecast';
import { PriceRecommendationPage } from './pages/farmer/PriceRecommendationPage';
import { DeliveryTracking } from './pages/consumer/DeliveryTracking';
import { FarmerDashboard } from './pages/farmer/FarmerDashboard';
import { AddProduceForm } from './pages/farmer/AddProduceForm';
import { FarmerEarnings } from './pages/farmer/FarmerEarnings';
import { ConsumerDashboard } from './pages/consumer/ConsumerDashboard';
import { BulkBuyerDashboard } from './pages/bulkbuyer/BulkBuyerDashboard';
import { CollectionCenterDashboard } from './pages/collection/CollectionCenterDashboard';
import { LogisticsDashboard } from './pages/logistics/LogisticsDashboard';
import { AdminDashboard } from './pages/admin/AdminDashboard';

export const AppContent: React.FC = () => {
  const { activeView, setActiveView } = useApp();

  // Modals state
  const [demoAccountsOpen, setDemoAccountsOpen] = useState(false);
  const [guidedScenarioOpen, setGuidedScenarioOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [complaintModalOpen, setComplaintModalOpen] = useState(false);
  const [complaintOrderId, setComplaintOrderId] = useState('FM1024');

  // Scanner modal state
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [sampleQRPayload, setSampleQRPayload] = useState<QRDataPayload>({
    type: 'Produce Batch',
    title: 'Tomato (Shivam Hybrid)',
    productName: 'Tomato',
    farmerName: 'Ramesh Patil',
    fpoName: 'Sahyadri Farmers Producer Co.',
    harvestDate: '25 Sept',
    quantityKg: 500,
    qualityGrade: 'Grade A',
    collectionCenter: 'Sangli Agro Collection Hub #4',
    location: 'Miraj, Sangli'
  });

  const handleOpenComplaint = (orderId: string) => {
    setComplaintOrderId(orderId);
    setComplaintModalOpen(true);
  };

  const handleOpenTracking = (orderId: string) => {
    setActiveView('delivery-tracking');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfdfc] text-slate-800">
      {/* 1. Sticky Demo Role Switcher Bar */}
      <RoleSwitcher
        onOpenDemoScenario={() => setGuidedScenarioOpen(true)}
        onOpenLoginModal={() => setDemoAccountsOpen(true)}
      />

      {/* 2. Main Navigation Bar */}
      <Navbar
        onOpenDemoAccounts={() => setDemoAccountsOpen(true)}
        onOpenGuidedScenario={() => setGuidedScenarioOpen(true)}
        onOpenCart={() => setCartOpen(true)}
        onOpenQRScanner={() => setQrModalOpen(true)}
      />

      {/* 3. Dynamic Page View */}
      <main className="flex-1">
        {activeView === 'landing' && (
          <LandingPage
            onOpenGuidedScenario={() => setGuidedScenarioOpen(true)}
            onOpenDemoAccounts={() => setDemoAccountsOpen(true)}
          />
        )}

        {activeView === 'marketplace' && (
          <Marketplace onOpenCart={() => setCartOpen(true)} />
        )}

        {activeView === 'demand-forecast' && (
          <AIDemandForecast />
        )}

        {activeView === 'price-insights' && (
          <PriceRecommendationPage />
        )}

        {activeView === 'delivery-tracking' && (
          <DeliveryTracking
            selectedOrderId="FM1024"
            onOpenComplaintModal={handleOpenComplaint}
          />
        )}

        {activeView === 'farmer-dashboard' && (
          <FarmerDashboard
            onNavigateToAddProduce={() => setActiveView('add-produce')}
            onNavigateToForecast={() => setActiveView('demand-forecast')}
            onNavigateToPricing={() => setActiveView('price-insights')}
            onNavigateToEarnings={() => setActiveView('farmer-earnings')}
          />
        )}

        {activeView === 'add-produce' && (
          <AddProduceForm
            onBackToDashboard={() => setActiveView('farmer-dashboard')}
          />
        )}

        {activeView === 'farmer-earnings' && (
          <FarmerEarnings />
        )}

        {activeView === 'consumer-dashboard' && (
          <ConsumerDashboard
            onTrackOrder={handleOpenTracking}
            onOpenComplaint={handleOpenComplaint}
          />
        )}

        {activeView === 'bulk-dashboard' && (
          <BulkBuyerDashboard
            onOpenTracking={handleOpenTracking}
          />
        )}

        {activeView === 'collection-dashboard' && (
          <CollectionCenterDashboard />
        )}

        {activeView === 'driver-dashboard' && (
          <LogisticsDashboard />
        )}

        {activeView === 'admin-dashboard' && (
          <AdminDashboard />
        )}
      </main>

      {/* 4. Footer */}
      <Footer />

      {/* 5. Interactive Floating AI Assistant Chat (Requirement 33) */}
      <AIAssistantChat />

      {/* 6. Modals */}
      <DemoAccountsModal
        isOpen={demoAccountsOpen}
        onClose={() => setDemoAccountsOpen(false)}
      />

      <GuidedScenarioModal
        isOpen={guidedScenarioOpen}
        onClose={() => setGuidedScenarioOpen(false)}
      />

      <CartModal
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onViewOrderTracking={(orderId) => {
          setActiveView('delivery-tracking');
        }}
      />

      <ComplaintModal
        isOpen={complaintModalOpen}
        onClose={() => setComplaintModalOpen(false)}
        orderId={complaintOrderId}
      />

      <QRCodeModal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        payload={sampleQRPayload}
      />
    </div>
  );
};

export default function App() {
  return <AppContent />;
}
