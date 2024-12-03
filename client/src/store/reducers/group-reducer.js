import { createGroupActions , leaveGroupActions, updateGroupNameActions, addNewMembersActions, removeMembersActions} from "../actions/actions";

const newGroupState = {
    newGroup: {},
    generalError: ""
}

const leaveGroupState = {
    leaveGroup: {},
    generalError: ""
}

const updateGroupNameState = {
    updatedGroupName: {},
    generalError: ""
}

const addMembersState = {
    newMembers: {},
    generalError: ""
}

const removeMembersState = {
    removeMembers: {},
    generalError: ""
}

export const createGroupReducer = ( state = newGroupState, action) => {
    switch(action.type) {
        case createGroupActions.CREATE_GROUP_SUCCESS:
            return{
                ...state,
                newGroup: action.payload,
                generalError: ""
            };
        case createGroupActions.CREATE_GROUP_FAILUER:
            return{
                ...state,
                newGroup:{},
                generalError: action.payload
            };
        case createGroupActions.RESET_GROUP_STATE:
            return{
                ...state,
                newGroup:{}
            }
        default:
            return state;
    }
}
export const removeMembersReducer = ( state = removeMembersState, action) => {
    switch(action.type) {
        case removeMembersActions.REMOVE_MEMBERS_SUCCESS:
            return{
                ...state,
                removeMembers: action.payload,
                generalError: ""
            };
        case removeMembersActions.REMOVE_MEMBERS_FAILURE:
            return{
                ...state,
                removeMembers: {},
                generalError: action.payload
            };
        default:
            return state;
    }
}

export const updateGroupNameReducer = ( state = updateGroupNameState, action) => {
    switch(action.type) {
        case updateGroupNameActions.UPADTE_GROUP_NAME_SUCCESS:
            return{
                ...state,
                updatedGroupName: action.payload,
                generalError: ""
            };
        case updateGroupNameActions.UPADTE_GROUP_NAME_FAILURE:
            return{
                ...state,
                updatedGroupName: {},
                generalError: action.payload
            };
        default:
            return state;
    }
}

export const leaveGroupReducer = ( state = leaveGroupState, action) => {
    switch(action.type) {
        case leaveGroupActions.LEAVE_GROUP_SUCCESS:
            return{
                ...state,
                leaveGroup: action.payload,
                generalError: ""
            };
        case leaveGroupActions.LEAVE_GROUP_FAILURE:
            return{
                ...state,
                leaveGroup: {},
                generalError: action.payload
            };
        case leaveGroupActions.RESET_LEAVE_GROUP_STATE:
            return{
                ...state,
                leaveGroup: {},
            };
        default:
            return state;
    }
}

export const addNewMembersReducer = ( state = addMembersState, action) => {
    switch(action.type) {
        case addNewMembersActions.ADD_NEW_MEMBERS_SUCCESS:
            return{
                ...state,
                newMembers: action.payload,
                generalError: ""
            };
        case addNewMembersActions.ADD_NEW_MEMBERS_FAILURE:
            return{
                ...state,
                newMembers: {},
                generalError: action.payload
            };
        default:
            return state;
    }
}