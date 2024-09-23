const express = require('express');
const productRoutes = require('./infrastructure/webserver/routes/productRoutes');
const healthRoutes = require('./infrastructure/webserver/routes/healthRoutes');
const sequelize = require('./config/database');

const app = express();
app.use(express.json());

app.use('/api', productRoutes);
app.use('/api', healthRoutes);

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});
