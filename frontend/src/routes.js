import Home from "./pages/Home";
import Notification from "./pages/Notification";
import Profile from "./pages/Profile";
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
  {
    path: "/profile",
    component: Profile,
  },
  {
    path: "/notification",
    component: Notification,
  },
];

export const publicRoutes = [
  {
    path: "/signup",
    component: SignUp,
  },
];
