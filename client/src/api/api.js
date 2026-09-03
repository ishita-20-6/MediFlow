import axios from "axios";

// In dev, Vite proxies "/api" to localhost:5000 (see vite.config.js).
// In production the frontend is usually on a different domain than the
// backend, so set VITE_API_URL (e.g. https://your-backend.onrender.com/api)
// as a build-time env var on your hosting platform.
const baseURL = import.meta.env.VITE_API_URL || "/api";
const api = axios.create({ baseURL });

export const uploadPrescription = (formData) =>
  api.post("/prescriptions/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getPrescription = (id) => api.get(`/prescriptions/${id}`);

export const generateToken = (prescriptionId) =>
  api.post(`/tokens/generate/${prescriptionId}`);

export const getToken = (id) => api.get(`/tokens/${id}`);

export const getCounterQueue = (counterNumber) =>
  api.get(`/tokens/queue/${counterNumber}`);

export const checkMedicineAvailability = (name) =>
  api.get(`/inventory/check`, { params: { name } });

export default api;
