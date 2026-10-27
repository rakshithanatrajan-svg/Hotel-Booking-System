import React from 'react';
import { useNavigate } from 'react-router-dom';

const RoomCard = ({ room }) => {
  const navigate = useNavigate();

  const getRoomImage = (type) => {
    const t = (type || '').toLowerCase();
    if (t.includes('deluxe')) {
      return 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80';
    }
    if (t.includes('suite')) {
      return 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80';
    }
    if (t.includes('standard')) {
      return 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=600&q=80';
    }
    return 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=600&q=80';
  };

  const handleBookNow = () => {
    if (room.available) {
      navigate(`/book/${room.roomId}`, { state: { room } });
    }
  };

  return (
    <div className={`room-card ${!room.available ? 'room-unavailable' : ''}`}>
      <div className="room-card-image-wrapper">
        <img
          src={getRoomImage(room.roomType)}
          alt={room.roomType || 'Hotel Room'}
          className="room-card-image"
          loading="lazy"
        />
        <span
          className={`room-status-badge ${
            room.available ? 'badge-available' : 'badge-booked'
          }`}
        >
          {room.available ? 'Available' : 'Booked'}
        </span>
      </div>

      <div className="room-card-content">
        <div className="room-header">
          <h3 className="room-title">{room.roomType} Room</h3>
          <span className="room-number">Room #{room.roomNumber}</span>
        </div>

        <div className="room-specs">
          <span className="spec-item">
            👥 Capacity: <strong>{room.capacity} {room.capacity === 1 ? 'Guest' : 'Guests'}</strong>
          </span>
          <span className="spec-item">
            📶 Free High-Speed WiFi
          </span>
          <span className="spec-item">
            ❄️ Air Conditioned
          </span>
        </div>

        <div className="room-footer">
          <div className="room-price-box">
            <span className="price-label">Price</span>
            <span className="price-amount">₹{room.price}</span>
            <span className="price-unit">/ night</span>
          </div>

          <button
            onClick={handleBookNow}
            disabled={!room.available}
            data-testid={`book-btn-${room.roomId}`}
            className={`btn ${room.available ? 'btn-primary' : 'btn-disabled'}`}
          >
            {room.available ? 'Book Now' : 'Not Available'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
