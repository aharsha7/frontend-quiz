import React from 'react';
import { Navigate, BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Common/Navbar';
import SecureRoute from './components/Common/SecureRoute'; 
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from "./pages/UserDashboard";
import QuizInstructionPage from "./pages/QuizInstructionPage";
import QuizQuestions from './components/Quiz/QuizQuestions';
import Login from './pages/Login';
import Register from './pages/Register';
import QuizResult from './components/Quiz/QuizResult';
import QuizHistory from "./components/Quiz/QuizHistory";
import CategoryManager from './components/Admin/CategoryManager'; 

// Handle public pages like login/register
const PublicRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('userInfo'));
  return user ? <Navigate to={user.role === "admin" ? "/admin/dashboard" : "/quiz/dashboard"} /> : children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

          {/*Admin-only routes */}
          <Route path="/admin" element={<SecureRoute requiredRole="admin"><AdminDashboard /></SecureRoute>} />
          <Route path="/admin/dashboard" element={<SecureRoute requiredRole="admin"><AdminDashboard /></SecureRoute>} />
          <Route path="/admin/manage-categories" element={<SecureRoute requiredRole="admin"><CategoryManager /></SecureRoute>} />

          {/*User-only route */}
          <Route path="/quiz/dashboard" element={<SecureRoute requiredRole="user"><UserDashboard /></SecureRoute>} />

          {/*Any logged-in user */}
          <Route path="/quiz/instructions/:categoryId" element={<SecureRoute><QuizInstructionPage /></SecureRoute>} />
          <Route path="/quiz/history" element={<SecureRoute><QuizHistory /></SecureRoute>} />
          <Route path="/quiz/:categoryId" element={<SecureRoute><QuizQuestions /></SecureRoute>} />
          <Route path="/result" element={<SecureRoute><QuizResult /></SecureRoute>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
