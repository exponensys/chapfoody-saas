import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// React Testing Library's automatic cleanup relies on a global `afterEach`, which
// Vitest does not expose unless `globals: true`. Registering it explicitly keeps
// `globals` off and the test files explicit about their imports.
afterEach(() => {
  cleanup();
});
