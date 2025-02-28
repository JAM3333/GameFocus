const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const { google } = require('googleapis');
dotenv.config();

const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });


// Create a transporter using environment variables


/* Verify transporter configuration
transporter.verify(function(error, success) {
    if (error) {
        console.log('Transporter verification error:', error);
    } else {
        console.log('Server is ready to take our messages');
    }
});*/

// Send verification email
const sendVerificationEmail = async (email, token) => {
    const verificationUrl = `http://localhost:3004/auth/verify/${token}`;

    const ACCESS_TOKEN = await oAuth2Client.getAccessToken();
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // use SSL
        auth: {
            type: "OAuth2",
            user: process.env.EMAIL_USER,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN,
            accessToken: ACCESS_TOKEN,
        },
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false
        }
    });


    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verify your GameFocus account',
        html: `
            <h1>Welcome to GameFocus!</h1>
            <p>Please verify your email address by clicking the link below:</p>
            <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; background-color: #4fd1c5; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
            <p>This link will expire in 24 hours.</p>        `
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw error;
    }
};

// Send bookmark notification email
const sendNotificationEmail = async (email,game) => {
    const bookmarkUrl = `http://localhost:3000/user-page`;


    const ACCESS_TOKEN = await oAuth2Client.getAccessToken();
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // use SSL
        auth: {
            type: "OAuth2",
            user: process.env.EMAIL_USER,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN,
            accessToken: ACCESS_TOKEN,
        },
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false
        }
    });


    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Bookmark: ${game.title} is now on sale!`,
        html: `
            <h1>The game "${game.title}" on your bookmark-list is now on Sale</h1>
            <h2>New Price: ${game.deals[0]?.price.amount+" "+game.lastPrice?.currency} on ${game.deals[0]?.shop.name}</h2>
            <p>Last Price: ${game.lastPrice?.amount+" "+game.lastPrice?.currency}</p>
            <a href="${bookmarkUrl}" style="display: inline-block; padding: 10px 20px; background-color: #4fd1c5; color: white; text-decoration: none; border-radius: 5px;">Visit the game on GameFocus</a>  `
    };

    try {
        console.log("Sending Notification to"+email)
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw error;
    }
};

module.exports = {
    sendVerificationEmail,
    sendNotificationEmail,
};