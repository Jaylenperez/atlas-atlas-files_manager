const express = require('express')
const router = express.Router()
const { default: AC } = require('../controllers/AppController');

router.get('/status', (req, res) => {
    const result = AC.getStatus(req, res);
    res.json(result);
});
module.exports = router

