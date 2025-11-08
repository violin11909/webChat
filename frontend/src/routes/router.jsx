import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Landing from "../pages/home/Landing"
const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/chat",
    element: <App />,
  },
]);

export default router;