// Composant déprécié - Utilisez /pages/AffiliateDashboard.tsx à la place
import { AffiliateDashboard as NewAffiliateDashboard } from "../pages/AffiliateDashboard";

interface UserSession {
  email: string;
  userType: string;
  isAuthenticated: boolean;
}

interface AffiliateDashboardProps {
  onBack: () => void;
  userSession: UserSession | null;
}

export function AffiliateDashboard(props: AffiliateDashboardProps) {
  return <NewAffiliateDashboard {...props} />;
}