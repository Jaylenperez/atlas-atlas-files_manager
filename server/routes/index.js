// routes/index.js
const express = require('express');
const {default: AC} = require('../controllers/AppController');
const { default: dbClient } = require('../../utils/db');
const { default: UC } = require('../controllers/UsersController');
const { default: AuthControl } = require('../controllers/AuthController');

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
router.get('/connect', (req, res, next) => {
    AuthControl.getConnect(req, res)
    .then(auth => auth)
    .catch(next)
})
router.get('/disconnect', (req, res, next) =>
    { AuthControl.getDisconnect(req, res)
        .then(auth => auth)
        .catch(next)
    });
router.get('/users/me', (req, res, next) => {
     UC.getMe(req, res)
    .then(result => res.json(result))
    .catch(next)
});

//POSTs
router.post('/users', (req, res, error) => {
    UC.postNew(req, res)
});


module.exports = router;
