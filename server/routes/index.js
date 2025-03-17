// routes/index.js
const express = require('express');
const {default: AC} = require('../controllers/AppController');
const { default: dbClient } = require('../../utils/db');

const router = express.Router();

router.get('/status', (req, res) => {
    res.json(AC.getStatus())
});
router.get('/stats', (req, res) => {
    res.json(AC.getStats())
})

module.exports = router;
