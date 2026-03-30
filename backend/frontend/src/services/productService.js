import axios from "axios";

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const baseURL = configuredBaseUrl
  ? configuredBaseUrl.replace(/\/+$/, "")
  : "https://exp7-1-mern-product-app.onrender.com/api";

const api = axios.create({
  baseURL,
  timeout: 15000
});

export const fetchProducts = async () => {
  const response = await api.get("/products");
  return response.data;
};

export const fetchSummary = async () => {
  const response = await api.get("/products/summary");
  return response.data;
};

export const fetchDashboard = async (params = {}) => {
  const response = await api.get("/products/dashboard", { params });
  return response.data;
};

export const viewProductDetails = async (productId) => {
  const response = await api.post(`/products/${productId}/view`);
  return response.data;
};
