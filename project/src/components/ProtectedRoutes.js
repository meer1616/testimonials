import React from 'react'
import { Navigate, Outlet, useLocation } from "react-router-dom"
import { getCurrentUser } from '../services/getcurrentuser';
const ProtectedRoutes = () => {

  const location = useLocation()
  const currentUser = getCurrentUser();

console.log("currrrr",currentUser);
  // if (!accessToken) {
  //   return <Navigate to="/login" state={{ from: location }} />
  // }
  // return <Outlet />

  return (currentUser ?
    <Outlet /> :  <Navigate to="/login" state={{ from: location }} replace />
  )

}

export default ProtectedRoutes