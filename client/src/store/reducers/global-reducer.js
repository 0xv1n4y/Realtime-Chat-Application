import { selectedUserActions, notficationsActions } from "../actions/actions";
import { selectUser } from "../actions/global-actions";


export const notficationsState = {
   notfications : []
};

export const selectedUserState = {
    selectedUser : {}
}

export const selectedUserReducer = ( state = selectedUserState, action) => {
switch( action.type) {
    case selectedUserActions.SELECTED_USER:
        return {
            ...state,
            selectUser : action.payload,
        };
    case selectedUserActions.RESET_USER:
        return {
            ...state,
            selectUser:{}
        }
    default:
        return state;
}
}

export const notficationReducer = ( state = notficationsState, action) => {
    switch( action.type) {
        case "NOTFICATIONS":
            return {
                ...state,
                notfications: [...state.notfications, action.payload]
            };
        default:
            return state;
    }
    }