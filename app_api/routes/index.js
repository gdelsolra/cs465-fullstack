const express           = require('express');
const router            = express.Router();
const tripsController   = require('../controllers/trips');

// Define route for our trips endpoint 
router
  .route('/trips')
  .get(tripsController.tripList)        
  .post(tripsController.tripsAddTrip);

// GET method routes tripsFindByCode - requieres parameter
// PUT method routes tripsUpdateTrip - requires parameter
router
  .route('/trips/:tripCode')
  .get(tripsController.tripsFindByCode)
  .put(tripsController.tripsUpdateTrip);

module.exports = router;
