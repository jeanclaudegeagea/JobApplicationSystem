import React, { createContext, useState, useContext } from "react";

// Create context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// AuthProvider component to wrap the app and provide context values
export const AuthProvider = ({ children }) => {
  const userData = JSON.parse(localStorage.getItem("userData"));

  const [isAuth, setIsAuth] = useState(!!userData); // Default to false (not authenticated)

  // Function to toggle authentication state
  const setAuth = (authStatus) => {
    setIsAuth(authStatus);
  };

  return (
    <AuthContext.Provider value={{ isAuth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
