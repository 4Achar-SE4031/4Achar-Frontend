import { RouteObject, Navigate, createBrowserRouter } from "react-router-dom";
import App from "../../App";
import ForgetPassword from "../../features/user/forgetPassword/ForgetPassword";
import Verification from "../../features/user/verification/Verification";
import Login from "../../features/user/login/Login";
import AuthProvider from "../../features/user/login/authProvider";
import Register from "../../features/user/register/Register";
import UserInfo from "../../features/user/Profile/UserInfo";
import EventsList from "../../features/events/EventsList";
import PageNotFound from '../../features/user/concertDetailsPage/PageNotFound/PageNotFound'

import FiveEvents from "../../features/events/FiveEvents";
import ResetPassword from "../../features/user/forgetPassword/ResetPassword";
import Home from "../layout/Home";
import ConcertDetails from "../../features/user/concertDetailsPage/concert_details";
import SearchBar from "../../features/Search/search";
import PrivateRoute from "../../features/user/login/privateRoute"
import Favorites from "../../features/Favorites/favorites";

export const routes: RouteObject[] = [
    {
      path:'/',
       element: (
        <AuthProvider>
          <App />
        </AuthProvider>
      ),
      children: [
       { index: true, element: <Home /> },
       {path:"/home",  element: <Home />},
       {path:"/singer/:singer",  element: <SearchBar />},
    //    {path:"/concertDetail",  element: <ConcertDetails />},
    //    <Route path="event-details/:id" element={<EventDetails />}
       {path:"/concertDetail/:id",  element: <ConcertDetails />},
       {path:"/login",  element: <Login />},
       {path:"/register",  element: <Register />},
       {path:"/forget-password",  element:<ForgetPassword />},
       {path:"/verify",  element:<Verification />},
       {path:"/user-info", element: <UserInfo />},
      {
        path: "/user-info",
        element: <PrivateRoute />,
        children: [
          { path: "", element: <UserInfo /> },
        ],
      },
      {
        path: "/favorites",
        element: <PrivateRoute />,
        children: [
          { path: "", element: <Favorites /> },
        ],
      },
       {path:"/events", element: <EventsList />},
       {path:"not-found",  element: <PageNotFound />},
       {path:"/events/recent", element: <EventsList />},
       {path:"/events/popular", element: <EventsList />},
       {path:"/events", element: <FiveEvents />},
       {path:"/account/reset_password", element: <ResetPassword />},
       { path: "*", element: <PageNotFound /> },
      ],
    },
  ];
  
  export const router = createBrowserRouter(routes);