// routes/auth.js
const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION
});

router.get('/listings', async (req, res) => {
  const dynamoDb = new AWS.DynamoDB.DocumentClient(); // Create a DynamoDB DocumentClient

  const params = {
    TableName: 'EnergyListings', // Replace 'Listings' with your actual table name
  };

  try {
    dynamoDb.scan(params, (err, data) => {
      if (err) {
        console.error("Unable to scan listings. Error JSON:", JSON.stringify(err, null, 2));
        res.status(500).send(err);
      } else {
        console.log(data); // Log the full data object to see what is being returned
        if (data.Items && data.Items.length > 0) {
          // Send the response with all listings
          res.json(data.Items);
        } else {
          res.status(404).send('No listings found');
          console.error(err);
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

router.post('/create-listing', async (req, res) => {
  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  // Extract listing information from request body
  const { sellerId, position, supplying, rate, email } = req.body;

  // Generate a new unique ID for the listing
  const listingId = uuidv4();

  const params = {
    TableName: 'EnergyListings', // Replace with your actual table name
    Item: {
      ListingID: listingId,
      sellerId: sellerId,
      position: {
        lat: parseFloat(position.lat),
        lng: parseFloat(position.lng)
      },
      supplying: parseInt(supplying, 10),
      rate: parseFloat(rate),
      email: email
    }
  };

  dynamoDb.put(params, (err, data) => {
    if (err) {
      console.error("Unable to add listing. Error JSON:", JSON.stringify(err, null, 2));
      res.status(500).send(err);
    } else {
      res.status(201).send({ ListingID: listingId, message: 'Listing created successfully' });
    }
  });
});

module.exports = router;
