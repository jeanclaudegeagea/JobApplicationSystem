import axios from "axios";
import React, { createContext, useState, useContext, useEffect } from "react";
import { URL } from "./constants";

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

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (storedData && storedData.token) {
      setIsAuth(true);
      setUserData(storedData);
      fetchProfile(storedData.token, storedData.type);
    }
  }, []);

  const fetchProfile = async (token, type) => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      let profileResponse;
      if (type === "User") {
        profileResponse = await axios.get(`${URL}/users/profile`, {
          headers,
        });
      } else if (type === "Company") {
        profileResponse = await axios.get(`${URL}/companies/company`, {
          headers,
        });
      }
      localStorage.setItem(
        "userData",
        JSON.stringify({ ...profileResponse.data, token, type })
      );
    } catch (error) {
      console.error("Error fetcing profile:", error);
      setIsAuth(false);
      setUserData(null);
      localStorage.removeItem("userData");
    }
  };

  // Function to toggle authentication state
  const setAuth = (authStatus) => {
    setIsAuth(authStatus);
  };

  return (
    <AuthContext.Provider value={{ isAuth, setAuth, userData, setUserData }}>
      {children}
    </AuthContext.Provider>
  );
};
