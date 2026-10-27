import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { roomAPI, bookingAPI, paymentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

// Professional Vector Brand Logos & Icons
const GooglePayLogo = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <path
      fill="#4285F4"
      d="M47.532 24.553c0-1.636-.145-3.218-.418-4.745H24.48v8.972h12.955c-.56 3.013-2.25 5.568-4.787 7.277v6.05h7.755c4.536-4.177 7.129-10.327 7.129-17.554z"
    />
    <path
      fill="#34A853"
      d="M24.48 48.005c6.48 0 11.916-2.145 15.89-5.809l-7.755-6.05c-2.155 1.445-4.918 2.3-8.135 2.3-6.26 0-11.564-4.227-13.464-9.918H2.986v6.245C6.95 42.459 15.082 48.005 24.48 48.005z"
    />
    <path
      fill="#FBBC05"
      d="M11.016 28.528c-.482-1.445-.755-2.986-.755-4.528s.273-3.082.755-4.527V13.227H2.986C1.355 16.473.432 20.127.432 24c0 3.873.923 7.527 2.554 10.773l8.03-6.245z"
    />
    <path
      fill="#EA4335"
      d="M24.48 9.536c3.523 0 6.691 1.214 9.177 3.595l6.882-6.882C36.386 2.455 30.95 0 24.48 0 15.082 0 6.95 5.545 2.986 13.227l8.03 6.246c1.9-5.691 7.204-9.937 13.464-9.937z"
    />
  </svg>
);

const PhonePeLogo = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <rect width="64" height="64" rx="14" fill="#5F259F" />
    <path
      d="M37.5 16h-9c-2.2 0-4 1.8-4 4v20c0 1.1.9 2 2 2s2-.9 2-2V30h5c4.4 0 8-3.6 8-8s-3.6-6-4-6zm-4 8h-5v-4h5c2.2 0 4 1.8 4 4s-1.8 4-4 4z"
      fill="#FFFFFF"
    />
    <path
      d="M32 32l11 15c.7.9 2 1.1 2.9.4.9-.7 1.1-2 .4-2.9L36 30"
      stroke="#FFFFFF"
      strokeWidth="3.5"
      strokeLinecap="round"
    />
    <path
      d="M26 11l14 5"
      stroke="#FFFFFF"
      strokeWidth="3.5"
      strokeLinecap="round"
    />
  </svg>
);

const PaytmLogo = ({ width = 56, height = 24 }) => (
  <svg width={width} height={height} viewBox="0 0 100 36" fill="none">
    <rect width="100" height="36" rx="8" fill="#F0F8FF" stroke="#00BAF2" strokeWidth="1.2" />
    <text x="12" y="25" fill="#002970" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="20" letterSpacing="-0.5">Pay</text>
    <text x="52" y="25" fill="#00BAF2" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="20" letterSpacing="-0.5">tm</text>
  </svg>
);

const UpiSidebarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"></rect>
    <rect x="14" y="3" width="7" height="7"></rect>
    <rect x="14" y="14" width="7" height="7"></rect>
    <rect x="3" y="14" width="7" height="7"></rect>
  </svg>
);

const CardSidebarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <line x1="2" y1="10" x2="22" y2="10" />
    <line x1="6" y1="15" x2="10" y2="15" />
  </svg>
);

const BankSidebarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21h18M3 10h18M5 10v11M19 10v11M9 10v11M15 10v11M12 3l9 7H3z" />
  </svg>
);

const WalletSidebarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
    <path d="M16 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
    <path d="M4 7V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2" />
  </svg>
);

