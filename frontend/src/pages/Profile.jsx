import CompanyProfile from "./CompanyProfile";
import UserProfile from "./UserProfile";

const Profile = () => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const role = userData.type;

  return <div>{role === "User" ? <UserProfile /> : <CompanyProfile />}</div>;
};

export default Profile;
