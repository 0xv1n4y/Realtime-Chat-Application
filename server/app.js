const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require('cookie-parser');
const cryptoJS = require("crypto-js");
const jwt = require('jsonwebtoken');
const path = require('path');

// Load environment variables
dotenv.config({ path: '.env.secret' });

//Local Modules
const authRoute = require('./routes/authRoute');
const userRoute = require('./routes/userRoute');
const chatRoute = require('./routes/chatRoute');
const messageRoute = require('./routes/messageRoute');
const groupRoute = require('./routes/groupRoute');

//Server initialization
const app = express();

//Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));

// // Middleware to handle CORS and check for allowed origins and specific cookie
const checkRequest = (req, res, next) => {
    let origin = req.headers.origin;
    if(!origin){
        origin = req.get('Host');
    }
    const token = req.cookies.token;

    let domainsArray = process.env.CROSS_DOMAIN.toLowerCase().split(',');
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        if (origin && domainsArray.some(domain => origin.toLowerCase().endsWith(domain))) {
            res.header('Access-Control-Allow-Origin', origin);
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT');
            res.header('Access-Control-Allow-Headers', 'Content-Type');
            res.header('Access-Control-Allow-Credentials', 'true');
            return res.sendStatus(204); // No Content
        } else {
            return res.status(403).json({ error: 'Forbidden - Origin not allowed' });
        }
    }
    // Check if the origin is allowed
    if (origin && domainsArray.some(domain => origin.toLowerCase().endsWith(domain))) {
        res.header('Access-Control-Allow-Origin', origin);
        res.header('Access-Control-Allow-Credentials', 'true');
        //Check if the end point is login
        if (req.originalUrl === '/api/v1/login' || req.originalUrl === '/api/v1/newuser/add' || req.originalUrl === '/api/v1/details') {
            return next();
        }
        // Check if the cookie exists
        if (token) {
            req.sdata = {};
            // Decode the cookie data
            jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
                const bytes = cryptoJS.AES.decrypt(user, process.env.COOKIE_ENC_KEY);
                try{
                  const obj = JSON.parse(bytes.toString(cryptoJS.enc.Utf8));
                  if(obj.u_nm){
                    req.sdata["user"]  = JSON.parse(bytes.toString(cryptoJS.enc.Utf8));
                  }
                }catch(error){
                 console.error("Error in decode the cookie value");
                 res.status(403).json({error : "UnAuthorized access"}); 
                }
              });
            next(); 
        } else {
            // Cookie does not exist, send an error response
            res.status(403).json({ error: 'Forbidden - Missing required cookie' }); 
        }
    } else {
        // Origin not allowed, send an error response
        res.status(403).json({ error: 'Forbidden - Origin not allowed' }); 
    }
};

app.use(checkRequest);

// To store files or images
app.use('/media', express.static(path.join(__dirname, 'media')));

//Environment Variables
const PORT = process.env.PORT || 8010;

//Routes
app.use('/api/v1', authRoute);
app.use('/api/v1', userRoute);
app.use('/api/v1', chatRoute);
app.use('/api/v1', messageRoute);
app.use('/api/v1', groupRoute);

 const server = app.listen(PORT, (error) => {
    if (!error) {
        console.log(`Chat application server is running on port ${PORT} successfully`);
    } else {
        console.log("Error occurred, server can't start", error);
    }
 });

 const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors : {
        origin : "http://localhost:3000",
    },
 })

 io.on("connection", (socket) => {
    console.log("Connectd to socket.io");

    socket.on('setup', (userId) => {
        socket.join(userId);
        socket.emit("connected");
    });

    socket.on("join room", (room) => {
        socket.join(room);
        console.log("User Join The Room: " + room);
    });

    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on('new message', (newMessageRecived) => {
        var message = newMessageRecived;

        if(!message.user_id) return console.log("chat.users not defined");
        socket.in(message.chat_id).emit("message Recived", newMessageRecived);
        socket.off("setup", () => {
            console.log("User Disconnected");
            socket.leave(userId);
          });
    });
 })

