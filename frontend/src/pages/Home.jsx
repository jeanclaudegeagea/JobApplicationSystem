import { useAuth } from "../utils/AuthContext";
import UserHome from "../components/Home/UserHome";
import CompanyHome from "../components/Home/CompanyHome";

const Home = () => {
  const {
    userData: { type, token, user, company },
    setIsSessionExpiredOpen,
  } = useAuth();

  return type === "User" ? (
    <UserHome
      token={token}
      user={user}
      setIsSessionExpiredOpen={setIsSessionExpiredOpen}
    />
  ) : (
    <CompanyHome
      token={token}
      company={company}
      setIsSessionExpiredOpen={setIsSessionExpiredOpen}
    />
  );
};

export default Home;
