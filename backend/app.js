/* installing DOTENV */
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

/* Path import for images */
const path = require('path');

/* Helmet import for secure HTTP headers */
const helmet = require('helmet');

/* Cors import for secure multi-origin requests */
const cors = require('cors');

/* import Rate-limit to limit requests */
const rateLimit = require('express-rate-limit');

/* import routes */
const userRoutes = require('./routes/users');
const sauceRoutes = require('./routes/sauces')

const app = express(); 

/* connection of the app with mongoose which manages the MongoDB database */
mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.6djjc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

/* details of the rate-limit */  
const limiter = rateLimit({
   // 15 minutes
    windowMs: 15 * 60 * 1000,
    // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    max: 100,
    // Return rate limit info in the `RateLimit-*` headers
    standardHeaders: true, 
    // Disable the `X-RateLimit-*` headers
    legacyHeaders: false, 
});

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(limiter);

/* Prevent CORS Errors */
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

/* image management */
app.use('/images', express.static(path.join(__dirname, 'images')));

/* call of the routes */
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

module.exports = app;