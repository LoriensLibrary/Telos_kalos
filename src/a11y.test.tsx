/**
 * Accessibility regression suite.
 *
 * Renders each public page and runs axe-core against the resulting DOM.
 * Fails the build on any serious or critical WCAG 2.1 AA violation.
 *
 * Coverage is intentionally page-level, not per-component — the goal is to
 * catch regressions in real composed UI (the shape a screen-reader user
 * actually encounters), not to test components in isolation.
 */
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';

import Overview from './pages/Overview';
import MemberApp from './pages/MemberApp';
import Performance from './pages/Performance';
import DataArch from './pages/DataArch';
import CamaProof from './pages/CamaProof';
import Platform from './pages/Platform';
import Layout from './components/Layout';

// Pages that don't use react-router internals can render bare.
// Pages that DO (Layout, anything with NavLink) need a router wrapper.
const renderWithRouter = (
  ui: React.ReactElement,
  initialPath = '/'
) =>
  render(<MemoryRouter initialEntries={[initialPath]}>{ui}</MemoryRouter>);

const PAGES: Array<[name: string, render: () => HTMLElement]> = [
  ['Overview', () => renderWithRouter(<Overview />).container],
  ['MemberApp', () => render(<MemberApp />).container],
  ['Performance', () => render(<Performance />).container],
  ['DataArch', () => render(<DataArch />).container],
  ['CamaProof', () => render(<CamaProof />).container],
  ['Platform', () => render(<Platform />).container],
];

describe('Accessibility · axe-core scan per page', () => {
  for (const [name, mount] of PAGES) {
    it(`${name} has no serious or critical violations`, async () => {
      const container = mount();
      const results = await axe(container, {
        rules: {
          // Allow color-contrast checks on top of the WCAG-AA baseline.
          'color-contrast': { enabled: true },
        },
      });
      expect(results).toHaveNoViolations();
    });
  }
});

describe('Accessibility · Layout chrome', () => {
  it('Layout (with nested route) has no violations', async () => {
    const { container } = renderWithRouter(<Layout />, '/');
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
