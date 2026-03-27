import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  timeout: 10000
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
