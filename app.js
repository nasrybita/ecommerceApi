require('dotenv').config();
const express = require('express');
const app = express();
var morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const userRoutes = require('./routes/userRoutes');

const errorHandler = require('./helpers/errorHandler');
const authMiddleware = require('./helpers/authMiddleware'); // Updated middleware

app.use(bodyParser.json());
app.use(morgan('tiny'));

// Apply auth middleware globally
app.use(authMiddleware);

app.use('/api/v1/products', productRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/users', userRoutes);

app.get('/', (req, res) => {
  res.status(200).send('Welcome to first project!');
});

mongoose.connect(process.env.DB_URI);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
