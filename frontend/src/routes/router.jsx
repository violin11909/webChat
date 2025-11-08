import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Register from "../pages/auth/Register"
import Login from "../pages/auth/Login";
import Home from "../pages/home/Home"
import ImageUploader from "../components/common/ImageUploader";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/Login",
    element: <Login />,
  },
  {
    path: "/chat",
    element: <App />,
  },
  {
    path: "/upload",
    element: <ImageUploader />,
  },
]);

export default router;