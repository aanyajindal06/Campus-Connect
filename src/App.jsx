import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { EventProvider, useEvents } from './context/EventContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Toast } from './components/common/Toast';
import { RegistrationModal } from './components/events/RegistrationModal';
import { HomePage } from './pages/HomePage';
import { EventDetailPage } from './pages/EventDetailPage';
import { MyRegistrationsPage } from './pages/MyRegistrationsPage';
import { SavedEventsPage } from './pages/SavedEventsPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { NotFoundPage } from './pages/NotFoundPage';

function AppContent() {
  const { isRegistrationModalOpen, closeRegistrationModal, registrationModalEvent } = useEvents();

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900 selection:bg-gold-500 selection:text-white">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />
          <Route path="/my-events" element={<MyRegistrationsPage />} />
          <Route path="/bookmarks" element={<SavedEventsPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
      <Toast />
      <RegistrationModal
        isOpen={isRegistrationModalOpen}
        onClose={closeRegistrationModal}
        preselectedEvent={registrationModalEvent}
      />
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <EventProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </EventProvider>
    </AuthProvider>
  );
}

export default App;
