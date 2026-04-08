const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/paymentController');

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment management endpoints
 */

/**
 * @swagger
 * /api/payments:
 *   get:
 *     summary: Get all payments
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: List of payments
 */
router.get('/', ctrl.getAllPayments);

/**
 * @swagger
 * /api/payments/{id}:
 *   get:
 *     summary: Get payment by ID
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment found
 *       404:
 *         description: Not found
 */
router.get('/:id', ctrl.getPaymentById);

/**
 * @swagger
 * /api/payments:
 *   post:
 *     summary: Process a new payment
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *               - amount
 *               - paymentMethod
 *             properties:
 *               orderId:
 *                 type: string
 *                 example: "order_abc123"
 *               amount:
 *                 type: number
 *                 example: 199.98
 *               paymentMethod:
 *                 type: string
 *                 enum: [credit_card, debit_card, paypal, cash_on_delivery]
 *                 example: "credit_card"
 *     responses:
 *       201:
 *         description: Payment processed
 */
router.post('/', ctrl.createPayment);

/**
 * @swagger
 * /api/payments/{id}/status:
 *   put:
 *     summary: Update payment status
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentStatus:
 *                 type: string
 *                 enum: [pending, completed, failed, refunded]
 *                 example: "completed"
 *     responses:
 *       200:
 *         description: Status updated
 */
router.put('/:id/status', ctrl.updatePaymentStatus);

module.exports = router;
