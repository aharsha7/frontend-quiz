import React from 'react';
import { Navigate } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Common/Navbar';
import ProtectedRoute from './components/Common/ProtectedRoute';
import PrivateRoute from "./components/Common/PrivateRoute";
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from "./pages/UserDashboard";
import QuizQuestions from './components/Quiz/QuizQuestions';
import Login from './pages/Login';
import Register from './pages/Register';
import QuizResult from './components/Quiz/QuizResult';
import QuizHistory from "./components/Quiz/QuizHistory";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>}/>
          <Route path="/admin/dashboard" element={<PrivateRoute requiredRole="admin"><AdminDashboard /></PrivateRoute>} />
          <Route path="/quiz/dashboard" element={<PrivateRoute requiredRole="user"><UserDashboard /></PrivateRoute>}/>
          <Route path="/quiz/history" element={<QuizHistory />} />
          <Route path="/quiz/:categoryId" element={<QuizQuestions />} />
          <Route path="/result" element={<QuizResult />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
