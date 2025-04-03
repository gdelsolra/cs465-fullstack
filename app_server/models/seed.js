const Mongoose = require('./db');
const Trip = require('./travlr');
const fs = require('fs');
const path = require('path');

// Read seed data using path.join for safety
const trips = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/trips.json'), 'utf8'));

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
