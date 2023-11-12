const express = require('express');
const router = express.Router();
const fetch = require('node-fetch'); // node-fetch version 2.x if you're using CommonJS syntax

// Geocoding route to convert address to latitude and longitude
router.get('/address-to-coordinates', async (req, res) => {
  const { address } = req.query;

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK') {
      const { lat, lng } = data.results[0].geometry.location;
      res.json({ latitude: lat, longitude: lng });
    } else {
      res.status(404).send('Geocoding failed: ' + data.status);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

module.exports = router;
