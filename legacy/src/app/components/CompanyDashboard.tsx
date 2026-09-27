// Composant déprécié - Utilisez /pages/CompanyDashboard.tsx à la place
import { CompanyDashboard as NewCompanyDashboard } from "../pages/CompanyDashboard";

interface UserSession {
  email: string;
  userType: string;
  isAuthenticated: boolean;
}

interface CompanyDashboardProps {
  onBack: () => void;
  userSession: UserSession | null;
}

export function CompanyDashboard(props: CompanyDashboardProps) {
  return <NewCompanyDashboard {...props} />;
}