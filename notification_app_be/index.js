const express = require('express');
const axios = require('axios');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const Log = require('../logging_middleware/logger');
const connectDB = require('../config/db');

const app = express();
const PORT = 5001;

// rate limiter-50 requests per 15 minutes
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    message: "too many notification requests, please try again later"
});

// connect to Database
connectDB();

app.use(limiter);
app.use(cors());
app.use(express.json());

const BASE_URL = process.env.BASE_URL;
const TOKEN = process.env.TOKEN;

const Notification = require('../models/Notification');

const TYPE_WEIGHTS = {
    'Placement': 3,
    'Result': 2,
    'Event': 1
};

// stage 6 - priority sorting logic 
const getTopNotifications = (notifications, N = 10) => {
    return notifications
        .map(notif => {
            const weight = TYPE_WEIGHTS[notif.Type] || 0;
            const time = new Date(notif.Timestamp).getTime();
            return { ...notif, score: (weight * 1000000000000) + time };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, N);
};

app.get('/api/notifications/inbox', async (req, res) => {
    try {
        Log("backend", "info", "controller", "fetching inbox notifications");

        // fetch from evaluation api
        const response = await axios.get(`${BASE_URL}/notifications`, {
            headers: {
                Authorization: `Bearer ${TOKEN}`
            }
        });

        const allNotifications = response.data;

        // Persistent storage (Stage 2)
        for (const notif of allNotifications) {
            await Notification.findOneAndUpdate(
                { originalId: notif.ID },
                {
                    userId: "student_101", // Assuming current student
                    originalId: notif.ID,
                    title: notif.Type,
                    message: notif.Message,
                    type: notif.Type.toLowerCase(),
                    createdAt: new Date(notif.Timestamp)
                },
                { upsert: true, new: true }
            );
        }

        // get top 10 by priority
        const top10 = getTopNotifications(allNotifications, 10);

        Log("backend", "info", "controller", `successfully fetched and sorted notifications`);

        res.json({
            success: true,
            count: top10.length,
            notifications: top10
        });
    } catch (error) {
        Log("backend", "error", "controller", `failed to fetch notifications-${error.message}`);
        res.status(500).json({
            success: false,
            message: "internal server error"
        });
    }
});

app.listen(PORT, () => {
    Log("backend", "info", "controller", `notification service running on port ${PORT}`);
});