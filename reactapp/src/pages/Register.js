import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [role, setRole] = useState('GUEST');
  const [adminKey, setAdminKey] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (role === 'ADMIN' && !adminKey.trim()) {
      setError('Admin Security Key / ID is required to register an Admin account.');
      return;
    }

    const fullPhoneNumber = phoneNumber ? `${countryCode} ${phoneNumber}`.trim() : '';

    try {
      const res = await register({
        ...formData,
        phoneNumber: fullPhoneNumber,
        role,
        adminKey: role === 'ADMIN' ? adminKey.trim() : undefined,
      });
      if (res?.role === 'ADMIN' || role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/home');
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed. Email may already be in use or invalid Admin Key.');
    }
  };

  return (
    <div className="auth-page container">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-icon">✨</span>
          <h2>Create Your Account</h2>
          <p>Join Hotel Booking System to book rooms effortlessly.</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Role Selection */}
          <div className="form-group" style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1e293b' }}>
              Register As *
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div
                onClick={() => setRole('GUEST')}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: role === 'GUEST' ? '2px solid #0284c7' : '1px solid #cbd5e1',
                  background: role === 'GUEST' ? '#f0f9ff' : '#ffffff',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s ease',
                  boxShadow: role === 'GUEST' ? '0 4px 6px -1px rgba(2, 132, 199, 0.15)' : 'none',
                }}
              >
                <div style={{ fontSize: '1.2rem', marginBottom: '4px' }}>👤</div>
                <strong style={{ display: 'block', fontSize: '0.9rem', color: role === 'GUEST' ? '#0369a1' : '#334155' }}>
                  Guest / Customer
                </strong>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Book & Manage Stays</span>
              </div>

              <div
                onClick={() => setRole('ADMIN')}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: role === 'ADMIN' ? '2px solid #0284c7' : '1px solid #cbd5e1',
                  background: role === 'ADMIN' ? '#f0f9ff' : '#ffffff',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s ease',
                  boxShadow: role === 'ADMIN' ? '0 4px 6px -1px rgba(2, 132, 199, 0.15)' : 'none',
                }}
              >
                <div style={{ fontSize: '1.2rem', marginBottom: '4px' }}>🛡️</div>
                <strong style={{ display: 'block', fontSize: '0.9rem', color: role === 'ADMIN' ? '#0369a1' : '#334155' }}>
                  Hotel Admin
                </strong>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Manage Rooms & Bookings</span>
              </div>
            </div>
          </div>

          {/* Admin Security ID field (Visible only when Admin role is selected) */}
          {role === 'ADMIN' && (
            <div
              className="form-group"
              style={{
                background: '#f0f9ff',
                padding: '14px',
                borderRadius: '8px',
                border: '1px dashed #0284c7',
                marginBottom: '18px',
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
                  fontSize: '0.9rem',
                }}
              >
                <span>🔐</span> Admin Security ID / Access Key *
              </label>
              <input
                type="password"
                id="adminKey"
                name="adminKey"
                value={adminKey}
                placeholder="Enter Admin Security ID (e.g. ADMIN@2026)"
                onChange={(e) => setAdminKey(e.target.value)}
                required
                style={{ marginTop: '6px', background: '#ffffff' }}
              />
              <span style={{ fontSize: '0.75rem', color: '#0369a1', display: 'block', marginTop: '4px' }}>
                🔒 Only authorized hotel personnel can register administrator accounts.
              </span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              placeholder="e.g. John Doe"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              placeholder="e.g. john@example.com"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phoneNumber">Mobile Number</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                style={{
                  width: '130px',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  fontSize: '0.95rem',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                <option value="+91">🇮🇳 +91 (IN)</option>
                <option value="+1">🇺🇸 +1 (US)</option>
                <option value="+44">🇬🇧 +44 (UK)</option>
                <option value="+971">🇦🇪 +971 (UAE)</option>
                <option value="+65">🇸🇬 +65 (SG)</option>
                <option value="+61">🇦🇺 +61 (AU)</option>
                <option value="+49">🇩🇪 +49 (DE)</option>
                <option value="+33">🇫🇷 +33 (FR)</option>
                <option value="+81">🇯🇵 +81 (JP)</option>
                <option value="+966">🇸🇦 +966 (SA)</option>
              </select>

              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={phoneNumber}
                placeholder="e.g. 9876543210"
                onChange={(e) => setPhoneNumber(e.target.value)}
                style={{ flex: 1 }}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              placeholder="Create a strong password"
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block btn-lg"
          >
            Create Account
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="auth-link">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
