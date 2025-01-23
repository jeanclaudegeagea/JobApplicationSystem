import Home from "./pages/Home";
import SignUp from "./pages/SignUp";

export const privateRoutes = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/home",
    component: Home,
  },
];

export const publicRoutes = [
  {
    path: "/signup",
    component: SignUp,
  },
];
