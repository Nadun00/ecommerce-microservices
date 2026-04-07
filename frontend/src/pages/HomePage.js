import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI, cartAPI } from '../services/api';
import { DEMO_USER_ID } from '../App';

const HomePage = ({ onCartUpdate }) => {
  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [adding, setAdding]       = useState(null);
  const [message, setMessage]     = useState(null);

  useEffect(() => {
    productAPI.getAll()
      .then(res => setProducts(res.data))
      .catch(() => setMessage({ type: 'error', text: 'Failed to load products. Is the backend running?' }))
      .finally(() => setLoading(false));
  }, []);

  const handleAddToCart = async (product) => {
    if (product.stock <= 0) return;
    setAdding(product._id);
    try {
      await cartAPI.addItem({
        userId: DEMO_USER_ID,
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: 1
      });
      setMessage({ type: 'success', text: `"${product.name}" added to cart!` });
      onCartUpdate();
    } catch {
      setMessage({ type: 'error', text: 'Failed to add to cart.' });
    } finally {
      setAdding(null);
      setTimeout(() => setMessage(null), 2500);
    }
  };

  return (
    <div className="page-container">
      <div className="hero">
        <h1>Welcome to <span>ShopEase</span></h1>
        <p>A microservices-based e-commerce demo built with Node.js, Express, MongoDB & React</p>
      </div>

      {message && (
        <div className={`alert alert-${message.type === 'success' ? 'success' : 'error'}`}>
          {message.text}
        </div>
      )}

      <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
        <h2 className="page-title" style={{ margin: 0 }}>All Products</h2>
        <span className="text-muted">{products.length} items</span>
      </div>

      {loading && <div className="loading">Loading products...</div>}

      {!loading && products.length === 0 && (
        <div className="empty-state">
          <h3>No products found</h3>
          <p>Add some products using the API or Swagger UI first.</p>
          <a href="http://localhost:5000/product-docs" target="_blank" rel="noreferrer"
            className="btn btn-primary mt-2">Open Swagger Docs</a>
        </div>
      )}

      <div className="products-grid">
        {products.map(product => (
          <div key={product._id} className="card product-card">
            <Link to={`/products/${product._id}`}>
              <img
                src={product.imageUrl || `https://picsum.photos/seed/${product._id}/300/180`}
                alt={product.name}
                onError={e => { e.target.src = 'https://via.placeholder.com/300x180?text=No+Image'; }}
              />
            </Link>
            <div className="card-body">
              <div className="product-category">{product.category || 'General'}</div>
              <Link to={`/products/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="product-name">{product.name}</div>
              </Link>
              <div className="product-description">{product.description || 'No description available.'}</div>
              <div className="product-footer">
                <span className="product-price">${product.price?.toFixed(2)}</span>
                <span className={`stock-badge ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
              </div>
              <button
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '0.75rem', justifyContent: 'center' }}
                onClick={() => handleAddToCart(product)}
                disabled={product.stock <= 0 || adding === product._id}
              >
                {adding === product._id ? 'Adding...' : '+ Add to Cart'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
