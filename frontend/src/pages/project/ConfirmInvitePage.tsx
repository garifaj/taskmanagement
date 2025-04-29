import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../../utils/config";

const ConfirmInvitePage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState(false);

  const email = searchParams.get("email");
  const projectId = searchParams.get("projectId");
  const inviteToken = searchParams.get("token");
  const role = searchParams.get("role");

  useEffect(() => {
    const checkUserExistsAndRedirect = async () => {
      try {
        if (!email || !inviteToken || !projectId) {
          setError(true);
          return;
        }

        const parsedProjectId = parseInt(projectId);
        if (isNaN(parsedProjectId)) {
          setError(true);
          return;
        }

        const res = await axios.get(
          `${API_BASE_URL}/users/exists?email=${encodeURIComponent(email)}`
        );
        const userExists = res.data.exists;

        if (userExists) {
          await axios.post(`${API_BASE_URL}/projectusers/confirm-invite`, {
            email,
            projectId: parsedProjectId,
            inviteToken,
          });

          navigate("/login?confirmed=true");
        } else {
          navigate(
            `/register?email=${encodeURIComponent(
              email
            )}&projectId=${parsedProjectId}&token=${inviteToken}&role=${role}`
          );
        }
      } catch (err) {
        console.error("Error confirming invitation:", err);
        setError(true);
      }
    };

    if (email && inviteToken) {
      checkUserExistsAndRedirect();
    } else {
      setError(true);
    }
  }, [email, inviteToken, projectId, role, navigate]);

  if (error) {
    return (
      <p style={{ color: "red" }}>
        Error processing the invitation. Please try again or contact support.
      </p>
    );
  }

  return <p>Processing invitation...</p>;
};

export default ConfirmInvitePage;
