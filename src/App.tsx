import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BackgroundProvider } from './context/BackgroundContext';
import { FacilityProvider } from './context/FacilityContext';
import { UserProvider } from './context/UserContext';
import { BackgroundWrapper } from './components/BackgroundWrapper';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { UserDashboard } from './pages/UserDashboard';
import { OwnerDashboard } from './pages/OwnerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { FacilityDetailPage } from './pages/FacilityDetailPage';

function App() {
  return (
    <AuthProvider>
      <BackgroundProvider>
        <FacilityProvider>
          <UserProvider>
            <Router>
              <BackgroundWrapper>
                <div className="App">
                  <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login/:role" element={<LoginPage />} />
                    
                    <Route 
                      path="/dashboard/user" 
                      element={
                        <ProtectedRoute requiredRole="user">
                          <UserDashboard />
                        </ProtectedRoute>
                      } 
                    />
                    
                    <Route 
                      path="/dashboard/owner" 
                      element={
                        <ProtectedRoute requiredRole="owner">
                          <OwnerDashboard />
                        </ProtectedRoute>
                      } 
                    />
                    
                    <Route 
                      path="/dashboard/admin" 
                      element={
                        <ProtectedRoute requiredRole="admin">
                          <AdminDashboard />
                        </ProtectedRoute>
                      } 
                    />
                    
                    <Route 
                      path="/facility/:id" 
                      element={
                        <ProtectedRoute requiredRole="user">
                          <FacilityDetailPage />
                        </ProtectedRoute>
                      } 
                    />
                  </Routes>
                </div>
              </BackgroundWrapper>
            </Router>
          </UserProvider>
        </FacilityProvider>
      </BackgroundProvider>
    </AuthProvider>
  );
}

export default App;