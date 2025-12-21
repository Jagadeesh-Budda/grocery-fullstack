const express = require('express');
const body = require('body-parser');
const cors = require('cors');
const { sequelize } = require('./models');
const groceries = require('./routes/groceries');
const auth = require('./routes/auth');

const app = express();

// CORS configuration - explicit configuration for development
const allowedOrigins = [
    'http://localhost:5173', 
    'http://localhost:5174', 
    'http://localhost:3000',
    'http://127.0.0.1:5174', 
    'http://127.0.0.1:5173'
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl, etc)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            // For development, allow any localhost origin
            if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    exposedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 204
}));

app.use(body.json());
app.use('/api/groceries', groceries);
app.use('/auth', auth);

const PORT = 8080;
sequelize.sync().then(()=>app.listen(PORT, ()=>console.log('Node running',PORT)));
