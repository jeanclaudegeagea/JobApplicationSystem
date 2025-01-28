import { publicRoutes, privateRoutes } from "./routes";
import SignIn from "./pages/SignIn";
import { Routes, Route, Navigate } from "react-router";
import { useAuth } from "./utils/AuthContext"; // Import the useAuth hook
import Navbar from "./components/shared/NavBar";
import { ToastContainer } from "react-toastify";
import SessionExpired from "./components/Modals/SessionExpired";

const App = () => {
  const { isAuth } = useAuth(); // Get the isAuth value from context

  return (
    <Routes>
      {privateRoutes.map(({ path, component: Component }) => (
        <Route
          key={path}
          path={path}
          element={
            isAuth ? (
              <div className="flex flex-col gap-6 bg-gray-50">
                <Navbar />
                <Component />
                <SessionExpired />
                <ToastContainer />
              </div>
            ) : (
              <Navigate to="/signin" replace />
            )
          }
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
