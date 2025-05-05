const express = require('express');
const productRoutes = require('./infrastructure/webserver/routes/productRoutes');
const healthRoutes = require('./infrastructure/webserver/routes/healthRoutes');
const sequelize = require('./config/database');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware for production
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Routes
app.use('/api', productRoutes);
app.use('/api', healthRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3000;

// Database connection with retry logic
const connectWithRetry = () => {
    return sequelize.sync()
        .then(() => {
            app.listen(PORT, '0.0.0.0', () => {
                console.log(`Server is running on port ${PORT}`);
            });
        })
        .catch(err => {
            console.error('Failed to connect to the database. Retrying in 5 seconds...', err);
            setTimeout(connectWithRetry, 5000);
        });
};

connectWithRetry();

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM signal received: closing HTTP server');
    await sequelize.close();
    process.exit(0);
});

module.exports = app;