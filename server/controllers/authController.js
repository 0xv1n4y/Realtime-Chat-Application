require('dotenv/config');
const { connectMongodb, getDB } = require("../services/dbService");
const { createAuthToken, setAuthCookie} = require("../services/generateCookie");
const bcrypt = require("bcryptjs");
const ShortUniqueId = require('short-unique-id');
const uid = new ShortUniqueId();
const cryptoJS = require("crypto-js");
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    const { email, pwd } = req.body;

    try {
        await connectMongodb();
        const userCollection = getDB().collection(process.env.USERS);
        const user = await userCollection.findOne({ email });

        if (user && await bcrypt.compare(pwd, user.pwd)) {
            const session = { u_nm: user.u_nm, user_id: user.user_id, email: user.email , photo: user.photo};
            const authToken = createAuthToken(session);
            setAuthCookie(res, authToken);
            return res.status(200).json({ u_nm: user.u_nm, email: user.email, photo: user.photo, user_id: user.user_id});
        } else {
            return res.status(401).json({ code: 'AF', message: 'User Authentication Failed' });
        }

    } catch (error) {
        return res.status(500).json({ code: 'UZ', message: 'Unauthorized user access' });
    }
};

const signUp = async (req, res) => {
    const newUser = req.body;

    try {
        await connectMongodb();
        const userCollection = getDB().collection(process.env.USERS);
        const existingUser = await userCollection.findOne({ email: newUser.email });

        if (existingUser) {
            return res.status(400).json({ status: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(newUser.pwd, 10);
        newUser.pwd = hashedPassword;
        newUser.c_on = new Date();
        newUser.u_on = new Date();
        newUser.user_id = uid.randomUUID(10);

        const session = { u_nm: newUser.u_nm, user_id:newUser.user_id, email: newUser.email,  photo: newUser.photo };
        const authToken = createAuthToken(session);
        setAuthCookie(res, authToken);

        await userCollection.insertOne(newUser);
        return res.status(200).json({ u_nm: newUser.u_nm, email: newUser.email, photo: newUser.photo, user_id: newUser.user_id}); 
    } catch (error) {
        return res.status(500).json({ status: false, message: "Failed to create new user" });
    }
};

const fetchToken = async (req, res) => {
   
    try {
        const token = req.cookies.token;

        if(token) {
            jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
                const bytes = cryptoJS.AES.decrypt(user, process.env.COOKIE_ENC_KEY);
                try{
                  const obj = JSON.parse(bytes.toString(cryptoJS.enc.Utf8));
                  if(obj.u_nm){
                    data  = JSON.parse(bytes.toString(cryptoJS.enc.Utf8));
                    return res.status(200).json(data);
                  }
                }catch(error){
                 console.error("Error in decode the cookie value");
                 res.status(403).json({error : "UnAuthorized access"}); 
                }
              });
        }
        
    } catch (error) {
        return res.status(500).json({ status: false, message: "Session end" });
    }
}

const logout = async (req, res) => {

    res.cookie('token', "", {
        httpOnly: true,
        secure: true, // Only set secure in production
        path: '/',
        sameSite: "None",
        maxAge: 3600000
        
    });

    return res.status(200).json({ status : true, message: "Logout successfull"})

}

module.exports = { login, signUp, fetchToken, logout };
