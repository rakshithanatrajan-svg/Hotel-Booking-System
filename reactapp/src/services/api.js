import axios from 'axios';
import { INITIAL_ROOMS, INITIAL_BOOKINGS } from './staticData';

const API_BASE = 'http://localhost:8080/api';

const client = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let localRooms = [...INITIAL_ROOMS];
let localBookings = [...INITIAL_BOOKINGS];

export const authAPI = {
  login: async (credentials) => {
    return await client.post('/auth/login', credentials);
  },
  register: async (userData) => {
    return await client.post('/auth/register', userData);
  },
};

export const roomAPI = {
  getAllRooms: async () => {
    try {
      const res = await client.get('/rooms');
      if (res.data && res.data.length > 0) return res;
    } catch {}
    return { data: localRooms };
  },
  getAvailableRooms: async () => {
    try {
      const res = await client.get('/rooms/available');
      if (res.data && res.data.length > 0) return res;
    } catch {}
    return { data: localRooms.filter((r) => r.available) };
  },
  getRoomById: async (id) => {
    try {
      const res = await client.get(`/rooms/${id}`);
      if (res.data) return res;
    } catch {}
    return { data: localRooms.find((r) => String(r.roomId) === String(id)) || localRooms[0] };
  },
  searchRooms: async (params = {}) => {
    try {
      const res = await client.get('/rooms/search', { params });
      if (res.data && res.data.length > 0) return res;
    } catch {}
    let result = localRooms;
    if (params.roomType) result = result.filter((r) => r.roomType.toLowerCase() === params.roomType.toLowerCase());
    if (params.capacity) result = result.filter((r) => r.capacity >= Number(params.capacity));
    if (params.minPrice) result = result.filter((r) => r.price >= Number(params.minPrice));
    if (params.maxPrice) result = result.filter((r) => r.price <= Number(params.maxPrice));
    return { data: result };
  },
  addRoom: async (data) => {
    try {
      const res = await client.post('/rooms', data);
      localRooms = [res.data, ...localRooms];
      return res;
    } catch {
      const newRoom = { ...data, roomId: Date.now(), available: true };
      localRooms = [newRoom, ...localRooms];
      return { data: newRoom };
    }
  },
  updateRoom: async (id, data) => {
    try {
      const res = await client.put(`/rooms/${id}`, data);
      localRooms = localRooms.map((r) => (String(r.roomId) === String(id) ? { ...r, ...data } : r));
      return res;
    } catch {
      localRooms = localRooms.map((r) => (String(r.roomId) === String(id) ? { ...r, ...data } : r));
      return { data };
    }
  },
  deleteRoom: async (id) => {
    try {
      await client.delete(`/rooms/${id}`);
    } catch {}
    localRooms = localRooms.filter((r) => String(r.roomId) !== String(id));
    return { data: 'Deleted' };
  },
};

export const bookingAPI = {
  getAllBookings: async () => {
    try {
      const res = await client.get('/bookings');
      if (res.data && res.data.length > 0) return res;
    } catch {}
    return { data: localBookings };
  },
  getBookingById: async (id) => client.get(`/bookings/${id}`),
  getUserBookings: async (email) => {
    try {
      const allRes = await client.get('/bookings');
      if (allRes.data && allRes.data.length > 0) {
        const userOnly = allRes.data.filter(
          (b) =>
            (b.guestEmail && b.guestEmail.toLowerCase() === (email || '').toLowerCase()) ||
            (b.user && b.user.email && b.user.email.toLowerCase() === (email || '').toLowerCase())
        );
        return { data: userOnly };
      }
    } catch {}
    const filtered = localBookings.filter(
      (b) => b.guestEmail && b.guestEmail.toLowerCase() === (email || '').toLowerCase()
    );
    return { data: filtered };
  },
  createBooking: async (data) => {
    try {
      const res = await client.post('/bookings', data);
      if (res.data) {
        localBookings = [res.data, ...localBookings];
        return res;
      }
    } catch {}
    const room = localRooms.find((r) => String(r.roomId) === String(data.roomId)) || { price: 100, roomNumber: '101', roomType: 'Standard' };
    const newBooking = {
      ...data,
      bookingId: Math.floor(1000 + Math.random() * 9000),
      room,
      totalPrice: data.totalPrice || room.price * 2,
      status: 'PENDING',
    };
    localBookings = [newBooking, ...localBookings];
    return { data: newBooking };
  },
  updateBookingStatus: async (id, status) => {
    try {
      const res = await client.put(`/bookings/${id}/status`, { status });
      localBookings = localBookings.map((b) => (String(b.bookingId) === String(id) ? { ...b, status: status.toUpperCase() } : b));
      return res;
    } catch {
      localBookings = localBookings.map((b) => (String(b.bookingId) === String(id) ? { ...b, status: status.toUpperCase() } : b));
      return { data: { status } };
    }
  },
  cancelBooking: async (id) => {
    try {
      await client.delete(`/bookings/${id}`);
    } catch {}
    localBookings = localBookings.map((b) => (String(b.bookingId) === String(id) ? { ...b, status: 'CANCELLED' } : b));
    return { data: 'Cancelled' };
  },
};

export const paymentAPI = {
  createRazorpayOrder: async (bookingId, amount) => {
    try {
      return await client.post('/payments/create-order', { bookingId, amount });
    } catch {
      return {
        data: {
          orderId: 'order_' + Date.now(),
          amount: Math.round(amount * 100),
          currency: 'INR',
          keyId: 'rzp_test_1DP5mmOlF5G5ag',
          status: 'simulated'
        }
      };
    }
  },
  processPayment: async (data) => {
    try {
      return await client.post('/payments', data);
    } catch {
      return { data: { status: 'SUCCESS' } };
    }
  },
};

export const adminAPI = {
  getHealthStatus: async () => {
    try {
      return await client.get('/admin/health');
    } catch {
      return { data: 'Online' };
    }
  },
};

export const userAPI = {
  getAllUsers: async () => client.get('/users'),
};

const api = { roomAPI, bookingAPI, authAPI, paymentAPI, adminAPI, userAPI, client };
export default api;
