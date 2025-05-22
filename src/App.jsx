
    import React from 'react';
    import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
    import LoginPage from '@/pages/LoginPage';
    import AdminDashboard from '@/pages/AdminDashboard';
    import SellerDashboard from '@/pages/SellerDashboard';
    import { Toaster } from '@/components/ui/toaster';
    import { AuthProvider, useAuth } from '@/contexts/AuthContext';

    const ProtectedRoute = ({ children, allowedRoles }) => {
      const { user } = useAuth();
      if (!user) {
        return <Navigate to="/login" />;
      }
      if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to={user.role === 'admin' ? '/admin' : '/seller'} />;
      }
      return children;
    };

    function App() {
      return (
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-slate-50 flex flex-col">
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/seller" 
                  element={
                    <ProtectedRoute allowedRoles={['seller']}>
                      <SellerDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/" element={<NavigateToDashboard />} />
              </Routes>
              <Toaster />
            </div>
          </Router>
        </AuthProvider>
      );
    }

    const NavigateToDashboard = () => {
      const { user } = useAuth();
      if (user) {
        return <Navigate to={user.role === 'admin' ? '/admin' : '/seller'} />;
      }
      return <Navigate to="/login" />;
    };

    export default App;
  