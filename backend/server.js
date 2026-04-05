const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middleware/errorHandler');


// Import routes
const standardRoutes = require('./routes/standardRoutes');
const periodicalRoutes = require('./routes/periodicalRoutes');
const abstractRoutes = require('./routes/abstractRoutes');


dotenv.config();


connectDB();


const app = express();

app.use(cors()); // Enable CORS for frontend communication
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies


app.use('/api/auth', authRoutes);
app.use('/api/standards', standardRoutes);
app.use('/api/periodicals', periodicalRoutes);
app.use('/api/abstracts', abstractRoutes);



app.get('/', (req, res) => {
  res.json({ message: 'API is running...' });
});

app.use(errorHandler);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Server Error'
  });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});