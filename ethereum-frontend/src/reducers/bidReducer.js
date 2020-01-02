export const bidReducer = (state, action) => {
  switch (action.type) {
    case "SET_BID_VALUE":
      return action.bidValue;
    default:
      return state;
  }
};
