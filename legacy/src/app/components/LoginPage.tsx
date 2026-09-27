// Composant déprécié - Utilisez /pages/LoginPage.tsx à la place
import { LoginPage as NewLoginPage } from "../pages/LoginPage";

interface LoginPageProps {
  userType: string;
  onLogin: (credentials: { email: string; password: string }) => void;
  onBack: () => void;
}

export function LoginPage(props: LoginPageProps) {
  return <NewLoginPage {...props} />;
}