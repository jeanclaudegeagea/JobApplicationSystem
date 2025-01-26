import { publicRoutes, privateRoutes } from "./routes";
import SignIn from "./pages/SignIn";
import { Routes, Route, Navigate } from "react-router";
import { useAuth } from "./utils/AuthContext"; // Import the useAuth hook

const App = () => {
  const { isAuth } = useAuth(); // Get the isAuth value from context

  return (
    <Routes>
      {privateRoutes.map(({ path, component: Component }) => (
        <Route
          key={path}
          path={path}
          element={isAuth ? <Component /> : <Navigate to="/signin" replace />}
        />
      ))}

      {publicRoutes.map(({ path, component: Component }) => (
        <Route
          key={path}
          path={path}
          element={!isAuth ? <Component /> : <Navigate to="/" replace />}
        />
      ))}

      <Route
        path="/signin"
        element={!isAuth ? <SignIn /> : <Navigate to="/home" replace />}
      />
    </Routes>
  );
};

export default App;
