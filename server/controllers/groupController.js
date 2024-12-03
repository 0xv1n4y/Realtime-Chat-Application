require('dotenv/config');
const { connectMongodb, getDB } = require("../services/dbService");
const ShortUniqueId = require('short-unique-id');
const uid = new ShortUniqueId();

const groupController = {
    
    createGroup : async (req,res) => {
        const logedinUserId = req.sdata["user"]["user_id"];
        const newGroup = req.body;
        
        try {
            await connectMongodb();

            const chatModel = getDB().collection(process.env.CHATS);

            newGroup.isGroup_chat = true;
            newGroup.group_admin = logedinUserId;
            newGroup.chat_id = uid.randomUUID(8);
            newGroup.c_on = new Date();
            newGroup.u_on = new Date();
            newGroup.latest_message = "",
            newGroup.users.push(logedinUserId);
            newGroup.messages = [];

            const createNewGroup = await chatModel.insertOne(newGroup);

            if(createNewGroup.insertedId) {
                return res.status(200).json(newGroup);
            } else {
                return res.status(400).json("Failed to create new Group")
            }

        } catch (error) {
            return res.status(500).json({ message: "Failed to create NewGroup", error });
        }
    },
    removeMembers : async ( req, res) => {
        const logedinUserId = req.body.user_id;
        const chatId = req.params.groupId;
        try {
            await connectMongodb();

            const chatModel = getDB().collection(process.env.CHATS);

            const result = await chatModel.findOneAndUpdate(
                {chat_id: chatId},
                {$pull : { users : logedinUserId }},
                { returnDocument: 'after' }
            );
            if( result) {
                return res.status(200).json({ message: "Successfully left the group", status: true });
            }
            
        } catch (error) {
            return res.status(500).json({ message: "Failed to leave group", error });

        }
    },
    leaveGroup : async ( req, res) => {
        const logedinUserId = req.sdata["user"]["user_id"];;
        const chatId = req.body.chatId;
        try {
            await connectMongodb();

            const chatModel = getDB().collection(process.env.CHATS);

            const result = await chatModel.findOneAndUpdate(
                {chat_id: chatId},
                {$pull : { users : logedinUserId }},
                { returnDocument: 'after' }
            );
            if( result) {
                return res.status(200).json({ message: "Successfully leave the chat", status: true });
            }
            
        } catch (error) {
            return res.status(500).json({ message: "Failed to leave chat", error });

        }
    },

    updateGroupName: async (req, res) => {
        const chatId = req.params.groupId;  // Get groupId from the URL parameters
        const newGroupName = req.body.groupName;  // Get new groupName from the request body
    
        try {
            await connectMongodb();  // Ensure the MongoDB connection
    
            const chatModel = getDB().collection(process.env.CHATS);
    
            // Update the group name based on chatId
            const result = await chatModel.findOneAndUpdate(
                { chat_id: chatId },  // Find the chat document by chatId
                { $set: { group_name: newGroupName } },  // Update the groupName
             
            );

            if(result) {
                return res.status(200).json({  status: true, message: "Group name updated successfully" });

            }
    
    
        } catch (error) {
            return res.status(500).json({ message: "Failed to update group name", error });
        }
    },
    addNewMembers: async (req, res) => {
        const chatId = req.params.groupId;  // Get groupId from the URL parameters
        const newMembers = req.body.users;  // Get new groupName from the request body
    
        try {
            await connectMongodb();  // Ensure the MongoDB connection
    
            const chatModel = getDB().collection(process.env.CHATS);
    
            const result = await chatModel.findOneAndUpdate(
                { chat_id: chatId },  // Find the chat document by chatId
                { $addToSet: { users: { $each: newMembers } } },  // Add new members to the users array, avoiding duplicates
            );

            if(result) {
                return res.status(200).json({  status: true, message: "Added newUsers successfully successfully" });
            }

        } catch (error) {
            return res.status(500).json({ message: "Failed to add new users", error });
        }
    },
    
    

}

module.exports = groupController;