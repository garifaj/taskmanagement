import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Slide, toast, ToastContainer } from "react-toastify";
import API_BASE_URL from "../../utils/config";
import TogglePasswordBtn from "../../components/TogglePasswordBtn";

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/reset-password`, {
        token, // Send the decoded token
        newPassword,
      });
      toast.success("Password reset successful", {
        onClose: () => navigate("/login"),
      });
      setError("");
    } catch (err: unknown) {
      if (err instanceof axios.AxiosError) {
        // Check if the error is an Axios error
        if (err.response) {
          // Server responded with a status other than 2xx
          setError(err.response.data?.message || "Password reset failed");
        } else if (err.request) {
          // Request was made but no response received
          setError("No response from the server");
        } else {
          // Something else happened
          setError("Error resetting password");
        }
      } else {
        setError("Error resetting password");
      }
    }
  };

  return (
    <div className="container mx-auto">
      <ToastContainer
        position="top-center"
        autoClose={800}
        hideProgressBar={false}
        pauseOnHover={false}
        theme="light"
        transition={Slide}
      />
      <div className="flex justify-center items-center min-h-screen">
        <div className="card p-8 mx-auto border-0 rounded-xl shadow-lg w-full max-w-md">
          <h3 className="text-center my-4 font-bold text-2xl">
            Reset Password
          </h3>
          {error && (
            <div className="text-red-500 mb-2 text-center">{error}</div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2 font-semibold">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your password"
                  minLength={6}
                  required
                />
                <TogglePasswordBtn
                  showPassword={showPassword}
                  togglePasswordVisibility={togglePasswordVisibility}
                />
              </div>
            </div>
            <div className="mb-4">
              <button
                type="submit"
                className="w-full shrink-0 rounded-md border border-blue-600 bg-blue-600 text-white py-2 rounded-md hover:bg-white-700 transition hover:cursor-pointer hover:bg-transparent hover:text-blue-600"
              >
                Reset Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
