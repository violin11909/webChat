import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Register from "../pages/auth/Register"
import Login from "../pages/auth/Login";
import Home from "../pages/home/Home"

import ProtectedRoute from "./protect";
import PublicRoute from "./public";

const router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/chat",
        element: <App />,
      },
    ],
  },
  {
    element: <PublicRoute />,
    children: [
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
]);

export default router;