import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import CreateJob from "./pages/CreateJob";
import ApplyJob from "./pages/ApplyJob";
import SearchedUser from "./pages/SearchedUser";
import SearchedCompany from "./pages/SearchedCompany";
import LandingPage from "./pages/LandingPage";

export const privateRoutes = [
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
    component: Notifications,
  },
  {
    path: "/create-job",
    component: CreateJob,
  },
  {
    path: "/apply-job",
    component: ApplyJob,
  },
  {
    path: "/searchedUser/:userId",
    component: SearchedUser,
  },
  {
    path: "/searchedCompany/:companyId",
    component: SearchedCompany,
  },
];

export const publicRoutes = [
  {
    path: "/",
    component: LandingPage,
  },
  {
    path: "/signup",
    component: SignUp,
  },
];
