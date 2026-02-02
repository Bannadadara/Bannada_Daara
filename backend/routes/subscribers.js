const express = require('express');
const router = express.Router();
const Subscriber = require('../models/Subscriber');
const { auth, isAdmin } = require('../middleware/auth');

// @route   POST /api/subscribers
// @desc    Add new subscriber
// @access  Public
router.post('/', async (req, res) => {
    try {
        const { email } = req.body;

        // Check if already subscribed
        const existing = await Subscriber.findOne({ email });

        if (existing) {
            if (existing.isActive) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already subscribed'
                });
            } else {
                // Reactivate subscription
                existing.isActive = true;
                await existing.save();

                return res.json({
                    success: true,
                    message: 'Subscription reactivated successfully'
                });
            }
        }

        // Create new subscriber
        const subscriber = new Subscriber({ email });
        await subscriber.save();

        res.status(201).json({
            success: true,
            message: 'Successfully subscribed to newsletter'
        });
    } catch (error) {
        console.error('Subscribe error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error subscribing to newsletter'
        });
    }
});

// @route   GET /api/subscribers
// @desc    Get all subscribers
// @access  Private (Admin only)
router.get('/', auth, isAdmin, async (req, res) => {
    try {
        const subscribers = await Subscriber.find({ isActive: true })
            .sort({ subscribedAt: -1 });

        res.json({
            success: true,
            count: subscribers.length,
            subscribers
        });
    } catch (error) {
        console.error('Get subscribers error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching subscribers'
        });
    }
});

// @route   DELETE /api/subscribers/:email
// @desc    Unsubscribe
// @access  Public
router.delete('/:email', async (req, res) => {
    try {
        const subscriber = await Subscriber.findOne({ email: req.params.email });

        if (!subscriber) {
            return res.status(404).json({
                success: false,
                message: 'Email not found in subscribers list'
            });
        }

        subscriber.isActive = false;
        await subscriber.save();

        res.json({
            success: true,
            message: 'Successfully unsubscribed from newsletter'
        });
    } catch (error) {
        console.error('Unsubscribe error:', error);
        res.status(500).json({
            success: false,
            message: 'Error unsubscribing'
        });
    }
});

module.exports = router;
