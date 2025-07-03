import { Route, Routes } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/login/LoginPage";
import RegisterPage from "./pages/register/RegisterPage";
import LandingPage from "./pages/landing/LandingPage";
import { UserContextProvider } from "./context/user/UserContextProvider";
import ForgotPasswordPage from "./pages/forgotpassword/ForgotPasswordPage";
import ResetPasswordPage from "./pages/forgotpassword/ResetPasswordPage";
import VerifyEmailPage from "./pages/verifyemail/VerifyEmailPage";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import DashboardMainPage from "./pages/dashboard/DashboardMainPage";
import { ProjectContextProvider } from "./context/project/ProjectContextProvider";
import ProjectMainPage from "./pages/project/ProjectMainPage";
import ConfirmInvitePage from "./pages/project/ConfirmInvitePage";
import { BoardProvider } from "./context/board/BoardContextProvider";
import NotFoundPage from "./pages/error/NotFoundPage";
import UnauthorizedPage from "./pages/error/UnauthorizedPage";
import ProtectedRoute from "./pages/error/ProtectedRoute";

function App() {
  return (
    <UserContextProvider>
      <ProjectContextProvider>
        <BoardProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route
              path="/reset-password/:token"
              element={<ResetPasswordPage />}
            />
            <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
            <Route path="/confirm-invite" element={<ConfirmInvitePage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard/"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardMainPage />} />
              <Route path="projects/:projectId" element={<ProjectMainPage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BoardProvider>
      </ProjectContextProvider>
    </UserContextProvider>
  );
}

export default App;
