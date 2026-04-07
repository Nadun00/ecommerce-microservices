import React, { useState, useEffect } from 'react';
import { orderAPI } from '../services/api';
import { DEMO_USER_ID } from '../App';

const statusClass = (s) => {
  const map = { pending:'pending', confirmed:'confirmed', shipped:'shipped', delivered:'delivered', cancelled:'cancelled' };
  return `status-badge status-${map[s] || 'pending'}`;
};

const OrdersPage = () => {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    orderAPI.getAll(DEMO_USER_ID)
      .then(res => setOrders(res.data))
      .catch(() => setMessage({ type: 'error', text: 'Failed to load orders.' }))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-container"><div className="loading">Loading orders...</div></div>;

  return (
    <div className="page-container">
      <h1 className="page-title">My Orders</h1>

      {message && <div className={`alert alert-error`}>{message.text}</div>}

      {orders.length === 0 ? (
        <div className="empty-state">
          <h3>No orders yet</h3>
          <p>Place an order from your cart to see it here.</p>
        </div>
      ) : (
        orders.map(order => (
          <div key={order._id} className="order-card">
            <div className="order-header">
              <div>
                <div className="order-id">Order # {order._id}</div>
                <div className="order-date">{new Date(order.createdAt).toLocaleString()}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span className="order-total">${order.total?.toFixed(2)}</span>
                <span className={statusClass(order.status)}>{order.status}</span>
              </div>
            </div>
            <div className="divider" />
            <ul className="order-items">
              {order.items?.map((item, i) => (
                <li key={i}>• {item.name} × {item.quantity} — ${(item.price * item.quantity).toFixed(2)}</li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default OrdersPage;
