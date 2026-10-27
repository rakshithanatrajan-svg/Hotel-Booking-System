import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const MyBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [cancelMessage, setCancelMessage] = useState('');

  useEffect(() => {
    bookingAPI.getUserBookings(user?.email).then((res) => {
      setBookings(res.data || []);
    });
  }, [user]);

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    await bookingAPI.cancelBooking(bookingId);
    setCancelMessage(`Booking #${bookingId} was successfully cancelled.`);
    bookingAPI.getUserBookings(user?.email).then((res) => {
      setBookings(res.data || []);
    });
  };

  const getStatusBadge = (status) => {
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
    <div className="my-bookings-page container">
      <div className="page-header">
        <h1>My Reservations</h1>
        <p>Review the history and current status of all your room bookings.</p>
      </div>

      {cancelMessage && <div className="alert alert-success">{cancelMessage}</div>}

      {bookings.length > 0 ? (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Room</th>
                <th>Guest Name</th>
                <th>Check-In</th>
                <th>Check-Out</th>
                <th>Total Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.bookingId}>
                  <td><strong>#{b.bookingId}</strong></td>
                  <td>
                    {b.room ? (
                      <>
                        Room #{b.room.roomNumber} ({b.room.roomType})
                      </>
                    ) : (
                      `Room #${b.roomId || 'N/A'}`
                    )}
                  </td>
                  <td>{b.guestName}</td>
                  <td>{b.checkInDate}</td>
                  <td>{b.checkOutDate}</td>
                  <td><strong>₹{b.totalPrice}</strong></td>
                  <td>{getStatusBadge(b.status)}</td>
                  <td>
                    {b.status !== 'CANCELLED' && b.status !== 'REJECTED' ? (
                      <button
                        onClick={() => handleCancel(b.bookingId)}
                        className="btn-sm btn-danger"
                      >
                        Cancel
                      </button>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <p className="empty-icon">📅</p>
          <h3>No Bookings Found</h3>
          <p>You haven't made any hotel room reservations yet.</p>
          <Link to="/rooms" className="btn btn-primary">
            Explore & Book Rooms
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
