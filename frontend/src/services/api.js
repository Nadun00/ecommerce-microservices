import axios from 'axios';

// ============================================================
// ALL API calls go ONLY through the API Gateway (port 5000)
// The frontend never calls individual service ports directly.
// This is the key requirement of microservices architecture.
// ============================================================
const GATEWAY_URL = 'http://localhost:5000';

const api = axios.create({ baseURL: GATEWAY_URL });

// Product Service calls
export const productAPI = {
  getAll:    ()       => api.get('/api/products'),
  getById:   (id)     => api.get(`/api/products/${id}`),
  create:    (data)   => api.post('/api/products', data),
  update:    (id, d)  => api.put(`/api/products/${id}`, d),
  delete:    (id)     => api.delete(`/api/products/${id}`),
};

// User Service calls
export const userAPI = {
  getAll:    ()       => api.get('/api/users'),
  getById:   (id)     => api.get(`/api/users/${id}`),
  create:    (data)   => api.post('/api/users', data),
  update:    (id, d)  => api.put(`/api/users/${id}`, d),
  delete:    (id)     => api.delete(`/api/users/${id}`),
};

// Cart Service calls
export const cartAPI = {
  getCart:   (userId)              => api.get(`/api/cart?userId=${userId}`),
  addItem:   (data)                => api.post('/api/cart/add', data),
  removeItem:(productId, userId)   => api.delete(`/api/cart/remove/${productId}?userId=${userId}`),
  clearCart: (userId)              => api.delete(`/api/cart/clear?userId=${userId}`),
};

// Order Service calls
export const orderAPI = {
  getAll:        (userId)  => api.get(`/api/orders${userId ? `?userId=${userId}` : ''}`),
  getById:       (id)      => api.get(`/api/orders/${id}`),
  create:        (data)    => api.post('/api/orders', data),
  updateStatus:  (id, s)   => api.put(`/api/orders/${id}/status`, { status: s }),
};

// Payment Service calls
export const paymentAPI = {
  getAll:        ()     => api.get('/api/payments'),
  getById:       (id)   => api.get(`/api/payments/${id}`),
  create:        (data) => api.post('/api/payments', data),
  updateStatus:  (id,s) => api.put(`/api/payments/${id}/status`, { paymentStatus: s }),
};

export default api;
