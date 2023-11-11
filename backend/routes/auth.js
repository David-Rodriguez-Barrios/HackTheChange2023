// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

// Configure AWS
AWS.config.update({
accessKeyId: process.env.AWS_ACCESS_KEY,
secretAccessKey: process.env.AWS_SECRET_KEY,
region: process.env.AWS_REGION
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();

router.post('/register', async (req, res) => {
    const { name, email, location, role, password } = req.body;
    
    // Validate user input here (left out for brevity)
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create UID for the new user
    const uid = uuidv4();

    // Create user object for DynamoDB
    const user = {
    TableName: 'Users',
    Item: {
        UID: uid,
        Name: name,
        Email: email,
        Location: location,
        Role: role,
        Password: hashedPassword
    }
    };

    // Save user to DynamoDB
    dynamoDb.put(user, (err, data) => {
    if (err) {
        res.status(400).send(err);
    } else {
        res.status(201).send({ UID: uid, message: 'User created successfully' });
    }
    });
});



router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Validate user input here (left out for brevity)

    // Find user in DynamoDB by email
    const params = {
    TableName: 'Users',
    IndexName: 'EmailIndex', // This assumes you've set up a GSI on email
    KeyConditionExpression: 'Email = :email',
    ExpressionAttributeValues: {
        ':email': email
    }
    };

    dynamoDb.query(params, async (err, data) => {
    if (err) {
        res.status(500).send(err);
    } else {
        if (data.Items.length > 0) {
        const user = data.Items[0];
        // Check password
        const validPass = await bcrypt.compare(password, user.Password);
        if (!validPass) return res.status(400).send('Invalid password');
        
        // Create and assign token
        const token = jwt.sign({ UID: user.UID }, process.env.TOKEN_SECRET);
        res.header('auth-token', token).send(token);
        } else {
        res.status(400).send('Email not found');
        }
    }
    });
});

module.exports = router;
