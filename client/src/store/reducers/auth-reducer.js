import { authActions, addNewUserActions , fetchTokenDetailsActions, logoutActions} from "../actions/actions";

const authState = {
    authUser : {},
    generalError : '',
    isAuthenticated : false
}

const tokenDetails = {
    token:{},
    isAuthenticated : false
}

const logoutState = {
    logout:{},
    isLogout:false
}

export const authUserDataReducer = (state = authState, action) => {
    switch(action.type) {
        case authActions.GET_AUTH_DATA_SUCCESS:
            return {
                ...state,
                generalError: "success",
                isAuthenticated : true,
                authUser: action.payload
            };
        case authActions.GET_AUTH_DATA_FAILURE:
            return {
                ...state,
                generalError: action.payload,
                authUser: {},
            };
        case authActions.RESET_AUTH_DATA_ERROR:
            return {
                ...state,
                authUser: {},
                isAuthenticated : false,
                generalError: ''
            }
        default:
            return state;
    }
}

export const addNewUserReducer = (state = authState, action) => {
    switch(action.type) {
        case addNewUserActions.ADD_NEW_USER_SUCCESS:
            return {
                ...state,
                 generalError: 'success',
                 authUser: action.payload,
                isAuthenticated : true
               
            }
        case addNewUserActions.ADD_NEW_USER_FAILURE:
            return {
                ...state,
                authUser:{},
                generalError:action.payload
            }
        case addNewUserActions.RESET_ADD_NEW_USER_ERROR:
            return {
                ...state,
                authUser:{},
                isAuthenticated : false,
                generalError:''
            }
        default:
            return state;
    }
}

export const fetchTokenDetailsReducer = (state = tokenDetails, action) => {
    switch(action.type){
        case fetchTokenDetailsActions.FETCH_TOKEN_DETAILS_SUCCESS:
            return {
                ...state,
                token:action.payload,
                isAuthenticated : true
            };
        case fetchTokenDetailsActions.RESET_TOKEN_DETAILS_STATE:
            return {
                ...state,
                token:{},
                isAuthenticated : false
            };
        default:
            return state;
    }
}

export const logoutReducer = (state = logoutState, action) => {
    switch(action.type){
        case logoutActions.LOGOUT_SUCCESS:
            return {
                ...state,
                logout:action.payload,
                isLogout : true
            };
        case logoutActions.RESER_LOGOUT_STATE:
            return {
                ...state,
                isLogout : false
            };
        default:
            return state;
    }
}