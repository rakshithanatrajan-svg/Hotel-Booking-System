import api, { bookingAPI, roomAPI, authAPI, paymentAPI, adminAPI, userAPI } from '../services/api';

export const getRooms = (availableOnly = false) => {
  return availableOnly ? roomAPI.getAvailableRooms() : roomAPI.getAllRooms();
};

export const getBookings = () => {
  return bookingAPI.getAllBookings();
};

export const createBooking = (data) => {
  return bookingAPI.createBooking(data);
};

export const updateBookingStatus = (id, status) => {
  return bookingAPI.updateBookingStatus(id, status);
};

export { api, bookingAPI, roomAPI, authAPI, paymentAPI, adminAPI, userAPI };
export default api;
