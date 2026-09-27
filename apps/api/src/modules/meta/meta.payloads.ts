import { BUSINESS_CATEGORIES, type BusinessCategory } from '@chapfoody/types';

import { CURRENT_MILESTONE, SERVICE_NAME } from '../../app.constants.js';

/**
 * `/v1/meta` publishes the platform vocabulary the frontends must not redefine.
 *
 * The category list comes from `@chapfoody/types`, which is the single source of
 * truth for the ten dashboards (requirements B.5, B.8, B.9). Serving it means the
 * onboarding wizard, the super-admin plan builder and the dashboards can all
 * trust one authoritative answer instead of shipping their own copy.
 */
export interface MetaResponseBody {
  service: string;
  milestone: string;
  supportedCategories: readonly BusinessCategory[];
}

export function buildMetaPayload(): MetaResponseBody {
  return {
    service: SERVICE_NAME,
    milestone: CURRENT_MILESTONE,
    supportedCategories: BUSINESS_CATEGORIES,
  };
}
