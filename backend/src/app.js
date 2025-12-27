const express = require('express')
const cookieParser = require('cookie-parser')

// Routes
const authRoute = require('./routes/auth.route')
const chatRoute = require('./routes/chat.routes')


const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Use Routes
app.use('/api/auth', authRoute);
app.use('/api/chat', chatRoute);



module.exports = app;