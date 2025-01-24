const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { getDB } = require('../db/connectDB');
const { sendVerificationEmail } = require('../utils/emailService');

const router = express.Router();

const tokenBlacklist = new Set();

const isTokenBlacklist = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];
    if (tokenBlacklist.has(token)) {
        return res.status(401).json({ message: 'Token has been invalidated' });
    }
    req.token = token;
    next();
};

router.post('/login', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if ((email==="" && username==="") || !password) {
            return res.status(400).json({ message: 'Email, Username or password is required' });
        }

        const db  = getDB();
        const user = await db.collection('users').findOne({$or: [{ username }, { email }]});
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            {userId: user._id, username: user.username},
            process.env.SECRET_KEY,
            { expiresIn: '2h'}
        );
        const expireDate = new Date();
        expireDate.setHours(expireDate.getHours() + 2);

        await db.collection('users').updateOne(
            { _id: user._id },
            {
                $set: { verificationToken: token, verificationExpires: expireDate }
            }
        );
        res.status(200).json({ message: 'Successfully logged in!', token });

    }catch(err) {
        console.error('Error while loging in', err);
        res.status(500).json({ message: 'Server Error', error: err });
    }
});

router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        console.log(username,email,password);
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const db = getDB();
        const existingUser = await db.collection('users').findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            await db.collection('users').deleteOne(
                { $or: [{ username }, { email }] });
            return res.status(400).json({ message: 'Username or email already exists' });
        }

        const user = new User(username, email, password);
        await user.hashPassword();

        const result = await db.collection('users').insertOne(user);

        // Send verification email
        try {
            await sendVerificationEmail(email, user.verificationToken);
        } catch (emailError) {
            console.error('Failed to send verification email:', emailError);
            // Continue with registration even if email fails
        }

        res.status(201).json({
            message: 'User registered successfully. Please check your email to verify your account.',
            userId: result.insertedId
        });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Email verification endpoint
router.get('/verify/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const db = getDB();

        // Find user with matching token and token not expired
        const user = await db.collection('users').findOne({
            verificationToken: token,
            verificationExpires: { $gt: new Date() }
        });

        if (!user) {
            return res.status(400).json({
                message: 'Invalid or expired verification token. Please register again.'
            });
        }

        // Update user as verified
        await db.collection('users').updateOne(
            { _id: user._id },
            {
                $set: { isVerified: true },
                $unset: { verificationToken: "", verificationExpires: "" }
            }
        );

        // Redirect to frontend with success message
        res.redirect('http://localhost:3000/user-page');
    } catch (error) {
        console.error('Error during email verification:', error);
        res.status(500).json({ message: 'Server error during verification' });
    }
});


// User token info
router.get('/user/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const db = getDB();
        console.log(token)
        // Find user with matching token and token not expired
        const test = await db.collection('users').findOne({
            email: "esiduff@gmail.com",
        });
        const user = await db.collection('users').findOne({
            verificationToken: token,
            verificationExpires: { $gt: new Date() }
        });
        console.log(user)
        if (!user) {
            return res.status(400).json({
                message: 'Invalid token'
            });
        }

        res.status(200).json({ message: 'User found', username: user.username });
    } catch (error) {
        console.error('Error during email verification:', error);
        res.status(500).json({ message: 'Server error during verification' });
    }
});


router.post('/logout', async (req, res) => {
    const token = req.token;
    tokenBlacklist.add(token);
    res.status(200).json({ message: 'User logged out!' });
})

module.exports = router;
