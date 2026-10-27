import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { roomAPI } from '../services/api';
import RoomCard from '../components/RoomCard';

const Home = () => {
  const navigate = useNavigate();
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [searchParams, setSearchParams] = useState({
    roomType: '',
    capacity: '',
    checkIn: '',
    checkOut: '',
  });

  useEffect(() => {
    roomAPI.getAvailableRooms().then((res) => {
      setFeaturedRooms((res.data || []).slice(0, 3));
    });
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (searchParams.roomType) query.append('roomType', searchParams.roomType);
    if (searchParams.capacity) query.append('capacity', searchParams.capacity);
    navigate(`/rooms?${query.toString()}`);
  };

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-overlay">
          <div className="hero-content">
            <span className="hero-subtitle">WELCOME TO HOTEL BOOKING SYSTEM</span>
            <h1 className="hero-title">Experience Pure Comfort & Modern Elegance</h1>
            <p className="hero-desc">
              Discover serene stays, world-class dining, and tailored luxury hospitality right at your fingertips.
            </p>

            <form onSubmit={handleSearchSubmit} className="search-widget">
              <div className="search-field">
                <label>Room Type</label>
                <select
                  value={searchParams.roomType}
                  onChange={(e) => setSearchParams({ ...searchParams, roomType: e.target.value })}
                >
                  <option value="">All Room Types</option>
                  <option value="Standard">Standard</option>
                  <option value="Deluxe">Deluxe</option>
                  <option value="Suite">Executive Suite</option>
                </select>
              </div>

              <div className="search-field">
                <label>Guests / Capacity</label>
                <select
                  value={searchParams.capacity}
                  onChange={(e) => setSearchParams({ ...searchParams, capacity: e.target.value })}
                >
                  <option value="">Any Capacity</option>
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="4">4 Guests</option>
                </select>
              </div>

              <div className="search-field">
                <label>Check-In Date</label>
                <input
                  type="date"
                  value={searchParams.checkIn}
                  onChange={(e) => setSearchParams({ ...searchParams, checkIn: e.target.value })}
                />
              </div>

              <div className="search-field">
                <label>Check-Out Date</label>
                <input
                  type="date"
                  value={searchParams.checkOut}
                  onChange={(e) => setSearchParams({ ...searchParams, checkOut: e.target.value })}
                />
              </div>

              <button type="submit" className="btn btn-search">
                🔍 Find Rooms
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="features-section container">
        <div className="section-header text-center">
          <h2>Why Choose Hotel Booking System?</h2>
          <p>We provide the best stay experience with unmatched hospitality</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">✨</div>
            <h3>Luxury Suites</h3>
            <p>Thoughtfully curated modern interiors and premium bedding for restful nights.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Instant Booking</h3>
            <p>Seamless real-time reservation confirmation with zero wait time.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Secure Payments</h3>
            <p>Industry-standard secure checkout integration for peace of mind.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🛎️</div>
            <h3>24/7 Concierge</h3>
            <p>Our dedicated staff is always available to attend to your special requests.</p>
          </div>
        </div>
      </section>

      <section className="featured-rooms-section container">
        <div className="section-header-flex">
          <div>
            <h2>Featured Available Rooms</h2>
            <p>Hand-picked selections ready for your next getaway</p>
          </div>
          <Link to="/rooms" className="btn btn-outline">
            View All Rooms &rarr;
          </Link>
        </div>

        <div className="rooms-grid">
          {featuredRooms.map((room) => (
            <RoomCard key={room.roomId} room={room} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
