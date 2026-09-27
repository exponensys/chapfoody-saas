// Composant déprécié - Utilisez /pages/HomePage.tsx à la place
import { HomePage as NewHomePage } from "../pages/HomePage";

interface HomePageProps {
  onUserTypeSelect: (userType: string) => void;
  onBack: () => void;
}

export function HomePage(props: HomePageProps) {
  return <NewHomePage {...props} />;
}

