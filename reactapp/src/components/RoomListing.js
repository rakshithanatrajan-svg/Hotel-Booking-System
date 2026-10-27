import React, { useState, useEffect, useCallback } from 'react';
import { getRooms } from '../utils/api';

const RoomListing = ({ onSelectRoom }) => {
  const [rooms, setRooms] = useState([]);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadRooms = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getRooms(availableOnly);
      setRooms(res.data || []);
    } catch (err) {
      setError('Could not load rooms');
    } finally {
      setLoading(false);
    }
  }, [availableOnly]);

  useEffect(() => {
    loadRooms();
  }, [loadRooms]);

  return (
    <div className="room-listing-component">
      <div className="filter-controls">
        <label htmlFor="showAvailableOnly">
          <input
            id="showAvailableOnly"
            type="checkbox"
            checked={availableOnly}
            onChange={(e) => setAvailableOnly(e.target.checked)}
          />
          Show Available Only
        </label>
      </div>

      {loading && <div>Loading rooms...</div>}
      {error && <div className="error-message">{error}</div>}

      {!loading && !error && (
        <table className="rooms-table">
          <thead>
            <tr>
              <th>Room Number</th>
              <th>Type</th>
              <th>Price</th>
              <th>Capacity</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.roomId}>
                <td>{room.roomNumber}</td>
                <td>{room.roomType}</td>
                <td>₹{room.pricePerNight || room.price}</td>
                <td>{room.capacity}</td>
                <td>
                  <span className={`badge ${room.available ? 'badge-available' : 'badge-booked'}`}>
                    {room.available ? 'Available' : 'Booked'}
                  </span>
                </td>
                <td>
                  <button
                    data-testid={`book-btn-${room.roomId}`}
                    disabled={!room.available}
                    onClick={() => onSelectRoom && onSelectRoom(room)}
                    className="btn btn-primary"
                  >
                    Book Now
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

export default RoomListing;
