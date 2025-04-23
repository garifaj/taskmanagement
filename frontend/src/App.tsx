import { Route, Routes } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/login/LoginPage";
import RegisterPage from "./pages/register/RegisterPage";
import LandingPage from "./pages/landing/LandingPage";
import { UserContextProvider } from "./context/UserContextProvider";
import ForgotPasswordPage from "./pages/forgotpassword/ForgotPasswordPage";
import ResetPasswordPage from "./pages/forgotpassword/ResetPasswordPage";
import VerifyEmailPage from "./pages/verifyemail/VerifyEmailPage";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import DashboardMainPage from "./pages/dashboard/DashboardMainPage";
import { ProjectContextProvider } from "./context/ProjectContextProvider";

function App() {
  return (
    <UserContextProvider>
      <ProjectContextProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route
            path="/reset-password/:token"
            element={<ResetPasswordPage />}
          />
          <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route path="" element={<DashboardMainPage />} />
          </Route>
        </Routes>
      </ProjectContextProvider>
    </UserContextProvider>
  );
}

export default App;
