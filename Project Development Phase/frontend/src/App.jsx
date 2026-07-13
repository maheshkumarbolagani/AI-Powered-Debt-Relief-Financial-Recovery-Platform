import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastProvider } from "./context/ToastContext";
import { AuthProvider } from "./context/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedLayout from "./components/ProtectedLayout";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import FinancialHealth from "./pages/FinancialHealth";
import Settlement from "./pages/Settlement";
import Negotiation from "./pages/Negotiation";
import Rights from "./pages/Rights";
import History from "./pages/History";
import Profile from "./pages/Profile";

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route element={<ProtectedLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/financial-health" element={<FinancialHealth />} />
                <Route path="/settlement" element={<Settlement />} />
                <Route path="/negotiation" element={<Negotiation />} />
                <Route path="/rights" element={<Rights />} />
                <Route path="/history" element={<History />} />
                <Route path="/profile" element={<Profile />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;