import NodeGeocoder from 'node-geocoder';
import dotenv from 'dotenv';

dotenv.config();

const options = {
  provider: process.env.GEOCODER_PROVIDER,
  apiKey: process.env.LOCATION_IQ_KEY,
  formatter: null,
};

export const geocoder = NodeGeocoder(options);
