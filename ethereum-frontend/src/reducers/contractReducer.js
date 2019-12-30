export const contractReducer = (state, action) => {
  switch (action.type) {
    case "SET_CURRENT_CONTRACT":
      return action.contract;
    default:
      return state;
  }
};
