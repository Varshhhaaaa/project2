"use strict";

var dotenv = require('dotenv');

dotenv.config();

var express = require('express');

var cors = require('cors');

var app = express();

var connectToDB = require('./db/db');

var userRoutes = require('./routes/user.routes');

var TransactionRoutes = require('./routes/Transaction.routes');

connectToDB();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.get('/', function (req, res) {
  res.send("hello wolrd");
});
app.use('/user', userRoutes);
app.use('/', TransactionRoutes);
module.exports = app;