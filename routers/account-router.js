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

router.get('/:id', async (req, res) => {
	try {
		const account = await db('accounts').where({ id: req.params.id });
		if (account.length) {
			res.status(200).json(account[0]);
		} else {
			res.status(404).json({ message: 'Could not find user with given id.' })
		}
	} catch (error) {
		res.status(500).json({ message: `Can't fetch the id of the selected account ${error.message}` });
	}
});

router.post('/', async (req, res) => {
	try {
		if (!req.body.name || !req.body.budget) {
			res.status(404).json({ message: 'Name and body required' })
		} else {
			const newAccount = await db('accounts')
				.insert({
					name: req.body.name,
					budget: req.body.budget
				})
			res.status(210).json('New post got created with an id of ' + newAccount[0])
		}
	} catch (error) {
		res.status(500).json({ message: `Can't create new account ${error.message}` });
	}
});

router.put('/:id', (req, res) => {
	if (!req.body.name || !req.body.budget) {
		res.status(404).json({ message: 'Name and body required' })
	} else {
	db('accounts').where({ id: req.params.id })
			.update({
				name: req.body.name,
				budget: req.body.budget
			})
			.then(updatedAcount => {
				if (updatedAcount === 0) {
					res.status(404).json({ message: 'Could not find account with given id.' })
				} else {
					res.json(`${updatedAcount} row got updated`)
				}
			})
			.catch(error => {
				res.status(500).json({ message: `Can't update the selected account ${error.message}` });
			})
	}
})

router.delete('/:id', (req, res) => {
	db('accounts').where({ id: req.params.id }).del()
		.then(affectedAccount => {
			if (affectedAccount === 0) {
				res.status(404).json({ message: 'Could not find account with given id.' })
			} else {
				res.json(`${affectedAccount} rows got deleted`)
			}
		})
		.catch(error => {
			res.status(500).json({ message: `Can't delete the selected account ${error.message}` });
		});
});

module.exports = router;