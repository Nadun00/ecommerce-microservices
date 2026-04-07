import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cartAPI, orderAPI } from '../services/api';
import { DEMO_USER_ID } from '../App';

const CartPage = ({ onCartUpdate }) => {
  const navigate = useNavigate();
  const [cart, setCart]       = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [placing, setPlacing] = useState(false);

  const fetchCart = async () => {
    try {
      const res = await cartAPI.getCart(DEMO_USER_ID);
      setCart(res.data);
    } catch {
      setMessage({ type: 'error', text: 'Failed to load cart.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCart(); }, []);

  const handleRemove = async (productId, name) => {
    try {
      await cartAPI.removeItem(productId, DEMO_USER_ID);
      setMessage({ type: 'success', text: `"${name}" removed from cart.` });
      fetchCart();
      onCartUpdate();
    } catch {
      setMessage({ type: 'error', text: 'Failed to remove item.' });
    }
    setTimeout(() => setMessage(null), 2500);
  };

  const handleClear = async () => {
    if (!window.confirm('Clear your entire cart?')) return;
    try {
      await cartAPI.clearCart(DEMO_USER_ID);
      setMessage({ type: 'success', text: 'Cart cleared.' });
      fetchCart();
      onCartUpdate();
    } catch {
      setMessage({ type: 'error', text: 'Failed to clear cart.' });
    }
    setTimeout(() => setMessage(null), 2500);
  };

  const handlePlaceOrder = async () => {
    if (cart.items.length === 0) return;
    setPlacing(true);
    try {
      const orderRes = await orderAPI.create({
        userId: DEMO_USER_ID,
        items: cart.items.map(i => ({
          productId: i.productId,
          name: i.name,
          price: i.price,
          quantity: i.quantity
        })),
        total: cart.total
      });
      await cartAPI.clearCart(DEMO_USER_ID);
      onCartUpdate();
      navigate('/payment', { state: { orderId: orderRes.data._id, total: cart.total } });
    } catch {
      setMessage({ type: 'error', text: 'Failed to place order. Try again.' });
      setPlacing(false);
    }
  };

  if (loading) return <div className="page-container"><div className="loading">Loading cart...</div></div>;

  return (
    <div className="page-container">
      <h1 className="page-title">Shopping Cart</h1>

      {message && (
        <div className={`alert alert-${message.type === 'success' ? 'success' : 'error'}`}>{message.text}</div>
      )}

      {cart.items.length === 0 ? (
        <div className="empty-state">
          <h3>Your cart is empty</h3>
          <p>Add some products from the home page.</p>
          <button className="btn btn-primary mt-2" onClick={() => navigate('/')}>Browse Products</button>
        </div>
      ) : (
        <div className="cart-container">
          <div>
            <div className="cart-items-list">
              {cart.items.map(item => (
                <div key={item.productId} className="cart-item">
                  <div className="cart-item-info">
                    <h4>{item.name}</h4>
                    <p>Qty: {item.quantity} × ${item.price?.toFixed(2)}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span className="cart-item-price">${(item.price * item.quantity).toFixed(2)}</span>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleRemove(item.productId, item.name)}
                    >Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>
            {cart.items.map(item => (
              <div className="summary-row" key={item.productId}>
                <span>{item.name} ×{item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="summary-row total">
              <span>Total</span>
              <span>${cart.total?.toFixed(2)}</span>
            </div>
            <div className="cart-actions">
              <button
                className="btn btn-success"
                style={{ justifyContent: 'center' }}
                onClick={handlePlaceOrder}
                disabled={placing}
              >
                {placing ? 'Placing Order...' : '✓ Place Order'}
              </button>
              <button
                className="btn btn-secondary"
                style={{ justifyContent: 'center' }}
                onClick={handleClear}
              >Clear Cart</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
