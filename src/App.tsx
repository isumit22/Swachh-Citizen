import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Login from './pages/Login';
import RewardsPage from "./pages/RewardsPage";
import CitizenDashboard from './pages/CitizenDashboard';
import WorkerDashboard from './pages/WorkerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import WasteScanner from './pages/WasteScanner';
import TrainingModule from './pages/TrainingModule';
import CommunityPage from './pages/CommunityPage';
import ComlaintPage from './pages/ComplaintPage';
import MapTracking from './pages/MapTracking';
import FacilityLocator from './pages/FacilityLocator';
import ProfilePage from './pages/ProfilePage';  // ✅ NEW PAGE
import { UserProvider } from './context/UserContext';
import { NotificationProvider } from './context/NotificationContext';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  // ✅ Check token & role whenever App loads
  useEffect(() => {
    const token = localStorage.getItem("swachh_token");
    const user = localStorage.getItem("swachh_user");

    setIsAuthenticated(!!token);
    if (user) {
      const parsedUser = JSON.parse(user);
      setUserRole(parsedUser.role);
    }
  }, []);

  // ✅ Listen for token/role changes
  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem("swachh_token");
      const user = localStorage.getItem("swachh_user");

      setIsAuthenticated(!!token);
      if (user) {
        const parsedUser = JSON.parse(user);
        setUserRole(parsedUser.role);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // ✅ Decide dashboard based on role
  const getDashboardPath = () => {
    switch (userRole) {
      case "admin":
        return "/admin-dashboard";
      case "worker":
        return "/worker-dashboard";
      default:
        return "/dashboard"; // citizen
    }
  };

  return (
    <UserProvider>
      <NotificationProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
            {isAuthenticated && <Header />}
            <Routes>
              {/* Auth Route */}
              <Route
                path="/login"
                element={!isAuthenticated ? <Login /> : <Navigate to={getDashboardPath()} />}
              />

              {/* Citizen / Worker / Admin Routes */}
              <Route path="/dashboard" element={isAuthenticated ? <CitizenDashboard /> : <Navigate to="/login" />} />
              <Route path="/worker-dashboard" element={isAuthenticated ? <WorkerDashboard /> : <Navigate to="/login" />} />
              <Route path="/admin-dashboard" element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/login" />} />
              
              {/* Tools / Features */}
              <Route path="/scanner" element={isAuthenticated ? <WasteScanner /> : <Navigate to="/login" />} />
              <Route path="/training" element={isAuthenticated ? <TrainingModule /> : <Navigate to="/login" />} />
              <Route path="/community" element={isAuthenticated ? <CommunityPage /> : <Navigate to="/login" />} />
              <Route path="/tracking" element={isAuthenticated ? <MapTracking /> : <Navigate to="/login" />} />
              <Route path="/facilities" element={isAuthenticated ? <FacilityLocator /> : <Navigate to="/login" />} />
              <Route path="/complaint" element={isAuthenticated ? <ComlaintPage /> : <Navigate to="/login" />} />
              {/* ✅ New Profile Page */}
              <Route path="/profile" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />} />
              {/* Rewards Page */}
<Route
  path="/rewards"
  element={isAuthenticated ? <RewardsPage /> : <Navigate to="/login" />}
/>

              {/* Default */}
              <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
          </div>
        </Router>
      </NotificationProvider>
    </UserProvider>
  );
}

export default App;
