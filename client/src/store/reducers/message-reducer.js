import { getMessagesActions, sendNewMessageActions } from "../actions/actions";

const messagesState = {
    messages : [],
    generalError: ""
}

const newMessageState = {
    newMessage : {},
    generalError: ""
}

export const getMessagesReducer = ( state = messagesState, action) => {
    switch(action.type) {
        case getMessagesActions.GET_MESSAGES_SUCCESS:
            return{
                ...state,
                messages: action.payload,
                generalError: ""
            };
        case getMessagesActions.GET_MESSAGES_FAILUER:
            return {
                ...state,
                messages:[],
                generalError: action.payload
            };
        case getMessagesActions.RESET_MESSAGES:
            return {
                ...state,
                messages:[]
            }
        default:
            return state;
    }
}

export const sendNewMessageReducer = ( state = newMessageState, action) => {
    switch(action.type) {
        case sendNewMessageActions.SEND_NEW_MESSAGE_SUCCESS:
            return{
                ...state,
                newMessage: action.payload,
                generalError: ""
            };
        case sendNewMessageActions.SEND_NEW_MESSAGE_FAILURE:
            return {
                ...state,
                newMessage:[],
                generalError: action.payload
            };
        default:
            return state;
    }
}