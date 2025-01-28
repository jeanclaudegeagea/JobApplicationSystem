import Notification from "./pages/Notification";
import Profile from "./pages/Profile";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import CreateJob from "./pages/CreateJob";
import ApplyJob from "./pages/ApplyJob";

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
  {
    path: "/create-job",
    component: CreateJob,
  },
  {
    path: "/apply-job",
    component: ApplyJob,
  },
];

export const publicRoutes = [
  {
    path: "/signup",
    component: SignUp,
  },
];
