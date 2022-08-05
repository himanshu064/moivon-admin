import React from "react";
import { Navigate } from "react-router-dom";
import { isEmpty } from "../utils/helpers";
import { getLocalStorage } from "../utils/localStorage";

const PublicRoute = ({ children }) => {
  const auth = getLocalStorage("auth");

  if (auth && !isEmpty(auth)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
