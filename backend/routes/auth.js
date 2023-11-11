// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AWS = require('aws-sdk');

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create user object
    const user = {
      TableName: 'Users',
      Item: {
        email: email,
        name: name,
        password: hashedPassword
      }
    };
  
    // Save user to DynamoDB
    dynamoDb.put(user, (err, data) => {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(201).send({ message: 'User created successfully' });
      }
    });
  });
  

  router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    // Find user in DynamoDB
    const params = {
      TableName: 'Users',
      Key: {
        email: email
      }
    };
  
    dynamoDb.get(params, async (err, data) => {
      if (err) {
        res.status(500).send(err);
      } else {
        if (data.Item) {
          // Check password
          const validPass = await bcrypt.compare(password, data.Item.password);
          if (!validPass) return res.status(400).send('Invalid password');
          
          // Create and assign token
          const token = jwt.sign({ email: data.Item.email }, process.env.TOKEN_SECRET);
          res.header('auth-token', token).send(token);
        } else {
          res.status(400).send('Email not found');
        }
      }
    });
  });  

module.exports = router;
