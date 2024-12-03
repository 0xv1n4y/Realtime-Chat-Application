import { getUsersActions } from "../actions/actions";

const usersInitialState = {
    users : [],
    generalError: ""
}

export const getUsersReducer = ( state = usersInitialState, action) => {
    switch (action.type) {
        case getUsersActions.GET_USERS_SUCCESS:
            return {
                ...state,
                users: action.payload,
                generalError:""
            }
        case getUsersActions.GET_USERS_FAILURE:
            return {
                ...state,
                generalError: action.payload,
                users: []
            }
        case getUsersActions.RESET_GET_USERS_STATE:
            return {
                ...state,
                users: []
            }
        default:
            return state;
    }
}