require('dotenv/config');
const { use } = require('../routes/authRoute');
const { connectMongodb, getDB } = require("../services/dbService");
const ShortUniqueId = require('short-unique-id');
const uid = new ShortUniqueId();

const messageController = {

    getMesssages : async(req,res) => {
        const chatId = req.query.chatId;

        try {

            await connectMongodb();

            const chatModel = getDB().collection(process.env.CHATS);

            const userModel = getDB().collection(process.env.USERS);

            const chat = await chatModel.findOne({ chat_id: chatId});

            let messages = [];

            if(chat && chat.messages.length > 0) {
                for(const message of chat.messages) {

                    const user = await userModel.findOne({user_id: message.sender}, { projection : { user_id: 1, email: 1, photo: 1, u_nm: 1}})
                     messages.push({
                        content: message.content,
                        isGroup_chat: chat.isGroup_chat,
                        chat_id: chat.chat_id,
                        u_nm:user.u_nm,
                        email: user.email,
                        photo: user.photo,
                        user_id: user.user_id
                    })
                }
            }
            return res.status(200).json(messages)
            
        } catch (error) {
            return res.status(500).json({ message: "Failed to fetchMessages", error });  
            
        }
    },

    sendNewMessage : async(req,res) => {
        const {content, chatId} = req.body;
        const logedinUserId = req.sdata["user"]["user_id"];
        try {

            await connectMongodb();

            const chatModel = getDB().collection(process.env.CHATS);

            const userModel = getDB().collection(process.env.USERS);

            const newMessage = {
                msg_id: uid.randomUUID(6),
                content: content,
                sender: logedinUserId,
                c_on: new Date(),
                u_on: new Date()
            }

            const result = await chatModel.findOneAndUpdate(
                {chat_id: chatId},
                {
                    $push: { messages : newMessage},
                    $set:{
                        u_on: new Date(),
                        latest_message: content  
                    }
                },
                { returnDocument: "after" }
            );

            if(result) {
                const user = await userModel.findOne({user_id: logedinUserId}, { projection:{ u_nm:1, email:1, user_id: 1, photo: 1}})
                const message = {
                    content: newMessage.content,
                    c_on: newMessage.c_on,
                    isGroup_chat: result.isGroup_chat,
                    chat_id: result.chat_id,
                    u_nm: user.u_nm,
                    email: user.email,
                    photo: user.photo,
                    user_id: user.user_id
                }
                return res.status(200).json(message)
            }
            
        } catch (error) {
            return res.status(500).json({ message: "Failed to send New message", error });  
        }
    }
}

module.exports = messageController;