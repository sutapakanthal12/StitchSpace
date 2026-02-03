import React from "react";
import { Navigate } from "react-router-dom";

function PrivateRoute({ user, children }) {
  return user ? children : <Navigate to="/auth" replace />;
}

export default PrivateRoute;
