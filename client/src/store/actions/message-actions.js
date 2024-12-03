import axios from "axios";
import { getMessagesActions, sendNewMessageActions } from "./actions";
import { GLOBALS } from "../../global";

export const getMessagesSuccess = (response) => {
    return { type: getMessagesActions.GET_MESSAGES_SUCCESS, payload: response}
}

export const getMessagesFailure = (error) => {
    return { type: getMessagesActions.GET_MESSAGES_FAILUER, payload: error}
}

export const resetMessages = () => {
    return { type: getMessagesActions.RESET_MESSAGES}
}

export const getMessages = (chatId) => {
    return function (dispatch) {
        axios.get(GLOBALS.api_fetchmessages, {params: {chatId: chatId}}).then((response) => {
            dispatch(getMessagesSuccess(response.data));
        }).catch((error) => {
            dispatch(getMessagesFailure(error));
        })
    }
}

export const sendNewMessageSuccess = (response) => {
    return { type : sendNewMessageActions.SEND_NEW_MESSAGE_SUCCESS, payload: response}
}

export const sendNewMessageFailure = (error) => {
    return { type : sendNewMessageActions.SEND_NEW_MESSAGE_FAILURE, payload: error}
}

export const sendNewMessage = (content) => {
    return function (dispatch)  {
        axios.post(GLOBALS.api_sendnewmessage , content).then((response) => {
            dispatch(sendNewMessageSuccess(response.data));
        }).catch((error) => {
            dispatch(sendNewMessageFailure(error));
        })
        
    }
}
