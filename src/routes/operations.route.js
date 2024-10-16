const express = require('express');
const { performCalculation, getHistory, clearHistoryRecord, resetHistory } = require('../controllers/operations.controller');

const router = express.Router();

router.post('/', performCalculation);
router.get('/', getHistory);
router.delete('/reset', resetHistory);
router.delete('/:id', clearHistoryRecord);
// router.delete('/reset', resetHistory);



module.exports = router;