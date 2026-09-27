import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { BUSINESS_CATEGORIES, dashboardPathFor } from '@chapfoody/types';

import HomePage from './page';

/**
 * Proves the frontend test runner is wired end to end: JSX transform, jsdom
 * environment, jest-dom matchers, and resolution of the workspace packages
 * (@chapfoody/types and @chapfoody/ui) from inside a component.
 */
describe('M0 placeholder home page', () => {
  it('renders the milestone banner and the product name', () => {
    render(<HomePage />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Chapfoody');
    expect(screen.getByText(/jalon M0/i)).toBeInTheDocument();
  });

  it('lists every dashboard with its route, straight from @chapfoody/types', () => {
    render(<HomePage />);

    const items = screen.getAllByRole('listitem');

    expect(items).toHaveLength(BUSINESS_CATEGORIES.length);

    for (const category of BUSINESS_CATEGORIES) {
      expect(screen.getByText(category)).toBeInTheDocument();
      expect(screen.getByText(dashboardPathFor(category))).toBeInTheDocument();
    }
  });

  it('shows the ten dashboards, including the merged and the new one', () => {
    render(<HomePage />);

    expect(screen.getByText('epiceries-fruiteries')).toBeInTheDocument();
    expect(screen.getByText('boutiques-supermarche')).toBeInTheDocument();
    expect(screen.getByText('/dashboard/boutiques-supermarche')).toBeInTheDocument();
  });
});
