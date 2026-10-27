import React, { useState } from 'react';
import { createBooking } from '../utils/api';

const BookingForm = ({ room = {}, onBookingSuccess }) => {
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [apiError, setApiError] = useState('');

  const validate = () => {
    const errs = {};
    if (!guestName.trim()) {
      errs.guestName = 'Name is required';
    }
    if (!guestEmail.trim()) {
      errs.guestEmail = 'Email is required';
    } else if (!guestEmail.includes('@') || !guestEmail.includes('.')) {
      errs.guestEmail = 'Invalid email format';
    }
    if (!checkInDate) {
      errs.checkInDate = 'Check-in is required';
    }
    if (!checkOutDate) {
      errs.checkOutDate = 'Check-out is required';
    } else if (checkInDate && checkOutDate <= checkInDate) {
      errs.checkOutDate = 'Check-out date must be after check-in date';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setApiError('');

    if (!validate()) return;

    try {
      const payload = {
        guestName,
        guestEmail,
        checkInDate,
        checkOutDate,
        roomId: room.roomId,
      };
      await createBooking(payload);
      setMessage('Booking created successfully');
      if (onBookingSuccess) onBookingSuccess();
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || 'Booking failed due to backend';
      setApiError(errorMsg);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="booking-form">
      {message && <div className="success-message">{message}</div>}
      {apiError && <div className="error-message">{apiError}</div>}

      <div className="form-group">
        <label htmlFor="guestName">Guest Name</label>
        <input
          id="guestName"
          type="text"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
        />
        {errors.guestName && <span className="error">{errors.guestName}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="guestEmail">Guest Email</label>
        <input
          id="guestEmail"
          type="text"
          value={guestEmail}
          onChange={(e) => setGuestEmail(e.target.value)}
        />
        {errors.guestEmail && <span className="error">{errors.guestEmail}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="checkInDate">Check-In</label>
        <input
          id="checkInDate"
          type="date"
          value={checkInDate}
          onChange={(e) => setCheckInDate(e.target.value)}
        />
        {errors.checkInDate && <span className="error">{errors.checkInDate}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="checkOutDate">Check-Out</label>
        <input
          id="checkOutDate"
          type="date"
          value={checkOutDate}
          onChange={(e) => setCheckOutDate(e.target.value)}
        />
        {errors.checkOutDate && <span className="error">{errors.checkOutDate}</span>}
      </div>

      <button type="submit" className="btn btn-primary">
        Create Booking
      </button>
    </form>
  );
};

export default BookingForm;
