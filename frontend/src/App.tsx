import { Route, Routes } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/login/LoginPage";
import RegisterPage from "./pages/register/RegisterPage";
import LandingPage from "./pages/landing/LandingPage";
import { UserContextProvider } from "./context/UserContextProvider";
import ForgotPasswordPage from "./pages/forgotpassword/ForgotPasswordPage";
import ResetPasswordPage from "./pages/forgotpassword/ResetPasswordPage";

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      </Routes>
    </UserContextProvider>
  );
}

export default App;
