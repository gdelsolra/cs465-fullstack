const express = require('express');
const router = express.Router();

// This is the updated way to import express-jwt in version 7+
const { expressjwt: jwt } = require('express-jwt');

// Updated option name: use "requestProperty" instead of "userProperty"
const auth = jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
  requestProperty: 'payload'
});

const authController = require('../controllers/authentication');
const tripsController = require('../controllers/trips');

router
  .route('/login')
  .post(authController.login);

router
  .route('/register')
  .post(authController.register);

router
  .route('/trips')
  .get(tripsController.tripList)
  .post(auth, tripsController.tripsAddTrip);

router
  .route('/trips/:tripCode')
  .get(tripsController.tripsFindByCode)
  .put(auth, tripsController.tripsUpdateTrip);

module.exports = router;
