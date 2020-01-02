import React, { createContext, useReducer } from "react";
import { userStatusReducer } from "../reducers/userStatusReducer";

export const UserStatusContext = createContext();

const UserStatusContextProvider = props => {
  const [userStatus, dispatch_status] = useReducer(userStatusReducer, 0);

  return (
    <UserStatusContext.Provider value={{ dispatch_status, userStatus }}>
      {props.children}
    </UserStatusContext.Provider>
  );
};

export default UserStatusContextProvider;
