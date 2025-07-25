const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const userRoute = require('./routes/user.route');
const authRoute = require('./routes/auth.route');
const listingRoute = require('./routes/listing.route') ;
const cookieParser = require('cookie-parser');

// Connect to MongoDB
mongoose.connect(process.env.MONGO).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log('Error connecting to MongoDB:', err);
});

const app = express();

app.use(express.json()); // Middleware to parse JSON bodies

app.use(cookieParser()); // Middleware to parse cookies


app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

app.use('/api/user', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/listing',listingRoute);


//middleware for handling errors
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500 ;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
       success: false,
        statusCode,
        message
    });
});
