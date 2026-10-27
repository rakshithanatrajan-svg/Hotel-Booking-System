import React, { useState, useEffect } from 'react';
import { getBookings, updateBookingStatus } from '../utils/api';

const AdminPanel = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const loadBookings = () => {
    setLoading(true);
    getBookings()
      .then((res) => {
        const all = res.data || [];
        const pending = all.filter((b) => (b.status || '').toUpperCase() === 'PENDING');
        setBookings(pending);
        setLoading(false);
      })
      .catch(() => {
        setError('error loading bookings');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleAction = (bookingId, status) => {
    setError('');
    setMessage('');
    updateBookingStatus(bookingId, status)
      .then(() => {
        const actionText = status === 'APPROVED' ? 'approved' : 'rejected';
        setMessage(`Booking ${bookingId} has been ${actionText}`);
        loadBookings();
      })
      .catch((err) => {
        const errMsg = err.response?.data?.message || 'Update error';
        setError(errMsg);
      });
  };

  if (loading) return <div>Loading...</div>;
  if (error && bookings.length === 0) return <div className="error-message">{error}</div>;

  return (
    <div className="admin-panel-component">
      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}

      {bookings.length === 0 ? (
        <div>no pending bookings</div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Guest Name</th>
              <th>Room Number</th>
              <th>Check-in</th>
              <th>Check-out</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.bookingId}>
                <td>{b.bookingId}</td>
                <td>{b.guestName}</td>
                <td>{b.room?.roomNumber || b.roomId}</td>
                <td>{b.checkInDate}</td>
                <td>{b.checkOutDate}</td>
                <td>
                  <button
                    onClick={() => handleAction(b.bookingId, 'APPROVED')}
                    className="btn btn-success"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleAction(b.bookingId, 'REJECTED')}
                    className="btn btn-danger"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminPanel;
