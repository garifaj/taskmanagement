import { useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import { UserContextProviderProps, User } from "../types.tsx";
import axios from "axios";
import API_BASE_URL from "../../utils/config.tsx";

export function UserContextProvider({ children }: UserContextProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/user`, {
          withCredentials: true,
        });
        setUser(data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setReady(true);
      }
    };

    if (!user) {
      fetchUserData();
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser, ready }}>
      {children}
    </UserContext.Provider>
  );
}
