import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoutes';
import WeddingDetails from './pages/weddingDetails'; // Vérifie la majuscule !
import GuestList from './components/GuestList';
import Budget from './components/Budget';
import Register from './pages/Register';
import Vendors from './components/Vendors';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        <Route path="/weddings/:id" element={
          <ProtectedRoute>
            <WeddingDetails />
          </ProtectedRoute>
        } />
        <Route path="/guests/:weddingId" element={
          <ProtectedRoute>
            <GuestList />
          </ProtectedRoute>
        } />
        <Route path="/budgets/:weddingId" element={
          <ProtectedRoute>
            <Budget />
          </ProtectedRoute>
        } />
        <Route path="/vendors/:weddingId" element={
          <ProtectedRoute>
            <Vendors />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;