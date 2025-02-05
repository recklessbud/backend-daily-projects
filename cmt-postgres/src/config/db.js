const { Pool } = require('pg');
require('dotenv').config();

console.log(process.env.DB_USER);
const pool = new Pool({
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	database: process.env.DB_DATABASE,
	password: String(process.env.DB_PASSWORD),
	port: process.env.DB_PORT,
});

pool.on('error', (err) => {
	console.log(err);
	process.exit(1);
});

pool.on('connect', () => {
	console.log('connected to database');
});


module.exports = pool;