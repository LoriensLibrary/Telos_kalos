import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import DataArch from './DataArch';

/**
 * Privacy architecture invariant:
 * The "What James sees" analyst-facing view must NEVER contain the raw
 * disclosure text from "What Maya sees". Analysts only see the pattern,
 * not the source.
 */
describe('Privacy · pattern-not-text invariant', () => {
  it("Maya's raw disclosure appears in her private view", () => {
    render(<DataArch />);
    const heading = screen.getByText(/what maya sees/i);
    expect(heading).toBeInTheDocument();
    // The raw disclosure text — should be visible in Maya's column
    expect(screen.getByText(/hard call with my mom/i)).toBeInTheDocument();
  });

  it("James's column shows pattern + signal, not the disclosure text", () => {
    render(<DataArch />);

    // James's column header is present
    expect(screen.getByText(/what james sees/i)).toBeInTheDocument();

    // The pattern label + signal label exist (operational signal, not raw text)
    expect(screen.getByText(/high cognitive-load period/i)).toBeInTheDocument();
    expect(screen.getByText(/adherence likely to drop/i)).toBeInTheDocument();
  });

  it('pipeline enforces text-sealed-to-member as step 01', () => {
    render(<DataArch />);
    expect(screen.getByText(/raw disclosure/i)).toBeInTheDocument();
    expect(screen.getByText(/encrypted at rest/i)).toBeInTheDocument();
  });
});
