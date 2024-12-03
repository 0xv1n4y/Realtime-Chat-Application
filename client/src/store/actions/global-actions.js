import {selectedUserActions, notficationsActions } from "./actions";

// Action creators
export const selectUser = (user) => {
  return {
    type: 'SELECTED_USER', // Ensure this matches your action type
    payload: user,          // Pass the user object as the payload
  };
};

export const resetSelectedUser = () => {
  return {
    type: selectedUserActions.RESET_USER
  }
}

export const AddNotfications = (noftication) => {
  return { type: "NOTFICATIONS", payload: noftication}
}