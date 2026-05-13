import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ThemeToggle from './ThemeToggle';

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('defaults to Kalos theme on first mount', () => {
    render(<ThemeToggle />);
    expect(document.documentElement.getAttribute('data-theme')).toBe('kalos');
    expect(localStorage.getItem('telos.theme')).toBe('kalos');
  });

  it('migrates the legacy companion.theme key to telos.theme', () => {
    localStorage.setItem('companion.theme', 'cyber');
    render(<ThemeToggle />);
    expect(document.documentElement.getAttribute('data-theme')).toBe('cyber');
    expect(localStorage.getItem('telos.theme')).toBe('cyber');
    expect(localStorage.getItem('companion.theme')).toBeNull();
  });

  it("migrates the deprecated 'verdant' value to kalos", () => {
    localStorage.setItem('companion.theme', 'verdant');
    render(<ThemeToggle />);
    expect(document.documentElement.getAttribute('data-theme')).toBe('kalos');
  });

  it('opens the dropdown and lets the user pick a different theme', async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);

    const trigger = screen.getByRole('button', { name: /kalos/i });
    await user.click(trigger);

    const galaxy = screen.getByRole('option', { name: /galaxy/i });
    await user.click(galaxy);

    expect(document.documentElement.getAttribute('data-theme')).toBe('galaxy');
    expect(localStorage.getItem('telos.theme')).toBe('galaxy');
  });
});
