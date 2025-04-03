import { useContext } from "react";
import { UserContext } from "../../context/UserContext";

const LandingPage = () => {
  const { user } = useContext(UserContext);
  return (
    <>
      <h1>Hello {user?.name}</h1>
    </>
  );
};

export default LandingPage;
