import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const Navbar = ({ cartCount }) => {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        Shop<span>Ease</span>
      </Link>
      <div className="navbar-links">
        <NavLink to="/"        className={({ isActive }) => isActive ? 'active' : ''} end>Products</NavLink>
        <NavLink to="/cart"    className={({ isActive }) => isActive ? 'active' : ''}>
          Cart {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </NavLink>
        <NavLink to="/orders"  className={({ isActive }) => isActive ? 'active' : ''}>Orders</NavLink>
        <NavLink to="/payment" className={({ isActive }) => isActive ? 'active' : ''}>Payment</NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
