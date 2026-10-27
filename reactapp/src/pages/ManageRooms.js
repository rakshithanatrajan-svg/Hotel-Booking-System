import React, { useState, useEffect } from 'react';
import { roomAPI } from '../services/api';

const ManageRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [message, setMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [formData, setFormData] = useState({
    roomNumber: '',
    roomType: 'Standard',
    price: '',
    capacity: 2,
    available: true,
  });

  const loadRooms = () => {
    roomAPI.getAllRooms().then((res) => setRooms(res.data || []));
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingRoom(null);
    setFormData({
      roomNumber: '',
      roomType: 'Standard',
      price: '',
      capacity: 2,
      available: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (room) => {
    setEditingRoom(room);
    setFormData({
      roomNumber: room.roomNumber,
      roomType: room.roomType,
      price: room.price,
      capacity: room.capacity,
      available: room.available,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRoom(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.roomNumber || !formData.price || !formData.capacity) return;

    const payload = {
      roomNumber: formData.roomNumber,
      roomType: formData.roomType,
      price: Number(formData.price),
      capacity: Number(formData.capacity),
      available: formData.available,
    };

    if (editingRoom) {
      await roomAPI.updateRoom(editingRoom.roomId, payload);
      setMessage(`Room #${formData.roomNumber} updated successfully!`);
    } else {
      await roomAPI.addRoom(payload);
      setMessage(`Room #${formData.roomNumber} created successfully!`);
    }

    handleCloseModal();
    loadRooms();
  };

  const handleDelete = async (roomId, roomNumber) => {
    if (!window.confirm(`Are you sure you want to delete Room #${roomNumber}?`)) return;
    await roomAPI.deleteRoom(roomId);
    setMessage(`Room #${roomNumber} deleted successfully.`);
    loadRooms();
  };

  return (
    <div className="manage-rooms-page container">
      <div className="page-header-flex">
        <div>
          <h1>Manage Room Inventory</h1>
          <p>Add new rooms, modify rates and capacities, or update room status.</p>
        </div>
        <button onClick={handleOpenCreateModal} className="btn btn-primary">
          ➕ Add New Room
        </button>
      </div>

      {message && <div className="alert alert-success">{message}</div>}

      {rooms.length > 0 ? (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Room ID</th>
                <th>Room Number</th>
                <th>Type</th>
                <th>Capacity</th>
                <th>Price / Night</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room.roomId}>
                  <td>#{room.roomId}</td>
                  <td><strong>Room {room.roomNumber}</strong></td>
                  <td>{room.roomType}</td>
                  <td>{room.capacity} Guests</td>
                  <td>₹{room.price}</td>
                  <td>
                    <span
                      className={`badge ${
                        room.available ? 'badge-available' : 'badge-booked'
                      }`}
                    >
                      {room.available ? 'Available' : 'Booked / Unavailable'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => handleOpenEditModal(room)}
                        className="btn-sm btn-secondary"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(room.roomId, room.roomNumber)}
                        className="btn-sm btn-danger"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <p className="empty-icon">🏨</p>
          <h3>No Rooms Registered</h3>
          <p>Get started by adding your first hotel room to the inventory.</p>
          <button onClick={handleOpenCreateModal} className="btn btn-primary">
            Add Room
          </button>
        </div>
      )}

      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingRoom ? `Edit Room #${editingRoom.roomNumber}` : 'Add New Room'}</h3>
              <button onClick={handleCloseModal} className="btn-close">×</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Room Number *</label>
                <input
                  type="text"
                  placeholder="e.g. 101, 204A"
                  value={formData.roomNumber}
                  onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Room Type *</label>
                <select
                  value={formData.roomType}
                  onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
                >
                  <option value="Standard">Standard</option>
                  <option value="Deluxe">Deluxe</option>
                  <option value="Suite">Executive Suite</option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price Per Night (₹) *</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="1500"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Guest Capacity *</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="2"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.available}
                    onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                  />
                  <span>Mark as Available for Booking</span>
                </label>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={handleCloseModal} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingRoom ? 'Save Changes' : 'Create Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageRooms;
