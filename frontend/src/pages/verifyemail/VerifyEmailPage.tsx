import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API_BASE_URL from "../../utils/config";

const VerifyEmailPage = () => {
  const { token } = useParams();
  const [status, setStatus] = useState<string>("loading");
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      axios
        .post(`${API_BASE_URL}/verify-email`, { token })
        .then(() => {
          setStatus("success");
          setTimeout(() => {
            navigate("/login"); // Redirect to login after 3 seconds
          }, 3500);
        })
        .catch(() => {
          setStatus("error");
        });
    } else {
      setStatus("error");
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center px-6">
        {status === "loading" && (
          <p className="text-3xl font-semibold text-gray-600">
            Verifying your account...
          </p>
        )}
        {status === "success" && (
          <p className="text-3xl font-semibold text-green-600">
            Email verified!
            <br/> Redirecting to login...
          </p>
        )}
        {status === "error" && (
          <p className="text-3xl font-semibold text-red-600">
            Verification failed. The link may be invalid or expired.
          </p>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
