// routes/index.js
const express = require('express');
const {default: AC} = require('../controllers/AppController');
const { default: dbClient } = require('../../utils/db');
const { default: UC } = require('../controllers/UsersController');
const { default: AuthControl } = require('../controllers/AuthController');
const { default: FilesControl } = require('../controllers/FilesControllers');

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
    .then(result => result)
    .catch(next)
});

router.get('/files/:id', (req, res, next) => {
    FilesControl.getShow(req, res)
    .then(result => result)
});
router.get('/files', (req, res, next) => {
    FilesControl.getIndex(req, res)
    .then(result => result)
});

//POSTs
router.post('/users', (req, res, error) => {
    UC.postNew(req, res)
});

router.post('/files', (req, res) => {
    FilesControl.postUpload(req, res)
})
router.put('/files/:id/publish', (req, res, next) => {
    FilesControl.putPublish(req, res)
});
router.put('/files/:id/unpublish', (req, res, next) => {
    FilesControl.putUnpublish(req, res)
});
module.exports = router;
