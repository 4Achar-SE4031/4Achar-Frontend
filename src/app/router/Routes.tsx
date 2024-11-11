import { RouteObject, Navigate, createBrowserRouter } from "react-router-dom";
import App from "../../App";
import ForgetPassword from "../../features/user/forgetPassword/ForgetPassword";
import Verification from "../../features/user/verification/Verification";
import Login from "../../features/user/login/Login";
import AuthProvider from "../../features/user/login/authProvider";
import Register from "../../features/user/register/Register";
import UserInfo from "../../features/user/Profile/UserInfo";
import EventsList from "../../features/events/EventsList";

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
       {path:"/register",  element: <Register />},
       {path:"/forget-password",  element:<ForgetPassword />},
       {path:"/verify",  element:<Verification />},
       {path:"/user-info", element: <UserInfo />},
       {path:"/events", element: <EventsList />},
      //  {path:"not-found",  element: <PageNotFound />},
       { path: "*", element: <Navigate replace to="not-found" /> },
      ],
    },
  ];
  
  export const router = createBrowserRouter(routes);