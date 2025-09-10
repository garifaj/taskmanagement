import axios, { AxiosError } from "axios";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_BASE_URL from "../../utils/config";
import { LoginErrors } from "../../context/types";
import { UserContext } from "../../context/user/UserContext";
import TogglePasswordBtn from "../../components/TogglePasswordBtn";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<LoginErrors>({
    email: "",
    password: "",
  });
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const validationErrors: LoginErrors = {};

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!email) {
      validationErrors.email = "Email is required.";
    } else if (!emailRegex.test(email)) {
      validationErrors.email = "Invalid email format.";
    }

    // Validate password length
    if (!password) {
      validationErrors.password = "Password is required.";
    } else if (password.length < 6) {
      validationErrors.password = "Password must be at least 6 characters.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/login`,
        { email, password },
        { withCredentials: true }
      );
      setUser(data.user);
      setEmail("");
      setPassword("");
      setErrors({});
      navigate("/dashboard");
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response?.data?.message) {
        setErrors({
          email: "",
          password: error.response.data.message,
        });
      } else {
        console.error("Login error:", error);
      }
    } finally {
      setLoading(false); // Re-enable the button after the request finishes
    }
  };
  return (
    <section className="bg-white">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <aside className="relative block h-16 lg:order-last lg:col-span-5 lg:h-full xl:col-span-6">
          <img
            alt=""
            src="https://images.unsplash.com/photo-1605106702734-205df224ecce?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </aside>

        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6 xl:px-30">
          <div className="max-w-xl lg:max-w-3xl">
            <h1 className="mt-6 mb-5 text-center text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
              Sign in
            </h1>
            <a
              href={`${API_BASE_URL}/login-google`}
              className="flex items-center justify-center w-full py-4 mb-6 text-sm font-medium transition duration-300 rounded-2xl text-grey-900 bg-blue-50 hover:bg-blue-200 hover:cursor:pointer focus:ring-4 focus:ring-grey-300"
            >
              <img
                className="h-5 mr-2"
                src="https://raw.githubusercontent.com/Loopple/loopple-public-assets/main/motion-tailwind/img/logos/logo-google.png"
                alt=""
              />
              Sign in with Google
            </a>
            <span className="flex items-center">
              <span className="h-px flex-1 bg-gray-300"></span>

              <span className="shrink-0 px-4 text-gray-900">or</span>

              <span className="h-px flex-1 bg-gray-300"></span>
            </span>
            <form
              onSubmit={handleRegisterSubmit}
              className="mt-8 grid grid-cols-6 gap-6"
            >
              <div className="col-span-6">
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email)
                      setErrors((prev) => ({ ...prev, email: "" }));
                  }}
                  className={`mt-1 p-2 w-full rounded-md border ${
                    errors.email ? "border-red-500" : "border-gray-200"
                  }`}
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div className="col-span-6">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password)
                        setErrors((prev) => ({ ...prev, password: "" }));
                    }}
                    className={`mt-1 p-2 w-full rounded-md border ${
                      errors.password ? "border-red-500" : "border-gray-200"
                    }`}
                  />
                  <TogglePasswordBtn
                    showPassword={showPassword}
                    togglePasswordVisibility={togglePasswordVisibility}
                  />
                </div>

                {errors.password && (
                  <p className="text-red-600 text-sm mt-1">{errors.password}</p>
                )}
              </div>
              <div className="col-span-6 text-left">
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-700 font-medium"
                >
                  Forgot your password?
                </Link>
              </div>
              <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`inline-block shrink-0 rounded-md border px-12 py-3 text-sm font-medium transition ${
                    loading
                      ? "border-blue-200 bg-blue-200 text-white cursor-not-allowed"
                      : "border-blue-600 bg-blue-600 text-white hover:bg-transparent hover:text-blue-600"
                  }`}
                >
                  {loading ? "Signing in..." : "Sign in"}
                </button>
                <p className="mt-4 text-sm text-gray-500 sm:mt-0">
                  Already have an account?{" "}
                  <Link to="/register" className="text-blue-700 font-medium">
                    Register
                  </Link>
                  .
                </p>
              </div>
            </form>
          </div>
        </main>
      </div>
    </section>
  );
};

export default LoginPage;
