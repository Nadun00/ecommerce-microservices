import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { paymentAPI } from '../services/api';

const PAYMENT_METHODS = [
  { id: 'credit_card',      label: '💳 Credit Card' },
  { id: 'debit_card',       label: '🏦 Debit Card' },
  { id: 'paypal',           label: '🅿️ PayPal' },
  { id: 'cash_on_delivery', label: '💵 Cash on Delivery' },
];

const PaymentPage = () => {
  const location  = useLocation();
  const navigate  = useNavigate();
  const { orderId, total } = location.state || {};

  const [selectedMethod, setSelectedMethod] = useState('');
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [manualOrderId, setManualOrderId] = useState(orderId || '');
  const [manualTotal, setManualTotal]     = useState(total || '');

  const handlePay = async () => {
    if (!selectedMethod) { alert('Please select a payment method.'); return; }
    if (!manualOrderId)  { alert('Order ID is required.'); return; }
    if (!manualTotal)    { alert('Amount is required.'); return; }

    setLoading(true);
    setResult(null);
    try {
      const res = await paymentAPI.create({
        orderId: manualOrderId,
        amount: parseFloat(manualTotal),
        paymentMethod: selectedMethod
      });
      setResult(res.data);
    } catch (err) {
      setResult({ paymentStatus: 'failed', message: 'Payment request failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Payment</h1>

      {result ? (
        <div style={{ maxWidth: '520px' }}>
          <div className={`alert alert-${result.paymentStatus === 'completed' ? 'success' : 'error'}`}
            style={{ fontSize: '1rem', padding: '1.2rem' }}>
            {result.paymentStatus === 'completed' ? '✅ ' : '❌ '}
            {result.message || (result.paymentStatus === 'completed' ? 'Payment successful!' : 'Payment failed.')}
          </div>
          {result.paymentStatus === 'completed' && (
            <div className="card" style={{ padding: '1.2rem', marginBottom: '1rem' }}>
              <p><strong>Payment ID:</strong> <span style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{result._id}</span></p>
              <p><strong>Order ID:</strong>   <span style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{result.orderId}</span></p>
              <p><strong>Amount:</strong>     ${result.amount?.toFixed(2)}</p>
              <p><strong>Method:</strong>     {result.paymentMethod?.replace('_', ' ')}</p>
              <p><strong>Status:</strong>     <span style={{ color: '#38a169', fontWeight: 600 }}>{result.paymentStatus}</span></p>
              <p><strong>Paid At:</strong>    {result.paidAt ? new Date(result.paidAt).toLocaleString() : '—'}</p>
            </div>
          )}
          <div style={{ display: 'flex', gap: '0.8rem' }}>
            <button className="btn btn-primary" onClick={() => navigate('/orders')}>View Orders</button>
            <button className="btn btn-secondary" onClick={() => { setResult(null); setSelectedMethod(''); }}>
              Try Again
            </button>
          </div>
        </div>
      ) : (
        <div className="payment-form">
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Complete Your Payment</h3>

          <div className="form-group">
            <label>Order ID</label>
            <input
              className="form-control"
              value={manualOrderId}
              onChange={e => setManualOrderId(e.target.value)}
              placeholder="Paste Order ID here"
            />
          </div>

          <div className="form-group">
            <label>Amount ($)</label>
            <input
              className="form-control"
              type="number"
              value={manualTotal}
              onChange={e => setManualTotal(e.target.value)}
              placeholder="e.g. 99.99"
              min="0"
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label>Select Payment Method</label>
            <div className="payment-methods">
              {PAYMENT_METHODS.map(method => (
                <div
                  key={method.id}
                  className={`payment-method-btn ${selectedMethod === method.id ? 'selected' : ''}`}
                  onClick={() => setSelectedMethod(method.id)}
                >
                  {method.label}
                </div>
              ))}
            </div>
          </div>

          <div className="alert alert-info" style={{ fontSize: '0.85rem' }}>
            ℹ️ This is a <strong>simulated payment</strong>. No real charges will occur.
          </div>

          <button
            className="btn btn-success"
            style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', fontSize: '1rem' }}
            onClick={handlePay}
            disabled={loading}
          >
            {loading ? 'Processing...' : '✓ Pay Now'}
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;
