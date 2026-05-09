const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const Log = require('../logging_middleware/logger');
const connectDB = require('../config/db');

const app=express();
const PORT=5001; 
// connect to Database
connectDB();

app.use(cors());
app.use(express.json());

const BASE_URL=process.env.BASE_URL;
const TOKEN=process.env.TOKEN;

const TYPE_WEIGHTS={
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

app.get('/api/notifications/inbox',async(req, res)=>{
    try
    {
        Log("backend","info","controller","fetching inbox notifications");

        // fetch from evaluation api
        const response=await axios.get(`${BASE_URL}/notifications`,{
            headers: { 
                Authorization: `Bearer ${TOKEN}` 
            }
        });

        const allNotifications = response.data;
        
        // get top 10 by priority
        const top10 = getTopNotifications(allNotifications, 10);

        Log("backend", "info", "controller", `Successfully fetched and sorted ${top10.length} notifications`);

        res.json({
            success: true,
            count: top10.length,
            notifications: top10
        });
    } catch (error) {
        Log("backend","error","controller",`failed to fetch notifications-${error.message}`);
        res.status(500).json({ 
            success: false,
             message: "internal server error" 
            });
    }
});

app.listen(PORT, () => {
    Log("backend","info","controller",`notification service running on port ${PORT}`);
});