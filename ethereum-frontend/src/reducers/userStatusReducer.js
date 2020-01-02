export const userStatusReducer = (state, action) => {
  switch (action.type) {
    case "SET_STATUS":
      return action.status;
    default:
      return state;
  }
};
