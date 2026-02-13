import LandingPage from "../pages/Home/LandingPage"; 
import UserLayout from "../layout/userLayout/UserLayout"; 
import Login from "../pages/Auth/Login"; 
import Register from "../pages/Auth/Register"; 
import { Routes, Route } from "react-router-dom";
import UserSessionRoute from "../protecter/userProtecter/UserSessionRoute";
import OTPVerification from "../pages/Auth/OtpVerification";
import Dashboard from "../pages/Resume/Dashboard"; 
import ScanHistory from "../pages/Resume/ScanHistory"; 
import UserPrivateRoute from "../protecter/userProtecter/UserPrivateRoute";
import ScanDetail from "../pages/Resume/ScanDetail";

const UserRouter = () => {
  return (
    <Routes>
      <Route element={<UserLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/register"
          element={
            <UserSessionRoute>
              <Register />
            </UserSessionRoute>
          }
        />
        <Route
          path="/login"
          element={
            <UserSessionRoute>
              <Login />
            </UserSessionRoute>
          }
        />
        <Route path="/verify-otp" element={<OTPVerification />} />

        <Route element={<UserPrivateRoute/>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/history" element={<ScanHistory />} />
        <Route path="/history/:scanId" element={<ScanDetail/>}/>
        </Route>
      </Route>
    </Routes>
  );
};

export default UserRouter;