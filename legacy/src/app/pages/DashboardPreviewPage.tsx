import { DashboardPreview } from "../components/DashboardPreview";

interface DashboardPreviewPageProps {
  onBack: () => void;
}

export function DashboardPreviewPage({ onBack }: DashboardPreviewPageProps) {
  return <DashboardPreview onBack={onBack} />;
}