const nodeGeoCoder = require('node-geocoder');
const dotenv = require('dotenv').config({ path: '../config/config.env' });;


const options = {
  provider: 'mapquest',
  httpAdapter: 'https',
  apiKey: '3YXsRNZkpYTe1ejoFY0muGgRRXGxGcYV',
  formatter: null
};

const geocoder = nodeGeoCoder(options);

module.exports = geocoder;