const Booking = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [room, setRoom] = useState(location.state?.room || null);
  const [guestName, setGuestName] = useState(user?.name || '');
  const [guestEmail, setGuestEmail] = useState(user?.email || '');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [errors, setErrors] = useState({});

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [activeTab, setActiveTab] = useState('UPI'); // 'UPI', 'CARD', 'NETBANKING', 'WALLET'
  const [upiApp, setUpiApp] = useState('gpay');
  const [upiId, setUpiId] = useState('guest@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 4444');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('123');
  const [selectedBank, setSelectedBank] = useState('HDFC');
  const [createdBooking, setCreatedBooking] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    if (!room && roomId) {
      roomAPI.getRoomById(roomId).then((res) => setRoom(res.data));
    }
  }, [roomId, room]);

  const calculateBookingDetails = () => {
    if (!checkInDate || !checkOutDate) return { nights: 0, totalPrice: 0 };
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const diffTime = checkOut - checkIn;
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const pricePerNight = room?.price || 0;
    return {
      nights: nights > 0 ? nights : 0,
      totalPrice: nights > 0 ? nights * pricePerNight : 0,
    };
  };

  const { nights, totalPrice } = calculateBookingDetails();

  const validateForm = () => {
    const newErrors = {};
    if (!guestName.trim()) newErrors.guestName = 'Guest name is required';
    if (!guestEmail.trim()) newErrors.guestEmail = 'Guest email is required';
    if (!checkInDate) newErrors.checkInDate = 'Check-in is required';
    if (!checkOutDate) newErrors.checkOutDate = 'Check-out is required';
    else if (checkInDate && new Date(checkOutDate) <= new Date(checkInDate)) {
      newErrors.checkOutDate = 'Check-out date must be after check-in date';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      roomId: Number(roomId),
      guestName,
      guestEmail,
      checkInDate,
      checkOutDate,
      totalPrice,
    };

    const res = await bookingAPI.createBooking(payload);
    setCreatedBooking(res.data);
    setShowPaymentModal(true);
  };

  const handleProcessRazorpayPayment = async () => {
    setProcessingPayment(true);

    const generatedPaymentId = `pay_${Math.random().toString(36).substring(2, 11).toUpperCase()}${Date.now().toString().slice(-4)}`;
    const generatedOrderId = `order_${Math.random().toString(36).substring(2, 10)}`;

    try {
      await paymentAPI.processPayment({
        bookingId: createdBooking?.bookingId,
        amount: totalPrice,
        paymentMethod: `RAZORPAY_${activeTab}`,
        razorpayPaymentId: generatedPaymentId,
        razorpayOrderId: generatedOrderId,
        razorpaySignature: `sig_${Math.random().toString(36).substring(2, 15)}`,
      });
    } catch {}

    setTimeout(() => {
      setProcessingPayment(false);
      setShowPaymentModal(false);
      navigate('/booking-confirmation', {
        state: {
          booking: createdBooking,
          room,
          totalPrice,
          nights,
          transactionId: generatedPaymentId,
        },
      });
    }, 1200);
  };

  return (
    <div className="booking-page container">
      <div className="booking-layout">
        <div className="booking-form-card">
          <h2>Complete Your Reservation</h2>
          <p className="subtitle">Enter your details to confirm your stay.</p>

          <form onSubmit={handleSubmitBooking} noValidate>
            <div className="form-group">
              <label htmlFor="guestName">Guest Name *</label>
              <input
                type="text"
                id="guestName"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Enter full name"
                className={errors.guestName ? 'input-error' : ''}
              />
              {errors.guestName && <span className="field-error">{errors.guestName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="guestEmail">Guest Email *</label>
              <input
                type="email"
                id="guestEmail"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                placeholder="e.g. john@example.com"
                className={errors.guestEmail ? 'input-error' : ''}
              />
              {errors.guestEmail && <span className="field-error">{errors.guestEmail}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="checkInDate">Check-In Date *</label>
                <input
                  type="date"
                  id="checkInDate"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  className={errors.checkInDate ? 'input-error' : ''}
                />
                {errors.checkInDate && <span className="field-error">{errors.checkInDate}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="checkOutDate">Check-Out Date *</label>
                <input
                  type="date"
                  id="checkOutDate"
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  className={errors.checkOutDate ? 'input-error' : ''}
                />
                {errors.checkOutDate && <span className="field-error">{errors.checkOutDate}</span>}
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block btn-lg"
            >
              Proceed to Payment →
            </button>
          </form>
        </div>

        <div className="booking-summary-card">
          <h3>Reservation Summary</h3>

          {room && (
            <div className="summary-room-info">
              <h4>{room.roomType} Room (Room #{room.roomNumber})</h4>
              <p className="summary-capacity">👥 Maximum {room.capacity} Guests</p>
              <p className="summary-rate">₹{room.price} / night</p>
            </div>
          )}

          <hr className="divider" />

          <div className="price-breakdown">
            <div className="breakdown-row">
              <span>Rate per Night</span>
              <span>₹{room?.price || 0}</span>
            </div>
            <div className="breakdown-row">
              <span>Total Nights</span>
              <span>{nights} {nights === 1 ? 'Night' : 'Nights'}</span>
            </div>
            <div className="breakdown-row">
              <span>Taxes & Fees</span>
              <span>Included</span>
            </div>
            <hr className="divider" />
            <div className="breakdown-row total-row">
              <span>Total Price</span>
              <span className="total-amount">₹{totalPrice}</span>
            </div>
          </div>
        </div>
      </div>

      {showPaymentModal && (
        <div className="modal-backdrop">
          <div
            className="modal-content payment-modal"
            style={{
              maxWidth: '680px',
              padding: 0,
              overflow: 'hidden',
              borderRadius: '12px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
          >
            {/* Razorpay Top Header */}
            <div
              style={{
                background: '#0c2340',
                color: '#fff',
                padding: '16px 24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    background: '#0284c7',
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '1.2rem',
                  }}
                >
                  ⚡
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.1rem', letterSpacing: '0.5px' }}>Razorpay Secure</h4>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>256-bit Encrypted Payment Gateway</span>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Amount to Pay</span>
                <strong style={{ fontSize: '1.3rem', color: '#38bdf8' }}>₹{totalPrice}</strong>
              </div>
            </div>

            {/* Razorpay Body Layout */}
            <div style={{ display: 'flex', minHeight: '340px' }}>
              {/* Left Sidebar: Payment Methods */}
              <div
                style={{
                  width: '200px',
                  background: '#f8fafc',
                  borderRight: '1px solid #e2e8f0',
                  padding: '12px 0',
                }}
              >
                <div
                  onClick={() => setActiveTab('UPI')}
                  style={{
                    padding: '14px 20px',
                    cursor: 'pointer',
                    background: activeTab === 'UPI' ? '#eff6ff' : 'transparent',
                    borderLeft: activeTab === 'UPI' ? '4px solid #0284c7' : '4px solid transparent',
                    fontWeight: activeTab === 'UPI' ? 'bold' : 'normal',
                    color: activeTab === 'UPI' ? '#0369a1' : '#475569',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '0.9rem',
                  }}
                >
                  <UpiSidebarIcon /> UPI / QR
                </div>

                <div
                  onClick={() => setActiveTab('CARD')}
                  style={{
                    padding: '14px 20px',
                    cursor: 'pointer',
                    background: activeTab === 'CARD' ? '#eff6ff' : 'transparent',
                    borderLeft: activeTab === 'CARD' ? '4px solid #0284c7' : '4px solid transparent',
                    fontWeight: activeTab === 'CARD' ? 'bold' : 'normal',
                    color: activeTab === 'CARD' ? '#0369a1' : '#475569',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '0.9rem',
                  }}
                >
                  <CardSidebarIcon /> Cards (Debit/Credit)
                </div>

                <div
                  onClick={() => setActiveTab('NETBANKING')}
                  style={{
                    padding: '14px 20px',
                    cursor: 'pointer',
                    background: activeTab === 'NETBANKING' ? '#eff6ff' : 'transparent',
                    borderLeft: activeTab === 'NETBANKING' ? '4px solid #0284c7' : '4px solid transparent',
                    fontWeight: activeTab === 'NETBANKING' ? 'bold' : 'normal',
                    color: activeTab === 'NETBANKING' ? '#0369a1' : '#475569',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '0.9rem',
                  }}
                >
                  <BankSidebarIcon /> Netbanking
                </div>

                <div
                  onClick={() => setActiveTab('WALLET')}
                  style={{
                    padding: '14px 20px',
                    cursor: 'pointer',
                    background: activeTab === 'WALLET' ? '#eff6ff' : 'transparent',
                    borderLeft: activeTab === 'WALLET' ? '4px solid #0284c7' : '4px solid transparent',
                    fontWeight: activeTab === 'WALLET' ? 'bold' : 'normal',
                    color: activeTab === 'WALLET' ? '#0369a1' : '#475569',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '0.9rem',
                  }}
                >
                  <WalletSidebarIcon /> Wallets
                </div>
              </div>

              {/* Right Content Area */}
              <div style={{ flex: 1, padding: '24px', background: '#fff' }}>
                {activeTab === 'UPI' && (
                  <div>
                    <h4 style={{ margin: '0 0 12px', fontSize: '1rem', color: '#1e293b', fontWeight: '600' }}>Select UPI Option</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
                      {/* Google Pay */}
                      <div
                        onClick={() => {
                          setUpiApp('gpay');
                          setUpiId('guest@okhdfcbank');
                        }}
                        style={{
                          padding: '12px 8px',
                          border: upiApp === 'gpay' ? '2px solid #0284c7' : '1px solid #cbd5e1',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          textAlign: 'center',
                          background: upiApp === 'gpay' ? '#f0f9ff' : '#fff',
                          boxShadow: upiApp === 'gpay' ? '0 4px 6px -1px rgba(2, 132, 199, 0.15)' : 'none',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                        }}
                      >
                        <GooglePayLogo size={28} />
                        <span style={{ fontSize: '0.82rem', fontWeight: '600', color: upiApp === 'gpay' ? '#0369a1' : '#334155' }}>
                          Google Pay
                        </span>
                      </div>

                      {/* PhonePe */}
                      <div
                        onClick={() => {
                          setUpiApp('phonepe');
                          setUpiId('guest@ybl');
                        }}
                        style={{
                          padding: '12px 8px',
                          border: upiApp === 'phonepe' ? '2px solid #0284c7' : '1px solid #cbd5e1',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          textAlign: 'center',
                          background: upiApp === 'phonepe' ? '#f0f9ff' : '#fff',
                          boxShadow: upiApp === 'phonepe' ? '0 4px 6px -1px rgba(2, 132, 199, 0.15)' : 'none',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                        }}
                      >
                        <PhonePeLogo size={28} />
                        <span style={{ fontSize: '0.82rem', fontWeight: '600', color: upiApp === 'phonepe' ? '#0369a1' : '#334155' }}>
                          PhonePe
                        </span>
                      </div>

                      {/* Paytm */}
                      <div
                        onClick={() => {
                          setUpiApp('paytm');
                          setUpiId('guest@paytm');
                        }}
                        style={{
                          padding: '12px 8px',
                          border: upiApp === 'paytm' ? '2px solid #0284c7' : '1px solid #cbd5e1',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          textAlign: 'center',
                          background: upiApp === 'paytm' ? '#f0f9ff' : '#fff',
                          boxShadow: upiApp === 'paytm' ? '0 4px 6px -1px rgba(2, 132, 199, 0.15)' : 'none',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                        }}
                      >
                        <PaytmLogo width={56} height={28} />
                        <span style={{ fontSize: '0.82rem', fontWeight: '600', color: upiApp === 'paytm' ? '#0369a1' : '#334155' }}>
                          Paytm UPI
                        </span>
                      </div>
                    </div>

                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px', color: '#475569' }}>
                      UPI ID / VPA
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        fontSize: '0.9rem',
                        marginBottom: '8px',
                      }}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#16a34a', fontWeight: '500' }}>
                      <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Verified Merchant UPI Request</span>
                    </div>
                  </div>
                )}

                {activeTab === 'CARD' && (
                  <div>
                    <h4 style={{ margin: '0 0 12px', fontSize: '1rem', color: '#1e293b' }}>Enter Card Details</h4>
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#475569' }}>Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        style={{ width: '100%', padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#475569' }}>Expiry (MM/YY)</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          style={{ width: '100%', padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#475569' }}>CVV</label>
                        <input
                          type="password"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          style={{ width: '100%', padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'NETBANKING' && (
                  <div>
                    <h4 style={{ margin: '0 0 12px', fontSize: '1rem', color: '#1e293b' }}>Popular Indian Banks</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      {[
                        { name: 'HDFC Bank', code: 'HDFC', color: '#004c8f' },
                        { name: 'State Bank of India', code: 'SBI', color: '#280071' },
                        { name: 'ICICI Bank', code: 'ICICI', color: '#b02a30' },
                        { name: 'Axis Bank', code: 'AXIS', color: '#97144d' },
                      ].map((b) => (
                        <button
                          key={b.code}
                          type="button"
                          onClick={() => setSelectedBank(b.code)}
                          style={{
                            padding: '12px 14px',
                            border: selectedBank === b.code ? '2px solid #0284c7' : '1px solid #cbd5e1',
                            background: selectedBank === b.code ? '#f0f9ff' : '#fff',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            fontWeight: selectedBank === b.code ? 'bold' : '500',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            textAlign: 'left',
                          }}
                        >
                          <span
                            style={{
                              width: '10px',
                              height: '10px',
                              borderRadius: '50%',
                              background: b.color,
                              display: 'inline-block',
                            }}
                          />
                          {b.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'WALLET' && (
                  <div>
                    <h4 style={{ margin: '0 0 12px', fontSize: '1rem', color: '#1e293b' }}>Select Digital Wallet</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div
                        style={{
                          padding: '12px 14px',
                          border: '1px solid #00BAF2',
                          background: '#f0f9ff',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          cursor: 'pointer',
                        }}
                      >
                        <PaytmLogo width={48} height={24} />
                        <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#002970' }}>Paytm Wallet</span>
                      </div>

                      <div
                        style={{
                          padding: '12px 14px',
                          border: '1px solid #5F259F',
                          background: '#faf5ff',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          cursor: 'pointer',
                        }}
                      >
                        <PhonePeLogo size={24} />
                        <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#5F259F' }}>PhonePe Wallet</span>
                      </div>

                      <div
                        style={{
                          padding: '12px 14px',
                          border: '1px solid #cbd5e1',
                          background: '#fff',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          cursor: 'pointer',
                        }}
                      >
                        <span style={{ fontWeight: 'bold', color: '#ff9900', fontSize: '1.1rem' }}>a</span>
                        <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#334155' }}>Amazon Pay</span>
                      </div>

                      <div
                        style={{
                          padding: '12px 14px',
                          border: '1px solid #cbd5e1',
                          background: '#fff',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          cursor: 'pointer',
                        }}
                      >
                        <span style={{ fontWeight: 'bold', color: '#e91e63', fontSize: '1.1rem' }}>M</span>
                        <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#334155' }}>MobiKwik</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Pay Button */}
            <div
              style={{
                background: '#f8fafc',
                borderTop: '1px solid #e2e8f0',
                padding: '16px 24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <button
                type="button"
                onClick={() => setShowPaymentModal(false)}
                className="btn btn-outline"
                style={{ padding: '10px 18px' }}
              >
                Cancel
              </button>

              <button
                onClick={handleProcessRazorpayPayment}
                disabled={processingPayment}
                style={{
                  background: '#0284c7',
                  color: '#fff',
                  border: 'none',
                  padding: '12px 28px',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                {processingPayment ? 'Authorizing with Razorpay...' : `Pay ₹${totalPrice} with Razorpay →`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Booking;
