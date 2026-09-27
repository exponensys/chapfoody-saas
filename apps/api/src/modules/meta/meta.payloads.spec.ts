import { BUSINESS_CATEGORIES } from '@chapfoody/types';

import { CURRENT_MILESTONE, SERVICE_NAME } from '../../app.constants.js';
import { buildMetaPayload } from './meta.payloads.js';

describe('buildMetaPayload', () => {
  it('publishes the ten dashboards straight from @chapfoody/types', () => {
    const payload = buildMetaPayload();

    expect(payload.service).toBe(SERVICE_NAME);
    expect(payload.milestone).toBe(CURRENT_MILESTONE);
    expect(payload.supportedCategories).toEqual(BUSINESS_CATEGORIES);
    expect(payload.supportedCategories).toHaveLength(10);
  });

  it('exposes the merged grocery/fruit dashboard (B.8) and the new shop dashboard (B.9)', () => {
    const { supportedCategories } = buildMetaPayload();

    expect(supportedCategories).toContain('epiceries-fruiteries');
    expect(supportedCategories).toContain('boutiques-supermarche');
  });

  it('never exposes the pre-merge categories, which would split the dashboard again', () => {
    const { supportedCategories } = buildMetaPayload() as { supportedCategories: readonly string[] };

    expect(supportedCategories).not.toContain('epiceries');
    expect(supportedCategories).not.toContain('fruiteries');
  });
});
