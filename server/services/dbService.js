require('dotenv/config');

const {MongoClient} = require('mongodb');

let client;

const url = process.env.MONDODB_URL;
const dbName = process.env.DBNAME;


client = new MongoClient(url,{ });
let isConnected = false;

const  connectMongodb = async () => {
    try {
        if(!isConnected) {
            await client.connect();
            isConnected = true;
            console.log('Connected to MongoDB');
        }else{
            console.log('Connection is already active');
        }
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        isConnected = false;
        throw error; // Throw error to indicate failure to connect 
    }
}

const getDB = () => {
    if(!client) {
        throw new Error('MongoDB client is not connected');
    } else{
        return client.db(dbName);
    }
}

module.exports = {connectMongodb, getDB}