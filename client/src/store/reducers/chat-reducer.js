import { createChatActions, getChatsActions } from "../actions/actions";

const newChatState = {
    newChat: {},
    generalError: ""
}

const fecthChatsState = {
    chats: [],
    generalError: ""
}

export const createChatReducer = ( state = newChatState, action) => {
    switch(action.type) {
        case createChatActions.CREATE_CHAT_SUCCESS:
            return{
                ...state,
                newChat: action.payload,
                generalError: ""
            };
        case createChatActions.CREATE_CHAT_FAILUER:
            return{
                ...state,
                newChat:{},
                generalError: action.payload
            };
        default:
            return state;
    }
}

export const getChatsReducer = ( state = fecthChatsState, action) => {
    switch(action.type) {
        case getChatsActions.GET_CHATS_SUCCESS:
            return{
                ...state,
                chats: action.payload,
                generalError: ""
            };
        case getChatsActions.GET_CHATS_FAILUER:
            return{
                ...state,
                chats: [],
                generalError: action.payload
            };
        default:
            return state;
    }
}