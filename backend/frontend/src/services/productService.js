import axios from "axios";

const api = axios.create({
  // Yahan apna Render wala Backend URL dalo (Bina kisi variable ke)
  baseURL: "https://exp7-1-mern-product-app.onrender.com/api", 
  timeout: 15000 // Thoda extra time dete hain cloud server ko respond karne ke liye
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
