import ErrorPage from "./ErrorPage";

export default function UnauthorizedPage() {
  return (
    <ErrorPage
      code="401"
      title="Unauthorized"
      message="You don’t have permission to view this page."
      primaryLink="/login"
      primaryText="Login"
    />
  );
}
