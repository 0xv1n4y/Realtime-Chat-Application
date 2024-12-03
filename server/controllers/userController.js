require('dotenv/config');
const { connectMongodb, getDB } = require("../services/dbService");

const  userController = {

    getUsers: async (req, res) => {
        const search = req.query.search;
        const userId = req.sdata["user"]["user_id"];
        
        try {
            await connectMongodb();
    
            const userModel = getDB().collection(process.env.USERS);
            const chatModel = getDB().collection(process.env.CHATS);
    
            // Find all users except the current user, filtering by username or email
            const users = await userModel.find({
                $and: [
                    { user_id: { $ne: userId } },
                    {
                        $or: [
                            { u_nm: { $regex: search, $options: "i" } },
                            { email: { $regex: search, $options: "i" } }
                        ]
                    }
                ]
            }, {
                projection: { u_nm: 1, email: 1, photo: 1, user_id: 1, _id: 0 }
            }).toArray();
    
            // Fetch chat data for all users concurrently using Promise.all
            const allUsers = await Promise.all(users.map(async (user) => {
                const chat = await chatModel.findOne({
                    users: { $in: [user.user_id] },
                    isGroup_chat: false
                });
    
                return { ...user, chat_id: chat ? chat.chat_id : null };
            }));
    
            return res.status(200).json(allUsers);
            
        } catch (error) {
            return res.status(500).json("An error occurred while fetching user details");
        }
    }
    

};

module.exports = userController;