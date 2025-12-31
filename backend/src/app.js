const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors'); 

const app = express();


app.use(cors({
    origin: function (origin, callback) {
      
        const allowedOrigins = [
            'http://localhost:5173',
            // 'https://cortex-ai-omega.vercel.app'
        ];

   
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log("Blocked by CORS:", origin); 
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());

// Routes
const authRoute = require('./routes/auth.route');
const chatRoute = require('./routes/chat.routes');

// Use Routes
app.use('/api/auth', authRoute);
app.use('/api/chat', chatRoute);

module.exports = app;