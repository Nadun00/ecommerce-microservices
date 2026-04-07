import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productAPI, cartAPI } from '../services/api';
import { DEMO_USER_ID } from '../App';

const ProductDetailPage = ({ onCartUpdate }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [adding, setAdding]   = useState(false);

  useEffect(() => {
    productAPI.getById(id)
      .then(res => setProduct(res.data))
      .catch(() => setMessage({ type: 'error', text: 'Product not found.' }))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      await cartAPI.addItem({
        userId: DEMO_USER_ID,
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: 1
      });
      setMessage({ type: 'success', text: 'Added to cart!' });
      onCartUpdate();
    } catch {
      setMessage({ type: 'error', text: 'Failed to add to cart.' });
    } finally {
      setAdding(false);
      setTimeout(() => setMessage(null), 2500);
    }
  };

  if (loading) return <div className="page-container"><div className="loading">Loading product...</div></div>;

  if (!product) return (
    <div className="page-container">
      <div className="empty-state"><h3>Product not found</h3></div>
    </div>
  );

  return (
    <div className="page-container">
      <button className="btn btn-secondary btn-sm" style={{ marginBottom: '1.5rem' }} onClick={() => navigate(-1)}>
        ← Back
      </button>

      {message && (
        <div className={`alert alert-${message.type === 'success' ? 'success' : 'error'}`}>{message.text}</div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>
        <div>
          <img
            src={product.imageUrl || `https://picsum.photos/seed/${product._id}/500/350`}
            alt={product.name}
            style={{ width: '100%', borderRadius: '12px', objectFit: 'cover' }}
            onError={e => { e.target.src = 'https://via.placeholder.com/500x350?text=No+Image'; }}
          />
        </div>
        <div>
          <div className="text-muted" style={{ marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {product.category || 'General'}
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '1rem' }}>{product.name}</h1>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#2b6cb0', marginBottom: '1rem' }}>
            ${product.price?.toFixed(2)}
          </div>
          <p style={{ color: '#4a5568', lineHeight: '1.6', marginBottom: '1.5rem' }}>
            {product.description || 'No description available.'}
          </p>
          <div style={{ marginBottom: '1.5rem' }}>
            <span className={`stock-badge ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>
          <button
            className="btn btn-primary"
            style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}
            onClick={handleAddToCart}
            disabled={product.stock <= 0 || adding}
          >
            {adding ? 'Adding...' : '+ Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
