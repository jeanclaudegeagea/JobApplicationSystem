import axios from "axios";
import React, { createContext, useState, useContext, useEffect } from "react";
import { URL } from "./constants";
import { ClipLoader } from "react-spinners";

// Create context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// AuthProvider component to wrap the app and provide context values
export const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false); // Default to false (not authenticated)
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (storedData && storedData.token) {
      setIsAuth(true);
      setUserData(storedData);
      fetchProfile(storedData.token, storedData.type, storedData);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchProfile = async (token, type, storedData) => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      let profileResponse;
      if (type === "User") {
        profileResponse = await axios.get(
          `${URL}/users/profile/${storedData.user._id}`,
          {
            headers,
          }
        );

        localStorage.setItem(
          "userData",
          JSON.stringify({
            user: profileResponse.data.user,
            token,
            type,
          })
        );

        setUserData({
          user: profileResponse.data.user,
          token,
          type,
        });
      } else if (type === "Company") {
        profileResponse = await axios.get(
          `${URL}/companies/company/${storedData.company._id}`,
          {
            headers,
          }
        );

        localStorage.setItem(
          "userData",
          JSON.stringify({
            company: profileResponse.data.company,
            token,
            type,
          })
        );

        setUserData({
          company: profileResponse.data.company,
          token,
          type,
        });
      }
      setIsAuth(true);
    } catch (error) {
      console.error("Error fetcing profile:", error);
      setIsAuth(false);
      setUserData(null);
      localStorage.removeItem("userData");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to toggle authentication state
  const setAuth = (authStatus) => {
    setIsAuth(authStatus);
  };

  if (isLoading)
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gray-50">
        <ClipLoader size={30} color={"#4A5568"} />
      </div>
    );

  return (
    <AuthContext.Provider value={{ isAuth, setAuth, userData, setUserData }}>
      {children}
    </AuthContext.Provider>
  );
};
