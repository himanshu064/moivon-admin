import React from "react";
import { Navigate } from "react-router-dom";
import { isEmpty } from "../utils/helpers";
import { getLocalStorage } from "../utils/localStorage";

const PrivateRoute = ({ children }) => {
  const auth = getLocalStorage("auth");

  if (auth && !isEmpty(auth)) {
    return children;
  }

  return <Navigate to="/login" replace />;
};

export default PrivateRoute;
