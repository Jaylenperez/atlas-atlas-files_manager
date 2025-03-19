// routes/index.js
const express = require('express');
const {default: AC} = require('../controllers/AppController');
const { default: dbClient } = require('../../utils/db');
const { default: UsersController } = require('../controllers/UsersController');

const router = express.Router();
//GETs
router.get('/status', (req, res, next) => {
    AC.getStatus()
    .then(status => res.json(status))
    .catch(next)
});
router.get('/stats', (req, res, next) => {
    AC.getStats()
        .then(stats => res.json(stats))
        .catch(next); // pass errors to your error handling middleware
});

//POSTs
router.post('/users', (req, res, next) => {
    UsersController.postNew()
        .then(users => res.json(users))
        .catch(next); // pass errors to your error handling middleware
});


module.exports = router;
