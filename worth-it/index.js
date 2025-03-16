const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors')
const app = express();
const path = require('path');
require('dotenv').config();
require(path.resolve(__dirname, './config/env.config.js'));
// const ff = require('./config/env.config')
const corsOptions = require('./config/cors.config.js')



app.use(express.json())
app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: true,}))

// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Invalid JSON' });
  }
  next();
});

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Hello Worsbfld' })
})

app.get('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' })
})

module.exports.handler = serverless(app);