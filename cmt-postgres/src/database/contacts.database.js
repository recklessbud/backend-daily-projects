const pool = require('../config/db');

const createTable = async () => {
    const query = `
    CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    phone INTEGER NOT NULL,
    zip VARCHAR(255) NOT NULL
);
    `;
    try {
        pool.query(query);
        console.log('table created');
    }
    catch (error) {
     next(error);
     process.exit(1);
    }
};

module.exports = createTable;