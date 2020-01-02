export const refundReducer = (state, action) => {
  switch (action.type) {
    case "ADD_REFUND":
      return state + action.refund;
    case "RESET_REFUND":
      return 0;
    default:
      return state;
  }
};
