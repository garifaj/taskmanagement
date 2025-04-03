import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Slide, toast, ToastContainer } from "react-toastify";
import API_BASE_URL from "../../utils/config";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/forgot-password`, {
        email,
      });
      toast.success("Reset link sent to your email", {
        onClose: () => navigate("/login"),
      });
      setError("");
    } catch (err: unknown) {
      if (err instanceof axios.AxiosError) {
        // Check if the error is an Axios error
        if (err.response) {
          setError(err.response.data?.message || "Error sending reset email");
        } else if (err.request) {
          // Request was made but no response received
          setError("No response from the server");
        } else {
          // Something else happened
          setError("Error sending reset email");
        }
      } else {
        setError("Error sending reset email");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <ToastContainer
        position="top-center"
        autoClose={800}
        hideProgressBar={false}
        pauseOnHover={false}
        theme="light"
        transition={Slide}
      />
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6">
        <h3 className="text-center text-2xl font-bold text-gray-800 mb-4">
          Forgot Password?
        </h3>
        {error && <div className="text-red-500 text-center mb-2">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Email address
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-md focus:ring outline-none"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full shrink-0 rounded-md border border-blue-600 bg-blue-600 text-white py-2 rounded-md hover:bg-white-700 transition hover:cursor-pointer hover:bg-transparent hover:text-blue-600"
          >
            Send Reset Link
          </button>
        </form>
        <p className="text-center text-gray-600 mt-4">
          Remember your password?{" "}
          <Link to="/login" className="text-indigo-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
