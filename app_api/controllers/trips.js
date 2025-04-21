const mongoose = require('mongoose');
const Trip = require('../models/travlr'); // Register model
require('../models/user'); // Ensure user schema is registered
const User = mongoose.model('users'); // Reference it
const Model = mongoose.model('trips'); // This is the Trip model


const getUser = (req, res, callback) => {
    if (req.payload && req.payload.email) {
      User
        .findOne({ email: req.payload.email })
        .exec((err, user) => {
          if (!user) {
            return res
              .status(404)
              .json({ message: "User not found" });
          } else if (err) {
            console.log(err);
            return res
              .status(404)
              .json(err);
          }
          callback(req, res, user.name); // Pass user name to callback
        });
    } else {
      return res
        .status(404)
        .json({ message: "User not found" });
    }
  };
  
// GET: /trips - list all the trips
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripList = async(req, res) => {
    const q = await Model   
        .find({}) // No filter, return all records
        .exec();

        //uncomment the following line to show results of query
        // on the console
        // console.log(q);
    if(!q)
    { // Database returned no data
        return res
                .status(404)
                .json(err);
    } else { // Return resulting trip list
        return res
            .status(200)
            .json(q)
        }

};

// GET: /trips/:tripCode - list a single trip
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripsFindByCode = async(req, res) => {
    const  q = await Model
        .find({'code': req.params.tripCode}) // Return single record
        .exec()
    
        //uncomment the following line to show results of query
        // on the console
        // console.log(q);

    if (!q)
    {
        // Database returned no data
        return res
                .status(404)
                .json(err);
    } else {
        //Return resulting trip list
        return res 
                .status(200)
                .json(q);
    }
    
};

// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
// POST /api/trips – add a new trip
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
  
  
// PUT:/trips/:tripCode --Adds a new trip
// Regardless of outcome, repsonse must include HTML status code
// and JSON message to the requesting client
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
        ).exec();
  
        if (!updatedTrip) {
          return res.status(404).json({ message: "Trip not found with code " + req.params.tripCode });
        }
  
        res.status(200).json(updatedTrip);
  
      } catch (err) {
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