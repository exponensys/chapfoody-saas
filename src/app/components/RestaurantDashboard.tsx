// Composant déprécié - Utilisez /pages/RestaurantDashboard.tsx à la place
import { RestaurantDashboard as NewRestaurantDashboard } from "../pages/RestaurantDashboard";

interface UserSession {
  email: string;
  userType: string;
  isAuthenticated: boolean;
}

interface RestaurantDashboardProps {
  onBack: () => void;
  userSession: UserSession | null;
}

export function RestaurantDashboard(props: RestaurantDashboardProps) {
  return <NewRestaurantDashboard {...props} />;
}