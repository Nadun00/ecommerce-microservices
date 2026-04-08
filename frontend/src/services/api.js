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
  getAll:    ()       => api.get('/gateway/products'),
  getById:   (id)     => api.get(`/gateway/products/${id}`),
  create:    (data)   => api.post('/gateway/products', data),
  update:    (id, d)  => api.put(`/gateway/products/${id}`, d),
  delete:    (id)     => api.delete(`/gateway/products/${id}`),
};

// User Service calls
export const userAPI = {
  getAll:    ()       => api.get('/gateway/users'),
  getById:   (id)     => api.get(`/gateway/users/${id}`),
  create:    (data)   => api.post('/gateway/users', data),
  update:    (id, d)  => api.put(`/gateway/users/${id}`, d),
  delete:    (id)     => api.delete(`/gateway/users/${id}`),
};

// Cart Service calls
export const cartAPI = {
  getCart:   (userId)              => api.get(`/gateway/cart?userId=${userId}`),
  addItem:   (data)                => api.post('/gateway/cart/add', data),
  removeItem:(productId, userId)   => api.delete(`/gateway/cart/remove/${productId}?userId=${userId}`),
  clearCart: (userId)              => api.delete(`/gateway/cart/clear?userId=${userId}`),
};

// Order Service calls
export const orderAPI = {
  getAll:        (userId)  => api.get(`/gateway/orders${userId ? `?userId=${userId}` : ''}`),
  getById:       (id)      => api.get(`/gateway/orders/${id}`),
  create:        (data)    => api.post('/gateway/orders', data),
  updateStatus:  (id, s)   => api.put(`/gateway/orders/${id}/status`, { status: s }),
};

// Payment Service calls
export const paymentAPI = {
  getAll:        ()     => api.get('/gateway/payments'),
  getById:       (id)   => api.get(`/gateway/payments/${id}`),
  create:        (data) => api.post('/gateway/payments', data),
  updateStatus:  (id,s) => api.put(`/gateway/payments/${id}/status`, { paymentStatus: s }),
};

export default api;
