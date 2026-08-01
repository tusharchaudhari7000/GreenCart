import api from './api';

// All requests now go through API Gateway (port 8080)
// Gateway routes:
// - Product Service: /categories/**, /products/**, /stocks/**
// - Buyer Service: /api/orders/**, /api/cart/**, /api/farmer/orders/**

const farmerApi = {
  get: (url, config) => api.get(url, config),
  post: (url, data, config) => api.post(url, data, config),
  put: (url, data, config) => api.put(url, data, config),
  delete: (url, config) => api.delete(url, config),
  patch: (url, data, config) => api.patch(url, data, config),
};

const farmerOrderApi = {
  get: (url, config) => api.get(url, config),
  post: (url, data, config) => api.post(url, data, config),
  put: (url, data, config) => api.put(url, data, config),
  delete: (url, config) => api.delete(url, config),
  patch: (url, data, config) => api.patch(url, data, config),
};

export { farmerOrderApi };
export default farmerApi;
