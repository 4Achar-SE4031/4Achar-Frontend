import { RouteObject, Navigate, createBrowserRouter } from "react-router-dom";
import App from "../../App";
import EventDetails from "../../features/user/concertDetailsPage/concertDetail";


// import ForgetPassword from "../../features/user/forgetPassword/ForgetPassword";
// import Verification from "../../features/user/verification/Verification";
// import Login from "../../features/user/login/Login";
import AuthProvider from "../../features/user/Authentication/authProvider";
// import Register from "../../features/user/register/Register";
// import UserInfo from "../../features/user/Profile/UserIn

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
      //  {path:"/login",  element: <Login />},
      //  {path:"/register",  element: <Register />},
      //  {path:"/password-recovery",  element:<PasswordRecovery />},
      //  {path:"not-found",  element: <PageNotFound />},
       { path: "*", element: <Navigate replace to="not-found" /> },
       {path:"/concert-details",  element: <EventDetails />},
      ],
    },
  ];
  
  export const router = createBrowserRouter(routes);