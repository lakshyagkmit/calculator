const express = require('express');
const { performCalculation, getHistory} = require('../controllers/operations.controller');

const router = express.Router();

router.post('/', performCalculation);
router.get('/', getHistory);



module.exports = router;