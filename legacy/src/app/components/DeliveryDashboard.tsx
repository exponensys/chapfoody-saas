// Composant déprécié - Utilisez /pages/DeliveryDashboard.tsx à la place
import { DeliveryDashboard as NewDeliveryDashboard } from "../pages/DeliveryDashboard";

interface UserSession {
  email: string;
  userType: string;
  isAuthenticated: boolean;
}

interface DeliveryDashboardProps {
  onBack: () => void;
  userSession: UserSession | null;
}

export function DeliveryDashboard(props: DeliveryDashboardProps) {
  return <NewDeliveryDashboard {...props} />;
}