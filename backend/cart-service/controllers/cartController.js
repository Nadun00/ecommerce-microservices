const Cart = require('../models/Cart');

// Helper: recalculate total
const calcTotal = (items) => items.reduce((sum, item) => sum + item.price * item.quantity, 0);

// GET cart by userId (query param ?userId=xxx)
exports.getCart = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: 'userId query param required' });
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.json({ userId, items: [], total: 0 });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST add item to cart
exports.addToCart = async (req, res) => {
  try {
    const { userId, productId, name, price, quantity } = req.body;
    if (!userId || !productId || !name || !price) {
      return res.status(400).json({ message: 'userId, productId, name, and price are required' });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [], total: 0 });
    }

    const existingItem = cart.items.find(i => i.productId === productId);
    if (existingItem) {
      existingItem.quantity += quantity || 1;
    } else {
      cart.items.push({ productId, name, price, quantity: quantity || 1 });
    }

    cart.total = calcTotal(cart.items);
    const saved = await cart.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: 'userId query param required' });

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(i => i.productId !== productId);
    cart.total = calcTotal(cart.items);
    const saved = await cart.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE clear entire cart
exports.clearCart = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: 'userId query param required' });

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = [];
    cart.total = 0;
    await cart.save();
    res.json({ message: 'Cart cleared successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
