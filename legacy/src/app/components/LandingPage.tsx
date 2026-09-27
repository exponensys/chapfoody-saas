// Composant déprécié - Utilisez /pages/LandingPage.tsx à la place
import { LandingPage as NewLandingPage } from "../pages/LandingPage";

interface LandingPageProps {
  onLogin: () => void;
}

export function LandingPage(props: LandingPageProps) {
  return <NewLandingPage {...props} />;
}