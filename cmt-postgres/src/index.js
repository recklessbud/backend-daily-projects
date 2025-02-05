// dependencies
const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
// const path = require('path');
const dotenv = require('dotenv');
// const pool = require('./config/db');
const errorHandler = require('./middlewares/errorhandler');
const contactsRoute = require('./routes/contacts.route');
const app = express();

dotenv.config();
require('./database/contacts.database')();
const PORT = process.env.PORT || 5030;

// Express Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// error handler
app.use(errorHandler);

// Routes
app.use('/api/contacts', contactsRoute);


// listen
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

