import { combineReducers } from "redux";
import { authUserDataReducer, addNewUserReducer, fetchTokenDetailsReducer , logoutReducer} from "./auth-reducer";
import { getUsersReducer } from "./user-reducer";
import { selectedUserReducer, notficationReducer } from "./global-reducer";
import { createChatReducer, getChatsReducer} from "./chat-reducer";
import { getMessagesReducer, sendNewMessageReducer } from "./message-reducer";
import { createGroupReducer, updateGroupNameReducer, leaveGroupReducer, addNewMembersReducer, removeMembersReducer } from "./group-reducer";

export const rootReducer = combineReducers({
    authUserDataReducer,
    addNewUserReducer,
    getUsersReducer,
    selectedUserReducer,
    createChatReducer,
    getChatsReducer,
    getMessagesReducer,
    createGroupReducer,
    updateGroupNameReducer,
    leaveGroupReducer,
    addNewMembersReducer,
    removeMembersReducer,
    sendNewMessageReducer,
    notficationReducer,
    fetchTokenDetailsReducer,
    logoutReducer
});