"use strict";

var express = require('express');

var router = express.Router();

var transactionController = require('../controller/transaction.controller');

var wallet = require('../controller/wallet');

router.post('/transaction', transactionController.makeTransaction);
router.get('/transaction/:upi_id', transactionController.getTransactionsByUpi);
router.post('/wallet', wallet.addMoney);
router.post('/otp', transactionController.requestOtp);
module.exports = router;