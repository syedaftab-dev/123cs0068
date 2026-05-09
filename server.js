const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mern_db';
  
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('mongoDB Connected');
    app.listen(PORT,() => {
      console.log(`server running on port ${PORT}`);
    });
  })
  .catch((e) => {
    console.error('Database connection error-', e);
  });
