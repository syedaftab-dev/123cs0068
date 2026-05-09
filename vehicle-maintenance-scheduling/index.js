const express = require('express');
const axios = require('axios');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const Log = require('../logging_middleware/logger');
const connectDB = require('../config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// rate limiter-100 requests per 15 minutes
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "too many requests from this ip,please try again after 15 minutes"
});

app.use(limiter);
app.use(cors());
app.use(express.json());

const BASE_URL = process.env.BASE_URL;
const TOKEN = process.env.TOKEN;

// helper function to fetch evaluation data
const fetchEvaluationData = async (endpoint) => {
    try 
    {
        const response = await axios.get(`${BASE_URL}/${endpoint}`, {
            headers: {
                 Authorization: `Bearer ${TOKEN}` 
                }
        });

        return response.data;
    }
    catch(e) {
        Log("backend","error","controller",`failed to fetch ${endpoint}-${e.message}`);
        throw e;
    }
};

// i used knapsack fro scheduling
const getOptimalTasks = (tasks, maxHours) => {
    const n = tasks.length;
    const dp = Array.from({ 
        length: n + 1 }, 
        () => Array(maxHours + 1).fill(0));

    for (let i = 1;i<=n;i++) {
        const { Duration,Impact}= tasks[i - 1];
        for (let w =0;w<=maxHours;w++) {
            if (Duration <= w) {
                dp[i][w] = Math.max(Impact+dp[i - 1][w - Duration],dp[i - 1][w]);
            } else {
                dp[i][w] = dp[i - 1][w];
            }
        }
    }

    const selectedTasks = [];
    let w = maxHours;
    for (let i = n; i > 0 && w > 0; i--) {
        if (dp[i][w] !== dp[i - 1][w]) {
            selectedTasks.push(tasks[i - 1]);
            w-=tasks[i - 1].Duration;
        }
    }

    return {
        selectedTasks,
        totalImpact: dp[n][maxHours],
        totalDuration: maxHours - w
    };
};

app.get('/api/scheduling/optimize', async (req, res) => {
    try 
    {
        Log("backend", "info", "controller", "Starting optimization request");

        //fetch depot data
        const depotData = await fetchEvaluationData('depot');
        const maxHours = depotData.availableMechanicHours || 10; 

        //fetch vehicle tasks
        const vehicles = await fetchEvaluationData('vehicles');
        
        if (!vehicles || vehicles.length === 0) {
            Log("backend","warn","controller","no vehicles found for scheduling");
            return res.json({ message: "no tasks available" });
        }

        // Save to Database stage 2 persistence
        const Vehicle = require('../models/Vehicle');
        for (const task of vehicles) {
            await Vehicle.findOneAndUpdate(
                { vehicleNo: task.TaskID }, 
                {
                    vehicleNo: task.TaskID,
                    ownerName: "Assigned Depot",
                    serviceDate: new Date(),
                    model: "Truck",
                    tasks: [{ taskName: `Service ${task.TaskID}`, isCompleted: false }],
                    duration: task.Duration,
                    impact: task.Impact
                },
                { upsert: true, new: true }
            );
        }

        // optimizing using knapsack function we made earlier
        const result = getOptimalTasks(vehicles, maxHours);

        Log("backend","info","controller",`optimization complete. Total impact: ${result.totalImpact}`);

        res.json({
            success: true,
            depot: depotData,
            optimization: result
        });
    }catch(e){
        Log("backend", "error", "controller", `optimization failed: ${e.message}`);
        res.status(500).json({ 
            success: false,
             message: "optimization failed" 
            });
    }
});

app.listen(PORT,() => {
    Log("backend","info", "controller",`scheduling service running on port ${PORT}`);
});
