import { createChatActions, getChatsActions } from "./actions";
import axios from "axios";
import { GLOBALS } from "../../global";


// Action createros for success and failure

export const createChatSuccess = (response) => {
    return { type: createChatActions.CREATE_CHAT_SUCCESS, payload: response}
};

export const createChatFailure = (error) => {
    return { type: createChatActions.CREATE_CHAT_FAILUER, payload: error}
};

export const createChat = (id) => {
    return function(dispatch) {
        axios.post(GLOBALS.api_createchat, { id: id}).then((response) => {
            dispatch(createChatSuccess(response.data))
        }).catch((error) => {
            dispatch(createChatFailure(error));
        })
    }
}

export const getChatsSuccess = (response) => {
    return { type: getChatsActions.GET_CHATS_SUCCESS, payload: response}
};

export const getChatsFailure = (error) => {
    return { type: getChatsActions.GET_CHATS_FAILUER, payload: error}
};

export const getChats = () => {
    return function (dispatch) {
        axios.get(GLOBALS.api_fecthchats).then((response) => {
            dispatch(getChatsSuccess(response.data));
        }).catch((error) => {
            dispatch(getChatsFailure(error));
        })
    }
}
