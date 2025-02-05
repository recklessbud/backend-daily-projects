const pool = require('../config/db');

module.exports = {
	getAllContacts: async () => {
		const results = await pool.query('SELECT * FROM contacts');
		return results.rows;
	},
	addContacts: async (firstName, lastName, phone, zip) => {
		const result = await pool.query('INSERT INTO contacts (first_name, last_name, phone, zip) VALUES ($1, $2, $3, $4) RETURNING *', [firstName, lastName, phone, zip]);
		return result.rows[0];
	},
	getContactsByID: async (id) => {
		const results = await pool.query('SELECT * FROM contacts WHERE id = $1', [id]);
		return results.rows[0];
	},
	updateContact: async (id, firstName, lastName, phone, zip) => {
		const results = await pool.query('UPDATE contacts SET first_name = $1, last_name = $2, phone = $3, zip = $4 WHERE id = $5 RETURNING *', [firstName, lastName, phone, zip, id]);
		return results.rows[0];
	},
	deleteContact: async (id) => {
		const deleteContact = await pool.query('DELETE FROM contacts WHERE id = $1 RETURNING *', [id]);
		return deleteContact.rows[0];
	},
};