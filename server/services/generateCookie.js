require('dotenv/config');
const jwt = require('jsonwebtoken');
const cryptoJS = require("crypto-js");

const createAuthToken = (session) => {
    return jwt.sign(
        cryptoJS.AES.encrypt(JSON.stringify(session), process.env.COOKIE_ENC_KEY).toString(),
        process.env.SECRET_KEY
    );
};

const setAuthCookie = (res, authToken) => {
    res.cookie('token', authToken, {
        httpOnly: true,
        secure: true, // Only set secure in production
        path: '/',
        sameSite: "None",
        maxAge: 3600000
        
    });
};

module.exports = {createAuthToken,setAuthCookie}