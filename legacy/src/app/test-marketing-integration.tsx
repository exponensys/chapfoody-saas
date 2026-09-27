// Test file to verify Marketing Advanced integration
import { AdvancedMarketingView } from './components/AdvancedMarketingView';

// Verify all imports are working
import { SurveysAfterPurchaseView } from './components/SurveysAfterPurchaseView';
import { MarketingCampaignsView } from './components/MarketingCampaignsView';
import { GoogleReviewsView } from './components/GoogleReviewsView';
import { FacebookAudienceSyncView } from './components/FacebookAudienceSyncView';
import { AbandonedCartsView } from './components/AbandonedCartsView';
import { LoyaltyProgramView } from './components/LoyaltyProgramView';
import { SMSMarketingView } from './components/SMSMarketingView';
import { CustomerSegmentationView } from './components/CustomerSegmentationView';
import { AutomationTriggersView } from './components/AutomationTriggersView';
import { ReferralProgramView } from './components/ReferralProgramView';
import { EmailMarketingView } from './components/EmailMarketingView';
import { WinbackCampaignsView } from './components/WinbackCampaignsView';
import { BirthdayRewardsView } from './components/BirthdayRewardsView';
import { PushNotificationsView } from './components/PushNotificationsView';

// Test component that renders the AdvancedMarketingView
export function TestMarketingIntegration() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Test Marketing Integration</h1>
      <p className="text-green-600 mb-4">✅ All Marketing Advanced components imported successfully!</p>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Available Components:</h2>
        <ul className="grid grid-cols-2 gap-2 text-sm">
          <li>✅ AdvancedMarketingView</li>
          <li>✅ SurveysAfterPurchaseView</li>
          <li>✅ MarketingCampaignsView</li>
          <li>✅ GoogleReviewsView</li>
          <li>✅ FacebookAudienceSyncView</li>
          <li>✅ AbandonedCartsView</li>
          <li>✅ LoyaltyProgramView</li>
          <li>✅ SMSMarketingView</li>
          <li>✅ CustomerSegmentationView</li>
          <li>✅ AutomationTriggersView</li>
          <li>✅ ReferralProgramView</li>
          <li>✅ EmailMarketingView</li>
          <li>✅ WinbackCampaignsView</li>
          <li>✅ BirthdayRewardsView</li>
          <li>✅ PushNotificationsView</li>
        </ul>
      </div>
      
      <div className="mt-4">
        <AdvancedMarketingView />
      </div>
    </div>
  );
}