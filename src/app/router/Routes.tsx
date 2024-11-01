import { RouteObject, Navigate, createBrowserRouter } from "react-router-dom";
import App from "../../App";
import ForgetPassword from "../../features/user/forgetPassword/ForgetPassword";
import Login from "../../features/user/login/Login";
import AuthProvider from "../../features/user/login/authProvider";

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
      //  {path:"/register",  element: <Register />},
       {path:"/forget-password",  element:<ForgetPassword />},
      //  {path:"not-found",  element: <PageNotFound />},
       { path: "*", element: <Navigate replace to="not-found" /> },
      ],
    },
  ];
  
  export const router = createBrowserRouter(routes);