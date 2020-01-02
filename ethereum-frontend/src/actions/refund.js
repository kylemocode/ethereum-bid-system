export const addRefund = refund => {
  return { type: "ADD_REFUND", refund };
};

export const resetRefund = () => {
  return { type: "ADD_REFUND" };
};
