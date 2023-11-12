const express = require('express');
const AWS = require('aws-sdk');
const router = express.Router();
const calculateDistance = require('../utils/calculateDistance'); 

// Configure AWS to use promise
AWS.config.setPromisesDependency(Promise);

// Instantiate DynamoDB Document Client
const dynamoDb = new AWS.DynamoDB.DocumentClient();

// Route to find nearby users within a certain radius
router.get('/find-nearby/:uid', async (req, res) => {
    const { uid } = req.params;
    const radius = parseFloat(req.query.radius); // Ensure radius is a number

    // First, get the location of the current user
    const currentUserParams = {
        TableName: 'Users',
        Key: {
            "UID": uid
        }
    };

    try {
        const currentUserResult = await dynamoDb.get(currentUserParams).promise();
        if (!currentUserResult.Item) {
            return res.status(404).json({ error: "User not found" });
        }

        const currentUserLocation = currentUserResult.Item.Location;

        if (!currentUserLocation || currentUserLocation.Latitude === undefined || currentUserLocation.Longitude === undefined) {
            // Handle the case where the current user does not have a location
            return res.status(500).json({ error: "Current user location data is missing" });
        }

        // Now scan for all users (not efficient for large datasets)
        const scanParams = {
            TableName: 'Users'
        };

        const scanResult = await dynamoDb.scan(scanParams).promise();

        // Filter users by distance
        const nearbyUsers = scanResult.Items.filter(user => {
            // Check if the user has valid location data before calculating the distance
            if (!user.Location || user.Location.Latitude === undefined || user.Location.Longitude === undefined) {
                return false; // Skip this user as they don't have valid location data
            }

            const distance = calculateDistance(
                currentUserLocation.Latitude,
                currentUserLocation.Longitude,
                user.Location.Latitude,
                user.Location.Longitude
            );
            return user.UID !== uid && distance <= radius;
        }).map(user => {
            // Exclude the Password from the output
            const { Password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });

        res.json(nearbyUsers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Could not search for users" });
    }
});

module.exports = router;
