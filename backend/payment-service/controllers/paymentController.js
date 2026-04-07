const Payment = require('../models/Payment');

exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    res.json(payment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createPayment = async (req, res) => {
  try {
    const { orderId, amount, paymentMethod } = req.body;
    if (!orderId || !amount || !paymentMethod) {
      return res.status(400).json({ message: 'orderId, amount, and paymentMethod are required' });
    }

    // Simulate payment processing (90% success rate)
    const isSuccess = Math.random() > 0.1;

    const payment = new Payment({
      orderId,
      amount,
      paymentMethod,
      paymentStatus: isSuccess ? 'completed' : 'failed',
      paidAt: isSuccess ? new Date() : undefined
    });

    const saved = await payment.save();
    res.status(201).json({
      ...saved.toObject(),
      message: isSuccess ? 'Payment processed successfully!' : 'Payment failed. Please try again.'
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    const updateData = { paymentStatus };
    if (paymentStatus === 'completed') updateData.paidAt = new Date();

    const updated = await Payment.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updated) return res.status(404).json({ message: 'Payment not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
