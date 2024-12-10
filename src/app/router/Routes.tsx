import { RouteObject, Navigate, createBrowserRouter } from "react-router-dom";
import App from "../../App";
import ForgetPassword from "../../features/user/forgetPassword/ForgetPassword";
import Verification from "../../features/user/verification/Verification";
import Login from "../../features/user/login/Login";
import AuthProvider from "../../features/user/login/authProvider";
import Register from "../../features/user/register/Register";
import UserInfo from "../../features/user/Profile/UserInfo";
import EventsList from "../../features/events/EventsList";
import EventDetails from "../../features/user/concertDetailsPage/concertDetail";
import PageNotFound from '../../features/user/concertDetailsPage/PageNotFound/PageNotFound'

import FiveEvents from "../../features/events/FiveEvents";
import ResetPassword from "../../features/user/forgetPassword/ResetPassword";
import Home from "../layout/Home";

export const routes: RouteObject[] = [
    {
      path: "/",
       element: (
        <AuthProvider>
          <App />
        </AuthProvider>
      ),
      children: [
      //  {path:"/" , element: <Landing />},
      //  {path:"/home",  element: <Home />},
       {path:"/login",  element: <Login />},
       {path:"/concertDetail",  element: <EventDetails />},
       {path:"/register",  element: <Register />},
       {path:"/forget-password",  element:<ForgetPassword />},
       {path:"/verify",  element:<Verification />},
       {path:"/user-info", element: <UserInfo />},
       {path:"/events", element: <EventsList />},
       {path:"not-found",  element: <PageNotFound />},
       {path:"/events/recent", element: <EventsList />},
       {path:"/events/popular", element: <EventsList />},
       {path:"/events", element: <FiveEvents />},
       {path:"/account/reset_password", element: <ResetPassword />},
       {path: "/home", element: <Home />},
      //  {path:"not-found",  element: <PageNotFound />},
       { path: "*", element: <Navigate replace to="not-found" /> },
      ],
    },
  ];
  
  export const router = createBrowserRouter(routes);