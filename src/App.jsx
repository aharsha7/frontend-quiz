import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Common/Navbar';
import ProtectedRoute from './components/Common/ProtectedRoute';
import PrivateRoute from "./components/Common/PrivateRoute";
import AdminDashboard from './pages/AdminDashboard';
import AdminUploadPage from './pages/AdminUploadPage';
import UserDashboard from "./pages/UserDashboard";

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Quiz from './pages/Quiz';
import ResultPage from './pages/ResultPage';
import HistoryPage from './pages/HistoryPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>}/>
          <Route path="/admin/dashboard" element={<PrivateRoute requiredRole="admin"><AdminDashboard /></PrivateRoute>} />
          <Route path="/quiz/dashboard" element={<PrivateRoute requiredRole="user"><UserDashboard /></PrivateRoute>}/>
          

          <Route path="/admin/upload-questions" element={<ProtectedRoute adminOnly><AdminUploadPage /></ProtectedRoute>}/>
          <Route path="/quiz/:id" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
          <Route path="/result" element={<ProtectedRoute><ResultPage /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
