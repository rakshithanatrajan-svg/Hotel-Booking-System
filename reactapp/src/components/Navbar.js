import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getBrandLink = () => {
    if (!isAuthenticated) return '/login';
    return isAdmin ? '/admin' : '/home';
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to={getBrandLink()} className="navbar-brand">
          <span className="brand-icon">🏨</span>
          <span className="brand-name">Hotel Booking System</span>
        </Link>

        <nav className="navbar-nav">
          {isAuthenticated && !isAdmin && (
            <>
              <Link to="/home" className="nav-link">Home</Link>
              <Link to="/rooms" className="nav-link">Rooms</Link>
              <Link to="/my-bookings" className="nav-link">My Bookings</Link>
            </>
          )}

          {isAuthenticated && isAdmin && (
            <>
              <Link to="/admin" className="nav-link admin-link">Dashboard</Link>
              <Link to="/admin/rooms" className="nav-link admin-link">Manage Rooms</Link>
              <Link to="/admin/bookings" className="nav-link admin-link">Manage Bookings</Link>
            </>
          )}
        </nav>

        <div className="navbar-actions">
          {isAuthenticated ? (
            <div className="user-profile-menu">
              <span className={`role-badge ${isAdmin ? 'badge-admin' : 'badge-guest'}`}>
                {isAdmin ? '🛡️ Admin' : '👤 Guest'}
              </span>
              <span className="user-name">{user?.name || user?.email}</span>
              <button onClick={handleLogout} className="btn-logout">
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="btn btn-outline">Login</Link>
              <Link to="/register" className="btn btn-primary">Register</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
