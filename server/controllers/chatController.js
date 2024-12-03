require('dotenv/config');
const { connectMongodb, getDB } = require("../services/dbService");
const ShortUniqueId = require('short-unique-id');
const uid = new ShortUniqueId();

const chatController = {

    createChat : async(req,res) => {
        const logedinUserId = req.sdata["user"]["user_id"];
        const userId = req.body.id;

        try {

            await connectMongodb();

            const chatModel = getDB().collection(process.env.CHATS);

            const userModel = getDB().collection(process.env.USERS);

            const userDetails = await userModel.findOne({user_id : userId}, {projection:{_id:0, c_on: 0, u_on:0, pwd:0}})

            const isChatExists = await chatModel.findOne( { isGroup_chat: false, users: { $all: [logedinUserId, userId] }  }, {projection:{_id:0, c_on: 0, u_on:0, users:0}} );
            let chat;

            if(isChatExists) {
                chat = {...isChatExists, userDetails };
                
            } else {
                const newChat = {
                    chat_id: uid.randomUUID(8),
                    users: [logedinUserId, userId],
                    isGroup_chat: false,
                    c_on: new Date(),
                    u_on: new Date(),
                    latest_message: "",
                    messages: []
                }
                const result = await chatModel.insertOne(newChat);
                if(result.insertedId) {
                    chat = {chat_id:newChat.chat_id, isGroup_chat: newChat.isGroup_chat, userDetails}
                }
            }
            if(chat){
                return res.status(200).json({ status : true, message: chat});
            }

        } catch (error) {
            return res.status(500).json({ message: "Failed to create NewChat", error });
        }
    },

    getChats: async (req, res) => {
        const logedinUserId = req.sdata["user"]["user_id"];
        try {
            await connectMongodb();
            const chatModel = getDB().collection(process.env.CHATS);
            const userModel = getDB().collection(process.env.USERS);
    
            // Fetch all chats involving the logged-in user
            const chats = await chatModel.find({ users: { $in: [logedinUserId] } }).sort({ u_on: -1 }).toArray();
    
            const allChats = [];
    
            // Loop through each chat
            for (const chat of chats) {
                if (!chat.isGroup_chat) {
                    // Find the receiver's ID (the other user in the chat)
                    const reciverId = chat.users.find(user => user !== logedinUserId);
    
                    // Fetch receiver's details from the user model
                    const reciver = await userModel.findOne( { user_id: reciverId } );
    
                    // Push the chat details along with receiver's name, email, and photo
                    allChats.push({
                        chat_id: chat.chat_id,
                        latest_message: chat.latest_message,
                        isGroup_chat: chat.isGroup_chat,
                        u_nm: reciver ? reciver.u_nm : "",
                        email: reciver ? reciver.email : "",
                        photo: reciver ? reciver.photo : ""
                    });
                } else {
                    // For group chats, get the user details for all users in the group
                    let allUsers = [];
                    for (const userId of chat.users) {
                        if( userId !== logedinUserId) {
                            const user = await userModel.findOne( { user_id: userId } );
                            if (user) {
                                allUsers.push({
                                    u_nm: user.u_nm,
                                    user_id: user.user_id,
                                    photo: user.photo
                                });
                            }
                        }
                    }
    
                    // Push group chat details along with group members
                    allChats.push({
                        chat_id: chat.chat_id,
                        latest_message: chat.latest_message,
                        isGroup_chat: chat.isGroup_chat,
                        group_name: chat.group_name,
                        group_admin: chat.group_admin,
                        users: allUsers
                    });
                }
            }
    
            return res.status(200).json(allChats);
        } catch (error) {
            return res.status(500).json({ message: "Failed to fetch chats", error });
        }
    }
}

module.exports = chatController;