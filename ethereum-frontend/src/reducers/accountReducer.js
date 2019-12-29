export const accountReducer = (state, action) => {
  switch (action.type) {
    case "SET_CURRENT_ACCOUNT":
      return action.account;
    default:
      return state;
  }
};
