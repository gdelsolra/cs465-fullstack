// Bring in the DB connection and the Trip schema
const Mongoose = require('./db');
const Trip = require('./travlr');

// Read seed data from json file
const fs = require('fs');

// Read seed data using path.join for safety
const trips = JSON.parse(fs.readFileSync('./data/trips.json'), 'utf8');

const seedDB = async () => {
  try {
    await Trip.deleteMany({});
    console.log('Old trips deleted.');

    await Trip.insertMany(trips);
    console.log('Trips inserted successfully.');
  } catch (err) {
    console.error('Seeding failed:', err);
  }
};

seedDB().then(async () => {
  await Mongoose.connection.close();
  process.exit(0);
});
