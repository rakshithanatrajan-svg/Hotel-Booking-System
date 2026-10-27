import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { roomAPI, bookingAPI } from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalRooms: 0,
    availableRooms: 0,
    totalBookings: 0,
    pendingBookings: 0,
    totalRevenue: 0,
  });
  const [recentPending, setRecentPending] = useState([]);

  useEffect(() => {
    Promise.all([roomAPI.getAllRooms(), bookingAPI.getAllBookings()]).then(
      ([roomsRes, bookingsRes]) => {
        const rooms = roomsRes.data || [];
        const bookings = bookingsRes.data || [];
        const available = rooms.filter((r) => r.available).length;
        const pending = bookings.filter((b) => b.status === 'PENDING');
        const revenue = bookings
          .filter((b) => b.status === 'APPROVED' || b.status === 'CONFIRMED')
          .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

        setStats({
          totalRooms: rooms.length,
          availableRooms: available,
          totalBookings: bookings.length,
          pendingBookings: pending.length,
          totalRevenue: revenue,
        });

        setRecentPending(pending.slice(0, 5));
      }
    );
  }, []);

  return (
    <div className="admin-dashboard-page container">
      <div className="page-header-flex">
        <div>
          <h1>Administrator Management Suite</h1>
          <p>Real-time overview of hotel room inventory, reservations, and revenues.</p>
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">🏨</div>
          <div className="metric-data">
            <span className="metric-value">{stats.totalRooms}</span>
            <span className="metric-title">Total Rooms</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🟢</div>
          <div className="metric-data">
            <span className="metric-value">{stats.availableRooms}</span>
            <span className="metric-title">Available Rooms</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📋</div>
          <div className="metric-data">
            <span className="metric-value">{stats.totalBookings}</span>
            <span className="metric-title">Total Bookings</span>
          </div>
        </div>

        <div className="metric-card metric-warning">
          <div className="metric-icon">⏳</div>
          <div className="metric-data">
            <span className="metric-value">{stats.pendingBookings}</span>
            <span className="metric-title">Pending Approvals</span>
          </div>
        </div>

        <div className="metric-card metric-success">
          <div className="metric-icon">💰</div>
          <div className="metric-data">
            <span className="metric-value">₹{stats.totalRevenue}</span>
            <span className="metric-title">Total Revenue</span>
          </div>
        </div>
      </div>

      <div className="admin-shortcuts-grid">
        <Link to="/admin/rooms" className="shortcut-card">
          <div className="shortcut-content">
            <h3>🏨 Manage Room Inventory</h3>
            <p>Create new room listings, update prices, change room capacity, and manage availability.</p>
            <span className="btn-link">Open Room Manager &rarr;</span>
          </div>
        </Link>

        <Link to="/admin/bookings" className="shortcut-card">
          <div className="shortcut-content">
            <h3>📝 Manage Booking Approvals</h3>
            <p>Review guest booking requests, approve or reject reservations, and audit booking status.</p>
            <span className="btn-link">Open Booking Manager &rarr;</span>
          </div>
        </Link>
      </div>

      <div className="dashboard-section">
        <div className="section-header-flex">
          <h3>Action Required: Pending Guest Bookings</h3>
          <Link to="/admin/bookings" className="btn btn-outline btn-sm">
            View All Pending ({stats.pendingBookings})
          </Link>
        </div>

        {recentPending.length > 0 ? (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Guest Name</th>
                  <th>Room</th>
                  <th>Check-In</th>
                  <th>Check-Out</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentPending.map((b) => (
                  <tr key={b.bookingId}>
                    <td>#{b.bookingId}</td>
                    <td>{b.guestName}</td>
                    <td>Room #{b.room?.roomNumber || b.roomId}</td>
                    <td>{b.checkInDate}</td>
                    <td>{b.checkOutDate}</td>
                    <td>₹{b.totalPrice}</td>
                    <td>
                      <Link to="/admin/bookings" className="btn-sm btn-primary">
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state-mini" style={{ padding: '20px', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <p>✅ All caught up! There are no pending booking requests right now.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
