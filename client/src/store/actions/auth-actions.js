import { authActions, addNewUserActions, fetchTokenDetailsActions, logoutActions } from "./actions";
import { GLOBALS } from "../../global";
import axios from 'axios';

export const authDataSuccess = (response) => {
    return { type: authActions.GET_AUTH_DATA_SUCCESS, payload: response}
};

export const authDataFailure = (error) => {
    let errorMessage = '';
    if (error.response && error.response.data) {
        errorMessage = error.response.data || error.response.data.error || "Unknown error occurred"; 
    } else {
        errorMessage = error.message; 
    }
    return { type: authActions.GET_AUTH_DATA_FAILURE, payload: errorMessage}
};

export const resetAuthDataError = () => {
    return { type: authActions.RESET_AUTH_DATA_ERROR}
};

export const getUserAuthentication = (reqBody) => {
    return function(dispatch) {
        axios.post(GLOBALS.api_login, reqBody,{ withCredentials: true }).then(response => {
            dispatch(authDataSuccess(response.data));
        })
        .catch(error => {
            dispatch(authDataFailure(error))
        })
    }
};

export const addNewUserSuccess = (response) => {
    return { type: addNewUserActions.ADD_NEW_USER_SUCCESS, payload:response}
}
export const addNewUserFailure = (error) => {
    let errorMessage = '';
    if (error.response && error.response.data) {
        errorMessage = error.response.data || error.response.data.error || "Unknown error occurred"; 
    } else {
        errorMessage = error.message; 
    }
    return { type: addNewUserActions.ADD_NEW_USER_FAILURE, payload: errorMessage}
}

export const resetAddNewUserError = () => {
    return { type: addNewUserActions.RESET_ADD_NEW_USER_ERROR}
}
export const addNewUser = (newUser) => {
    return function(dispatch) {
        axios.post(GLOBALS.api_newuser, newUser, { withCredentials: true }).then(response => {
            dispatch(addNewUserSuccess(response.data));
        })
        .catch(error => {
            dispatch(addNewUserFailure(error));
        })
    }
}

export const fetchTokenDetailsSuccess = (response) => {
    return { type: fetchTokenDetailsActions.FETCH_TOKEN_DETAILS_SUCCESS, payload: response}
}

export const resetTokenDetails = () => {
    return { type: fetchTokenDetailsActions.RESET_TOKEN_DETAILS_STATE}
}

export const fetchTokenDetails = () => {
    return function(dispatch) {
        axios.get(GLOBALS.api_fetchtoken, { withCredentials: true }).then(response => {
            dispatch(fetchTokenDetailsSuccess(response.data));
        })
    }
}

export const logoutSuccess = (response) => {
    return { type: logoutActions.LOGOUT_SUCCESS, payload: response}
}

export const resetLogoutState = () => {
    return { type: logoutActions.RESER_LOGOUT_STATE}
}

export const logout = () => {
    return function(dispatch) {
        axios.post(GLOBALS.api_logout, { withCredentials: true }).then(response => {
            dispatch(logoutSuccess(response.data));
        })
    }
}

