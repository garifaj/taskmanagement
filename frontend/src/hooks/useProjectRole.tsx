// hooks/useProjectRole.ts
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../utils/config";
import { UserContext } from "../context/user/UserContext";

export function useProjectRole(projectId?: string) {
  const { user, ready } = useContext(UserContext);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      if (!projectId || !user || !ready) return;

      try {
        const res = await axios.get(`${API_BASE_URL}/projectusers/role`, {
          params: { projectId, userId: user.id },
          withCredentials: true,
        });
        setRole(res.data.role.toLowerCase());
      } catch (error) {
        console.error("Failed to fetch user role:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, [projectId, user, ready]);

  return { role, loading };
}
