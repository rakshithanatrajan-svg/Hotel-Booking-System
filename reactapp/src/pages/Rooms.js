import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { roomAPI } from '../services/api';
import RoomCard from '../components/RoomCard';

const Rooms = () => {
  const location = useLocation();
  const [rooms, setRooms] = useState([]);
  const [roomType, setRoomType] = useState('');
  const [capacity, setCapacity] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [availableOnly, setAvailableOnly] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('roomType')) setRoomType(params.get('roomType'));
    if (params.get('capacity')) setCapacity(params.get('capacity'));
  }, [location.search]);

  useEffect(() => {
    roomAPI.searchRooms({ roomType, capacity, minPrice, maxPrice }).then((res) => {
      let data = res.data || [];
      if (availableOnly) {
        data = data.filter((r) => r.available);
      }
      setRooms(data);
    });
  }, [roomType, capacity, minPrice, maxPrice, availableOnly]);

  const handleResetFilters = () => {
    setRoomType('');
    setCapacity('');
    setMinPrice('');
    setMaxPrice('');
    setAvailableOnly(false);
  };

  return (
    <div className="rooms-page container">
      <div className="page-header">
        <h1>Explore Our Rooms & Suites</h1>
        <p>Find the perfect room tailored to your comfort, preferences, and schedule.</p>
      </div>

      <div className="rooms-layout">
        <aside className="filters-sidebar">
          <div className="filters-header">
            <h3>Filter Rooms</h3>
            <button onClick={handleResetFilters} className="btn-link">Reset</button>
          </div>

          <div className="filter-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={availableOnly}
                onChange={(e) => setAvailableOnly(e.target.checked)}
              />
              <span>Show Available Only</span>
            </label>
          </div>

          <div className="filter-group">
            <label>Room Type</label>
            <select
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
            >
              <option value="">All Types</option>
              <option value="Standard">Standard</option>
              <option value="Deluxe">Deluxe</option>
              <option value="Suite">Suite</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Capacity</label>
            <select
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
            >
              <option value="">Any Capacity</option>
              <option value="1">1 Person</option>
              <option value="2">2 Persons</option>
              <option value="3">3 Persons</option>
              <option value="4">4+ Persons</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Price Range (₹/night)</label>
            <div className="price-inputs">
              <input
                type="number"
                placeholder="Min ₹"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                min="0"
              />
              <span>-</span>
              <input
                type="number"
                placeholder="Max ₹"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                min="0"
              />
            </div>
          </div>
        </aside>

        <main className="rooms-content">
          {rooms.length > 0 ? (
            <div className="rooms-grid">
              {rooms.map((room) => (
                <RoomCard key={room.roomId} room={room} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p className="empty-icon">🛏️</p>
              <h3>No Rooms Match Your Criteria</h3>
              <p>Try adjusting your search filters or check back later.</p>
              <button onClick={handleResetFilters} className="btn btn-secondary">
                Clear All Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Rooms;
