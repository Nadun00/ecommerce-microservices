import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import OrdersPage from './pages/OrdersPage';
import PaymentPage from './pages/PaymentPage';
import { cartAPI } from './services/api';

// Use a fixed userId for demo purposes (no auth required)
export const DEMO_USER_ID = 'demo-user-001';

function App() {
  const [cartCount, setCartCount] = useState(0);

  const refreshCartCount = async () => {
    try {
      const res = await cartAPI.getCart(DEMO_USER_ID);
      const total = res.data.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;
      setCartCount(total);
    } catch {
      setCartCount(0);
    }
  };

  useEffect(() => { refreshCartCount(); }, []);

  return (
    <Router>
      <Navbar cartCount={cartCount} />
      <Routes>
        <Route path="/"          element={<HomePage   onCartUpdate={refreshCartCount} />} />
        <Route path="/products/:id" element={<ProductDetailPage onCartUpdate={refreshCartCount} />} />
        <Route path="/cart"      element={<CartPage   onCartUpdate={refreshCartCount} />} />
        <Route path="/orders"    element={<OrdersPage />} />
        <Route path="/payment"   element={<PaymentPage />} />
      </Routes>
    </Router>
  );
}

export default App;
