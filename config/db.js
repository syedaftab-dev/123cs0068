const mongoose=require('mongoose');
const Log=require('../logging_middleware/logger');

const connectDB = async () => {
    try 
    {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        Log("backend","info","db",`mongoDB connected-${conn.connection.host}`);
    }
    catch(e){
        Log("backend","error","db",`database connection failed-${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
