// app_api/controllers/trips.js

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Trip = require('../models/travlr'); // Register model
require('../models/user'); // Ensure user schema is registered
const User = mongoose.model('users'); // Reference it
const Model = mongoose.model('trips'); // This is the Trip model

// Modernized getUser function using async/await (fixes Mongoose 7+ crash)
const getUser = async (req, res, callback) => {
  if (req.payload && req.payload.email) {
    try {
      const user = await User.findOne({ email: req.payload.email });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      callback(req, res, user.name); // Pass user name to callback
    } catch (err) {
      console.error('User lookup failed:', err);
      return res.status(500).json({ message: "Error finding user", error: err.message });
    }
  } else {
    return res.status(401).json({ message: "Authorization required" });
  }
};

// GET: /trips - list all trips
const tripList = async (req, res) => {
  try {
    const trips = await Model.find({});
    if (!trips || trips.length === 0) {
      return res.status(404).json({ message: "No trips found" });
    } else {
      return res.status(200).json(trips);
    }
  } catch (err) {
    console.error('Error listing trips:', err);
    return res.status(500).json({ error: err.message });
  }
};

//  GET: /trips/:tripCode - get a single trip by code
const tripsFindByCode = async (req, res) => {
  try {
    const trip = await Model.find({ code: req.params.tripCode });
    if (!trip || trip.length === 0) {
      return res.status(404).json({ message: "Trip not found" });
    } else {
      return res.status(200).json(trip);
    }
  } catch (err) {
    console.error('Error finding trip:', err);
    return res.status(500).json({ error: err.message });
  }
};

//  POST: /trips - add a new trip (requires user)
const tripsAddTrip = (req, res) => {
  getUser(req, res, async (req, res, userName) => {
    console.log('User creating trip:', userName);
    try {
      const trip = await Model.create({
        code: req.body.code,
        name: req.body.name,
        length: req.body.length,
        start: req.body.start,
        resort: req.body.resort,
        perPerson: req.body.perPerson,
        image: req.body.image,
        description: req.body.description,
      });
      return res.status(201).json(trip);
    } catch (err) {
      console.error('Create error:', err);
      return res.status(400).json({ error: err.message });
    }
  });
};

// PUT: /trips/:tripCode - update a trip (requires user)
const tripsUpdateTrip = (req, res) => {
  getUser(req, res, async (req, res, userName) => {
    try {
      const updatedTrip = await Model.findOneAndUpdate(
        { code: req.params.tripCode },
        {
          code: req.body.code,
          name: req.body.name,
          length: req.body.length,
          start: req.body.start,
          resort: req.body.resort,
          perPerson: req.body.perPerson,
          image: req.body.image,
          description: req.body.description
        },
        { new: true }
      );

      if (!updatedTrip) {
        return res.status(404).json({ message: "Trip not found with code " + req.params.tripCode });
      }

      res.status(200).json(updatedTrip);

    } catch (err) {
      console.error('Update error:', err);
      return res.status(500).json({ error: err.message });
    }
  });
};

module.exports = {
  tripList,
  tripsFindByCode,
  tripsAddTrip,
  tripsUpdateTrip
};
