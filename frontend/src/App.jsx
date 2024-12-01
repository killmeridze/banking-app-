import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./styles/style.css";
import "./styles/responsive.css";
import { Home } from "./pages/Home/Home";
import { Login } from "./pages/Login/Login";
import { Register } from "./pages/Register/Register";
import { Dashboard } from "./pages/Dashboard/Dashboard";
import { AboutUs } from "./pages/AboutUs/AboutUs";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/dashboard",
      element: <Dashboard />,
    },
    {
      path: "/about-us",
      element: <AboutUs />,
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
      v7_normalizeFormMethod: true,
      v7_fetcherPersist: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    },
  }
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
