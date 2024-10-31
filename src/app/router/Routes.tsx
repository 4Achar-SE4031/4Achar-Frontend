import { RouteObject, Navigate, createBrowserRouter } from "react-router-dom";
import App from "../App";

export const routes: RouteObject[] = [
    {
      path: "/",
      element: <App />,
      children: [
      //  {path:"/" , element: <Landing />},
      //  {path:"/home",  element: <Home />},
      //  {path:"/login",  element: <Login />},
      //  {path:"/register",  element: <Register />},
      //  {path:"/password-recovery",  element:<PasswordRecovery />},
      //  {path:"not-found",  element: <PageNotFound />},
       { path: "*", element: <Navigate replace to="not-found" /> },
      ],
    },
  ];
  
  export const router = createBrowserRouter(routes);