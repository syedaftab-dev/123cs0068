const express=require('express');
const cors=require('cors');
require('dotenv').config();

const Log=require('../logging_middleware/logger');

const app=express();
const PORT=process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

//I used logging middleware globally
app.use((req,res,next) => {
    Log("backend","inform","middleware",`${req.method} ${req.url}`);
    next();
});

// test api 
// app.get('/',(req, res)=>{
//     Log("backend", "info","controller","Health check endpoint accessed");
//     res.status(200).json({ 
//         success: true, 
//         message: "API is running perfectly" 
//     });
// });

// register api
app.post('/api/vehicles',async (req, res)=>{
    try
    {
        const {vehicleNo,ownerName,serviceDate,model} = req.body;

        if (!vehicleNo || !ownerName) {
            Log("backend","warning","controller","fields are mmissing,please fill everything");
            return res.status(400).json(
                { success: false, 
                    message: "vehicle no and owner name are required" });
        }

        Log("backend","info","controller",`vehicle - ${vehicleNo} registered successfully`);

        res.status(201).json({
            success: true,
            message: "vehicle registered for repair",
            data: {vehicleNo,ownerName,nextService: serviceDate}
        });
    }
    catch(e){
        Log("backend","error","controller",`vehicle registration faile-${error.message}`);
        res.status(500).json({ success: false, message: "internal server error"});
    }
});

// api to get all maintenance reminder records
app.get('/api/maintenance/reminders',(req, res)=>{
    Log("backend","info","controller","fetching repair reminders");
    
    res.status(200).json({
        success: true,
        reminders: [
            { 
                id:1,
                vehicleNo:"TS09AB1254", 
                dueDate: "2026-05-20", 
                task: "oil change", 
                status: "pending"
            },
            { 
                id:2,
                vehicleNo:"TS09CD5648",
                dueDate: "2026-05-15", 
                task: "brake wire damaged", 
                status: "urgent" }
        ]
    });
});

// Global Error Handler
app.use((err,req,res,next) => {
    Log("backend","error","middleware",`unknown error-${err.message}`);
    res.status(500).json({ 
        success: false, 
        message: "some error occured" 
    });
});

app.listen(PORT,()=>{
    Log("backend","info","controller",`server running on port ${PORT}`);
    console.log(`server running at PORT${PORT}`);
});