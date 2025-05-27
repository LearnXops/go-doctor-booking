import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import DoctorProfileSetup from './pages/DoctorProfileSetup';
import Appointments from './pages/Appointments';
import BookAppointment from './pages/BookAppointment';
import DoctorsList from './pages/DoctorsList';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/doctors" element={
              <PrivateRoute>
                <DoctorsList />
              </PrivateRoute>
            } />
            <Route path="/appointments" element={
              <PrivateRoute>
                <Appointments />
              </PrivateRoute>
            } />
            <Route path="/doctors/:id/book" element={
              <PrivateRoute>
                <BookAppointment />
              </PrivateRoute>
            } />
            <Route path="/doctor/dashboard" element={
              <PrivateRoute requiredRole="doctor">
                <DoctorDashboard />
              </PrivateRoute>
            } />
            <Route path="/doctor/profile/setup" element={
              <PrivateRoute requiredRole="doctor">
                <DoctorProfileSetup />
              </PrivateRoute>
            } />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
