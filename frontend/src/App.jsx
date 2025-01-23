import { publicRoutes, privateRoutes } from "./routes";
import SignIn from "./pages/SignIn";
import { Routes, Route, Navigate } from "react-router";

const App = () => {
  const isAuth = false;

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
        element={!isAuth ? <SignIn /> : <Navigate to="/" replace />}
      />
    </Routes>
  );
};

export default App;
