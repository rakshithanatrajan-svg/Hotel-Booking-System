import React, { useState, useEffect } from 'react';
import { bookingAPI } from '../services/api';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('ALL');
  const [actionMessage, setActionMessage] = useState('');

  const loadBookings = () => {
    bookingAPI.getAllBookings().then((res) => {
      setBookings(res.data || []);
    });
  };

  useEffect(() => {
    loadBookings();
  }, []);

  useEffect(() => {
    if (activeTab === 'ALL') {
      setFilteredBookings(bookings);
    } else {
      setFilteredBookings(
        bookings.filter((b) => (b.status || '').toUpperCase() === activeTab)
      );
    }
  }, [activeTab, bookings]);

  const handleUpdateStatus = async (bookingId, newStatus) => {
    await bookingAPI.updateBookingStatus(bookingId, newStatus);
    const actionText = newStatus === 'APPROVED' ? 'approved' : 'rejected';
    setActionMessage(`Booking #${bookingId} has been ${actionText} successfully.`);
    loadBookings();
  };

  const renderStatusBadge = (status) => {
    const s = (status || '').toUpperCase();
    if (s === 'APPROVED' || s === 'CONFIRMED') {
      return (
        <span
          className="status-badge badge-approved"
          style={{ background: '#22c55e', color: '#fff', padding: '4px 10px', borderRadius: '12px', fontWeight: 'bold' }}
        >
          Approved
        </span>
      );
    }
    if (s === 'REJECTED' || s === 'CANCELLED') {
      return (
        <span
          className="status-badge badge-rejected"
          style={{ background: '#ef4444', color: '#fff', padding: '4px 10px', borderRadius: '12px', fontWeight: 'bold' }}
        >
          {s === 'CANCELLED' ? 'Cancelled' : 'Rejected'}
        </span>
      );
    }
    return (
      <span
        className="status-badge badge-pending"
        style={{ background: '#facc15', color: '#000', padding: '4px 10px', borderRadius: '12px', fontWeight: 'bold' }}
      >
        Pending
      </span>
    );
  };

  return (
    <div className="manage-bookings-page container">
      <div className="page-header">
        <h1>Manage Hotel Reservations</h1>
        <p>Review incoming guest reservations, execute approvals, or reject bookings.</p>
      </div>

      {actionMessage && <div className="alert alert-success">{actionMessage}</div>}

      <div className="status-tabs">
        <button
          className={`tab-btn ${activeTab === 'ALL' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('ALL')}
        >
          All Bookings ({bookings.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'PENDING' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('PENDING')}
        >
          Pending ({bookings.filter((b) => b.status === 'PENDING').length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'APPROVED' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('APPROVED')}
        >
          Approved ({bookings.filter((b) => b.status === 'APPROVED' || b.status === 'CONFIRMED').length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'REJECTED' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('REJECTED')}
        >
          Rejected / Cancelled ({bookings.filter((b) => b.status === 'REJECTED' || b.status === 'CANCELLED').length})
        </button>
      </div>

      {filteredBookings.length > 0 ? (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Guest Details</th>
                <th>Room Info</th>
                <th>Check-In</th>
                <th>Check-Out</th>
                <th>Total Price</th>
                <th>Status</th>
                <th>Administrative Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((b) => (
                <tr key={b.bookingId}>
                  <td><strong>#{b.bookingId}</strong></td>
                  <td>
                    <div className="guest-info">
                      <span className="guest-name">{b.guestName}</span>
                      <div className="guest-email text-muted" style={{ fontSize: '0.8rem' }}>{b.guestEmail}</div>
                    </div>
                  </td>
                  <td>
                    {b.room ? (
                      <div>
                        <strong>{b.room.roomNumber}</strong>
                        <div className="text-muted" style={{ fontSize: '0.8rem' }}>{b.room.roomType}</div>
                      </div>
                    ) : (
                      `Room #${b.roomId || 'N/A'}`
                    )}
                  </td>
                  <td>{b.checkInDate}</td>
                  <td>{b.checkOutDate}</td>
                  <td><strong>₹{b.totalPrice}</strong></td>
                  <td>{renderStatusBadge(b.status)}</td>
                  <td>
                    {b.status === 'PENDING' ? (
                      <div className="action-buttons">
                        <button
                          onClick={() => handleUpdateStatus(b.bookingId, 'APPROVED')}
                          className="btn-sm btn-success"
                        >
                          ✓ Approve
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(b.bookingId, 'REJECTED')}
                          className="btn-sm btn-danger"
                        >
                          ✕ Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-muted">Completed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <p className="empty-icon">📂</p>
          <h3>No {activeTab !== 'ALL' ? activeTab.toLowerCase() : ''} bookings found</h3>
          <p>There are no bookings matching the current filter category.</p>
        </div>
      )}
    </div>
  );
};

export default ManageBookings;
