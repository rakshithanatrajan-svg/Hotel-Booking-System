import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const BookingConfirmation = () => {
  const location = useLocation();
  const { booking, room, totalPrice, nights } = location.state || {};

  return (
    <div className="confirmation-page container">
      <div className="confirmation-card">
        <div className="confirmation-icon">🎉</div>
        <h1>Reservation Request Received!</h1>
        <p className="confirmation-subtitle">
          Thank you for choosing Hotel Booking System. Your reservation has been recorded in our system.
        </p>

        <div className="confirmation-details-box">
          <div className="detail-row highlight-row">
            <span>Booking Reference ID</span>
            <strong>#{booking?.bookingId || '101'}</strong>
          </div>

          <div className="detail-row">
            <span>Guest Name</span>
            <span>{booking?.guestName || 'Guest'}</span>
          </div>

          <div className="detail-row">
            <span>Email</span>
            <span>{booking?.guestEmail || 'guest@hotel.com'}</span>
          </div>

          <div className="detail-row">
            <span>Room Details</span>
            <span>{room?.roomType || 'Standard'} (Room #{room?.roomNumber || booking?.room?.roomNumber || '101'})</span>
          </div>

          <div className="detail-row">
            <span>Stay Duration</span>
            <span>{booking?.checkInDate || 'N/A'} to {booking?.checkOutDate || 'N/A'} ({nights || 1} Nights)</span>
          </div>

          <div className="detail-row">
            <span>Total Price</span>
            <strong className="text-success">₹{totalPrice || booking?.totalPrice || 0}</strong>
          </div>

          <div className="detail-row">
            <span>Reservation Status</span>
            <span className="badge badge-pending">{booking?.status || 'PENDING'}</span>
          </div>
        </div>

        <div className="notification-note">
          <span>📧 Automated Notification:</span> A confirmation email has been dispatched to your email address.
        </div>

        <div className="confirmation-actions">
          <Link to="/my-bookings" className="btn btn-primary">
            View My Bookings
          </Link>
          <Link to="/home" className="btn btn-outline" style={{ marginLeft: '12px' }}>
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
