import React, { useState, useEffect } from 'react';
import { getBookings } from '../utils/api';

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await getBookings();
        setBookings(res.data || []);
      } catch (err) {
        setError('could not load bookings');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const getStatusColor = (status) => {
    const s = (status || '').toUpperCase();
    if (s === 'PENDING') return '#facc15';
    if (s === 'APPROVED') return '#22c55e';
    if (s === 'REJECTED') return '#ef4444';
    return '#94a3b8';
  };

  const formatStatus = (status) => {
    const s = (status || '').toLowerCase();
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  if (loading) return <div>Loading bookings...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!bookings || bookings.length === 0) return <div>No bookings found</div>;

  return (
    <div className="booking-list-component">
      <table className="bookings-table">
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>Room Number</th>
            <th>Guest Name</th>
            <th>Check-in</th>
            <th>Check-out</th>
            <th>Total Price</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.bookingId}>
              <td>{b.bookingId}</td>
              <td>{b.room?.roomNumber || b.roomId}</td>
              <td>{b.guestName}</td>
              <td>{b.checkInDate}</td>
              <td>{b.checkOutDate}</td>
              <td>${b.totalPrice}</td>
              <td>
                <span
                  style={{
                    background: getStatusColor(b.status),
                    padding: '4px 8px',
                    borderRadius: '4px',
                  }}
                >
                  {formatStatus(b.status)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingList;
