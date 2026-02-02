const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { auth, isAdmin } = require('../middleware/auth');

// @route   POST /api/orders
// @desc    Create new order
// @access  Public (guest checkout allowed)
router.post('/', async (req, res) => {
    try {
        const { items, customer, paymentMethod, notes } = req.body;

        // Calculate total amount
        let totalAmount = 0;
        const orderItems = [];

        for (const item of items) {
            const product = await Product.findById(item.productId || item.product);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Product not found: ${item.productId || item.product}`
                });
            }

            totalAmount += product.price * item.quantity;

            orderItems.push({
                product: product._id,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
                image: product.images[0]?.url || ''
            });

            // Update product sales count
            product.sales += item.quantity;
            await product.save();
        }

        // Create order
        const order = new Order({
            user: req.userId || null,
            items: orderItems,
            totalAmount,
            customer,
            paymentMethod: paymentMethod || 'cod',
            notes: notes || ''
        });

        await order.save();

        res.status(201).json({
            success: true,
            message: 'Order placed successfully',
            order
        });
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error creating order'
        });
    }
});

// @route   GET /api/orders
// @desc    Get all orders (admin) or user orders
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        let query = {};

        // If not admin, only show user's orders
        if (!req.user.isAdmin) {
            query.user = req.userId;
        }

        const orders = await Order.find(query)
            .populate('items.product', 'name images')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: orders.length,
            orders
        });
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching orders'
        });
    }
});

// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Private
router.get('/:id', auth, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('items.product', 'name images');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Check if user owns this order or is admin
        if (!req.user.isAdmin && order.user.toString() !== req.userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        res.json({
            success: true,
            order
        });
    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching order'
        });
    }
});

// @route   PUT /api/orders/:id
// @desc    Update order status
// @access  Private (Admin only)
router.put('/:id', auth, isAdmin, async (req, res) => {
    try {
        const { status, trackingNumber, paymentStatus } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        if (status) order.status = status;
        if (trackingNumber) order.trackingNumber = trackingNumber;
        if (paymentStatus) order.paymentStatus = paymentStatus;

        await order.save();

        res.json({
            success: true,
            message: 'Order updated successfully',
            order
        });
    } catch (error) {
        console.error('Update order error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating order'
        });
    }
});

// @route   GET /api/orders/admin/all
// @desc    Get all orders with stats
// @access  Private (Admin only)
router.get('/admin/all', auth, isAdmin, async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('items.product', 'name')
            .sort({ createdAt: -1 });

        const stats = {
            total: orders.length,
            pending: orders.filter(o => o.status === 'pending').length,
            confirmed: orders.filter(o => o.status === 'confirmed').length,
            shipped: orders.filter(o => o.status === 'shipped').length,
            delivered: orders.filter(o => o.status === 'delivered').length,
            totalRevenue: orders.reduce((sum, o) => sum + o.totalAmount, 0)
        };

        res.json({
            success: true,
            stats,
            orders
        });
    } catch (error) {
        console.error('Get all orders error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching orders'
        });
    }
});

module.exports = router;
