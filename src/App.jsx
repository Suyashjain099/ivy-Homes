import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SavedProvider } from './context/SavedContext';

import { Navbar } from './components/common/Navbar';
import { LoginPage } from './pages/LoginPage';
import { ListingsPage } from './pages/ListingsPage';
import { ListingDetailPage } from './pages/ListingDetailPage';
import { SavedListingsPage } from './pages/SavedListingsPage';
import { RentalsProjectsPage } from './pages/RentalsProjectsPage';
import { InsightsPage } from './pages/InsightsPage';

const ProtectedLayout = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px', color: 'var(--text-muted)' }}>
        🔄 Initializing application...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/listings" element={<ListingsPage />} />
          <Route path="/listings/:id" element={<ListingDetailPage />} />
          <Route path="/saved" element={<SavedListingsPage />} />
          <Route path="/rentals-projects" element={<RentalsProjectsPage />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="*" element={<Navigate to="/listings" replace />} />
        </Routes>
      </main>
    </>
  );
};

export function App() {
  return (
    <AuthProvider>
      <SavedProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/*" element={<ProtectedLayout />} />
          </Routes>
        </BrowserRouter>
      </SavedProvider>
    </AuthProvider>
  );
}

export default App;
