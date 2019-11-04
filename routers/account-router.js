const express = require('express');
const db = require('../data/dbConfig');

const router = express.Router();

router.get('/', (req, res) => {
	db('accounts')
	.then(result => {
		res.status(200).json(result)
	})
	.catch(error => {
		res.status(500).json({ message: 'Unable to fetch accounts data' + error.message });
	});
});

module.exports = router;