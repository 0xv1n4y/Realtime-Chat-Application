import axios from "axios";
import { GLOBALS } from "../../global";
import { createGroupActions , leaveGroupActions, updateGroupNameActions, addNewMembersActions, removeMembersActions} from "./actions";

export const createGroupSuccess = (response) => {
    return { type: createGroupActions.CREATE_GROUP_SUCCESS, payload: response}
};

export const createGroupFailure = (error) => {
    return { type: createGroupActions.CREATE_GROUP_FAILUER, payload: error}
};

export const resetGroupState = () => {
    return { type: createGroupActions.RESET_GROUP_STATE}
}


export const createGroup = (newGroup) => {
    return function(dispatch) {
        axios.post(GLOBALS.api_creategroup, newGroup).then((response) => {
            dispatch(createGroupSuccess(response.data))
        }).catch((error) => {
            dispatch(createGroupFailure(error));
        })
    }
}

export const leaveGroupSuccess = (response) => {
    return { type: leaveGroupActions.LEAVE_GROUP_SUCCESS, payload: response}
};

export const leaveGroupFailure = (error) => {
    return { type: leaveGroupActions.LEAVE_GROUP_FAILURE, payload: error}
};

export const resetLeaveGroup = () => {
    return { type: leaveGroupActions.RESET_LEAVE_GROUP_STATE}
};




export const leaveGroup = (chatId) => {
    return function(dispatch) {
        axios.post(GLOBALS.api_leavegroup, {chatId : chatId})
            .then((response) => {
                dispatch(leaveGroupSuccess(response.data));
            })
            .catch((error) => {
                dispatch(leaveGroupFailure(error));
            });
    };
};

export const removeMembersSuccess = (response) => {
    return { type: removeMembersActions.REMOVE_MEMBERS_SUCCESS, payload: response}
};

export const removeMembersFailure = (error) => {
    return { type: removeMembersActions.REMOVE_MEMBERS_FAILURE, payload: error}
};

export const removeMembers = (group) => {
    return function(dispatch) {
        axios.post(`${GLOBALS.api_removemembers}${group.group_id}/leave`, { user_id: group.user_id})
            .then((response) => {
                dispatch(removeMembersSuccess(response.data));
            })
            .catch((error) => {
                dispatch(removeMembersFailure(error));
            });
    };
};

export const UpdateGroupNameSuccess = (response) => {
    return { type: updateGroupNameActions.UPADTE_GROUP_NAME_SUCCESS, payload: response}
};

export const UpdateGroupNameFailure = (error) => {
    return { type: updateGroupNameActions.UPADTE_GROUP_NAME_FAILURE, payload: error}
};

export const updateGroupName = (group) => {
    return function(dispatch) {
        axios.put(`${GLOBALS.api_updategroupname}${group.group_id}`, {groupName: group.groupName})
            .then((response) => {
                dispatch(UpdateGroupNameSuccess(response.data));
            })
            .catch((error) => {
                dispatch(UpdateGroupNameFailure(error));
            });
    };
};


export const addMembersSuccess = (response) => {
    return { type: addNewMembersActions.ADD_NEW_MEMBERS_SUCCESS, payload: response}
};

export const addMembersFailure = (error) => {
    return { type: addNewMembersActions.ADD_NEW_MEMBERS_FAILURE, payload: error}
};

export const addNewMembers = (group) => {
    return function(dispatch) {
        axios.post(`${GLOBALS.api_addmembers}${group.groupId}/members`, {users: group.users})
            .then((response) => {
                dispatch(addMembersSuccess(response.data));
            })
            .catch((error) => {
                dispatch(addMembersFailure(error));
            });
    };
};