var fs = require('fs');
const trips = require('../../data/trips.json');


/** GET travel view */
const travel = (req, res) => {
  res.render('travel', { title: 'Travlr Getaways', trips });
};
module.exports = {
    travel
};
