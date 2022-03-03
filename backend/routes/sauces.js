/* import express */
const express = require('express');

/* create router */
const router = express.Router();

/* import middleware */
const auth = require('../middleware/auth');
const multer = require('../middleware/ multer-config');

/* controller import */
const saucesCtrl = require('../controllers/sauces')

/* save routes in the router */
router.post('/',auth, multer, saucesCtrl.createSauces);
router.get('/:id', auth, saucesCtrl.getOneSauces);
router.put('/:id', auth, multer, saucesCtrl.modifySauces);
router.delete('/:id', auth, saucesCtrl.deleteSauces);
router.get('/', auth, saucesCtrl.getAllSauces);
router.post('/:id/like', auth, saucesCtrl.likeSauces);

module.exports = router;