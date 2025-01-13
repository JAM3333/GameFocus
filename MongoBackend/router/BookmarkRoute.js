const express = require('express');
const Bookmark = require('../models/Bookmark');
const { getDB } = require('../db/connectDB');

const router = express.Router();

router.get('/userbookmarks/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const db = getDB();

        // Find user with matching token and token not expired
        const user = await db.collection('users').findOne({
            verificationToken: token,
            verificationExpires: { $gt: new Date() }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User Bookmarks:', bookmarks: user.bookmarks });
    } catch (error) {
        console.error('Error during getting user bookmarks:', error);
        res.status(500).json({ message: 'Server error during getting user bookmarks' });
    }
});


router.post('/addbookmark', async (req, res) => {
    try {
        const { game, token } = req.body;
        if (!game || !token) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const db = getDB();
        const user = await db.collection('users').findOne({
            verificationToken: token,
            verificationExpires: { $gt: new Date() }
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await db.collection('users').updateOne(
            { _id: user._id },
            {
                $push: { bookmarks: game },
            }
        );

        const existingBookmark = await db.collection('bookmarks').findOne({
            game: game,
        });
        if (existingBookmark) {
            await db.collection('bookmarks').updateOne(
                { _id: existingBookmark._id },
                {
                    $push: { users: user.email },
                }
            );
            return res.status(201).json({ message: 'User bookmark added to existing game' });
        }

        const bookmark = new Bookmark(game);
        bookmark.users.push(user.email);

        const result = await db.collection('bookmarks').insertOne(bookmark);


        res.status(201).json({
            message: 'New game added to list. User bookmark added.',
            bookmarkId: result.insertedId
        });
    } catch (error) {
        console.error('Error during adding bookmark:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/waitlist', async (req, res) => {
    try {
        console.log(req.body)
        res.status(201).json({
            message: 'New game added to list. User bookmark added.',
        });
    } catch (error) {
        console.error('Error during adding bookmark:', error);
        res.status(500).json({ message: 'Server error' });
    }
});



module.exports = router;
