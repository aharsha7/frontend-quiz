// components/Common/PrivateRoute.jsx
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, requiredRole }) => {
  const user = JSON.parse(localStorage.getItem('userInfo'));

  if (!user) return <Navigate to="/login" />;
  if (requiredRole && user.role !== requiredRole) return <Navigate to="/unauthorized" />;

  return children;
};

export default PrivateRoute;
