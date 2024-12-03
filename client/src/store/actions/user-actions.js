import axios from "axios";
import { getUsersActions } from "./actions";
import { GLOBALS } from "../../global";

export const getUsersSuccess = (response) => {
    return { type: getUsersActions.GET_USERS_SUCCESS, payload: response}
};

export const getUsersFailure = (error) => {
    let errorMessage = '';
    if (error.response && error.response.data) {
        errorMessage = error.response.data || error.response.data.error || "Unknown error occurred"; 
    } else {
        errorMessage = error.message; 
    }
    return { type: getUsersActions.GET_USERS_FAILURE, payload: errorMessage}
};

export const resetUsers = () => {
    return { type: getUsersActions.RESET_GET_USERS_STATE}
};

export const getUsers = (search) => {
    return function(dispatch) {
        axios.get(GLOBALS.api_getusers, { params: {search: search}},).then(response => {
            dispatch(getUsersSuccess(response.data));
        })
        .catch(error => {
            dispatch(getUsersFailure(error))
        })
    }
};
