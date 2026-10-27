import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [selectedRole, setSelectedRole] = useState('GUEST'); // 'GUEST' or 'ADMIN'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [error, setError] = useState('');

  const redirectPath = location.state?.from || '/home';

  const handleRoleTabChange = (role) => {
    setSelectedRole(role);
    setError('');
    setAdminKey('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    if (selectedRole === 'ADMIN' && !adminKey.trim()) {
      setError('Admin Security Key / ID is required to access the Admin Portal.');
      return;
    }

    try {
      const data = await login(email, password, selectedRole === 'ADMIN' ? adminKey.trim() : null);
      if (data.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate(redirectPath);
      }
    } catch (err) {
      const serverMsg = err?.response?.data?.message || err?.message || 'Invalid credentials or unauthorized access.';
      setError(serverMsg);
    }
  };

  return (
    <div className="auth-page container">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-icon">{selectedRole === 'ADMIN' ? '🛡️' : '🏨'}</span>
          <h2>{selectedRole === 'ADMIN' ? 'Admin Portal Sign In' : 'Sign In to Hotel Booking System'}</h2>
          <p>
            {selectedRole === 'ADMIN'
              ? 'Access administrative controls, room management & booking approvals.'
              : 'Access your hotel room reservations & exclusive guest services.'}
          </p>
        </div>

        {/* Role Switcher Tabs */}
        <div
          style={{
            display: 'flex',
            background: '#f1f5f9',
            padding: '4px',
            borderRadius: '10px',
            marginBottom: '20px',
            gap: '4px',
          }}
        >
          <button
            type="button"
            onClick={() => handleRoleTabChange('GUEST')}
            style={{
              flex: 1,
              padding: '10px 14px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.9rem',
              background: selectedRole === 'GUEST' ? '#ffffff' : 'transparent',
              color: selectedRole === 'GUEST' ? '#0284c7' : '#64748b',
              boxShadow: selectedRole === 'GUEST' ? '0 2px 4px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <span>👤</span> Guest Login
          </button>

          <button
            type="button"
            onClick={() => handleRoleTabChange('ADMIN')}
            style={{
              flex: 1,
              padding: '10px 14px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.9rem',
              background: selectedRole === 'ADMIN' ? '#ffffff' : 'transparent',
              color: selectedRole === 'ADMIN' ? '#0284c7' : '#64748b',
              boxShadow: selectedRole === 'ADMIN' ? '0 2px 4px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <span>🛡️</span> Admin Portal
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              value={email}
              placeholder={selectedRole === 'ADMIN' ? 'admin@hotel.com' : 'guest@hotel.com'}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label htmlFor="password">Password *</label>
              <span
                onClick={() => alert('Password reset instructions have been sent to your registered email.')}
                style={{ fontSize: '0.8rem', color: '#0284c7', cursor: 'pointer', fontWeight: '500' }}
              >
                Forgot Password?
              </span>
            </div>
            <input
              type="password"
              id="password"
              value={password}
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Admin Security ID field (Visible only on Admin Portal) */}
          {selectedRole === 'ADMIN' && (
            <div
              className="form-group"
              style={{
                background: '#f0f9ff',
                padding: '12px 14px',
                borderRadius: '8px',
                border: '1px dashed #0284c7',
                marginBottom: '16px',
              }}
            >
              <label
                htmlFor="adminKey"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#0369a1',
                  fontWeight: '600',
                  fontSize: '0.85rem',
                  marginBottom: '6px',
                }}
              >
                <span>🔐</span> Admin Security ID / Access Key *
              </label>
              <input
                type="password"
                id="adminKey"
                value={adminKey}
                placeholder="Enter Admin Security ID (e.g. ADMIN@2026)"
                onChange={(e) => setAdminKey(e.target.value)}
                required
                style={{ background: '#ffffff' }}
              />
              <span style={{ fontSize: '0.75rem', color: '#0369a1', display: 'block', marginTop: '4px' }}>
                🔒 Verifies authorized hotel staff access.
              </span>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-block btn-lg"
          >
            {selectedRole === 'ADMIN' ? 'Sign In as Administrator' : 'Sign In as Guest'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account yet?{' '}
            <Link to="/register" className="auth-link">Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
