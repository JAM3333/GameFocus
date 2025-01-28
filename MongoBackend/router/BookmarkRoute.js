const express = require('express');
const Bookmark = require('../models/Bookmark');
const { getDB } = require('../db/connectDB');
const {sendVerificationEmail} = require("../utils/emailService");

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


router.post('/changebookmark', async (req, res) => {
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

        const isBookmarked = user.bookmarks.includes(game);

        if (isBookmarked) {
            // Remove the game from the user's bookmarks array
            await db.collection('users').updateOne(
                { _id: user._id },
                {
                    $pull: { bookmarks: game },
                }
            );

            // Remove the user from the bookmarks collection for the specific game
            const existingBookmark = await db.collection('bookmarks').findOne({ game });
            if (existingBookmark) {
                await db.collection('bookmarks').updateOne(
                    { _id: existingBookmark._id },
                    {
                        $pull: { users: user.email },
                    }
                );

                // If no users remain associated with the game, remove the bookmark document
                const updatedBookmark = await db.collection('bookmarks').findOne({ _id: existingBookmark._id });
                if (updatedBookmark.users.length === 0) {
                    await db.collection('bookmarks').deleteOne({ _id: existingBookmark._id });
                }
            }

            return res.status(200).json({ message: 'Bookmark removed successfully' });
        } else {
            // Add the game to the user's bookmarks array
            await db.collection('users').updateOne(
                { _id: user._id },
                {
                    $addToSet: { bookmarks: game },
                }
            );

            // Check if the bookmark already exists in the bookmarks collection
            const existingBookmark = await db.collection('bookmarks').findOne({ game });
            if (existingBookmark) {
                // Add the user to the existing bookmark's users array
                await db.collection('bookmarks').updateOne(
                    { _id: existingBookmark._id },
                    {
                        $addToSet: { users: user.email },
                    }
                );
                return res.status(201).json({ message: 'User bookmark added to existing game' });
            }

            // Create a new bookmark document
            const bookmark = {
                game: game,
                users: [user.email],
            };

            const result = await db.collection('bookmarks').insertOne(bookmark);

            return res.status(201).json({
                message: 'New game added to list. User bookmark added.',
                bookmarkId: result.insertedId,
            });
        }
    } catch (error) {
        console.error('Error during adding/removing bookmark:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/isbookmarked', async (req, res) => {
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

        const isBookmarked = user.bookmarks.includes(game);
        res.status(201).json({
            message: 'New game added to list. User bookmark added.',
            bookmarked: isBookmarked,
        });
    } catch (error) {
        console.error('Error during adding bookmark:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


router.post('/waitlist', async (req, res) => {
    try {
        const game = req.body[0];

        const db = getDB();
        const bookmarks = await db.collection('bookmarks').findOne({ game: game.id});
        if (bookmarks.length === 0) {
            for (const bookmark of bookmarks.users) {
                await sendVerificationEmail(bookmark, user.verificationToken);

            }
        }

        console.log(game.id,bookmarks)
        res.status(201).json({
            message: 'Notification successfully sent to users',
        });
    } catch (error) {
        console.error('Error during adding bookmark:', error);
        res.status(500).json({ message: 'Server error' });
    }
});



module.exports = router;
