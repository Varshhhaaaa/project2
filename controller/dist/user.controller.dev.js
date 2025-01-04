"use strict";

var userModel = require('../model/user.model');

var transactionModel = require('../model/Transaction');

var userService = require('../services/user.service');

var _require = require('express-validator'),
    validationResult = _require.validationResult;

var crypto = require('crypto');

module.exports.registerUser = function _callee(req, res) {
  var generateUpi, errors, _req$body, name, email, password, upiId, existingUser, hashedPassword, user, token;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          generateUpi = function generateUpi() {
            var randomId = crypto.randomBytes(4).toString('hex');
            return "".concat(randomId);
          };

          _context.prev = 1;
          // Validate incoming data
          errors = validationResult(req);

          if (errors.isEmpty()) {
            _context.next = 5;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            errors: errors.array()
          }));

        case 5:
          _req$body = req.body, name = _req$body.name, email = _req$body.email, password = _req$body.password;
          upiId = generateUpi();
          console.log(upiId); // Check if the email already exists

          _context.next = 10;
          return regeneratorRuntime.awrap(userModel.findOne({
            email: email
          }));

        case 10:
          existingUser = _context.sent;

          if (!existingUser) {
            _context.next = 13;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            message: 'Email is already registered'
          }));

        case 13:
          _context.next = 15;
          return regeneratorRuntime.awrap(userModel.hashPassword(password));

        case 15:
          hashedPassword = _context.sent;
          _context.next = 18;
          return regeneratorRuntime.awrap(userService.createUser({
            name: name,
            email: email,
            password: hashedPassword,
            upi_id: upiId,
            balance: 0,
            // Default balance
            aletr: "ashu"
          }));

        case 18:
          user = _context.sent;
          // Generate auth token
          token = user.generateAuthToken(); // Return success response

          res.status(201).json({
            message: 'User registered successfully',
            token: token,
            user: {
              id: user._id,
              name: user.name,
              email: user.email,
              upi_id: user.upi_id,
              balance: user.balance,
              alter: "ashu"
            }
          });
          _context.next = 27;
          break;

        case 23:
          _context.prev = 23;
          _context.t0 = _context["catch"](1);
          console.error(_context.t0);
          res.status(500).json({
            message: 'Something went wrong',
            error: _context.t0.message
          });

        case 27:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 23]]);
};

module.exports.loginUser = function _callee2(req, res) {
  var errors, _req$body2, email, password, user, isMatch, token;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          errors = validationResult(req);

          if (errors.isEmpty()) {
            _context2.next = 3;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            errors: errors.array()
          }));

        case 3:
          _req$body2 = req.body, email = _req$body2.email, password = _req$body2.password;
          _context2.next = 6;
          return regeneratorRuntime.awrap(userModel.findOne({
            email: email
          }).select('+password'));

        case 6:
          user = _context2.sent;

          if (user) {
            _context2.next = 9;
            break;
          }

          return _context2.abrupt("return", res.status(401).json({
            message: "invalid email or password "
          }));

        case 9:
          _context2.next = 11;
          return regeneratorRuntime.awrap(user.comparePassword(password));

        case 11:
          isMatch = _context2.sent;

          if (isMatch) {
            _context2.next = 14;
            break;
          }

          return _context2.abrupt("return", res.status(401).json({
            message: "invalid email or password "
          }));

        case 14:
          token = user.generateAuthToken();
          res.status(200).json({
            token: token,
            user: user
          });

        case 16:
        case "end":
          return _context2.stop();
      }
    }
  });
};

module.exports.fetchUserDetailsByUpi = function _callee3(req, res) {
  var upi_id, user;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          upi_id = req.params.upi_id; // Extract upi_id from request parameters

          if (upi_id) {
            _context3.next = 4;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            message: "UPI ID is required"
          }));

        case 4:
          _context3.next = 6;
          return regeneratorRuntime.awrap(userModel.findOne({
            upi_id: upi_id
          }).select('-password'));

        case 6:
          user = _context3.sent;

          if (user) {
            _context3.next = 9;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            message: "User not found with this UPI ID"
          }));

        case 9:
          // Send user details as a response
          res.status(200).json({
            message: "User details fetched successfully",
            user: user
          });
          _context3.next = 16;
          break;

        case 12:
          _context3.prev = 12;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0);
          res.status(500).json({
            message: "Internal server error",
            error: _context3.t0.message
          });

        case 16:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 12]]);
};