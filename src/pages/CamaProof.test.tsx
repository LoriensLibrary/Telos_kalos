import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import CamaProof from './CamaProof';
import { coachInsight, memoryRecords, patterns } from '../data/cama';

/**
 * CAMA Proof Layer — the contract we promise reviewers:
 *
 *   Insight → Patterns → MemoryRecords
 *
 * Each layer must reference the next layer down by id, with no
 * dangling pointers. The provenance chain must be auditable.
 */
describe('CAMA Proof Layer', () => {
  describe('provenance integrity (data layer)', () => {
    it('every pattern derives from real MemoryRecord ids', () => {
      const memoryIds = new Set(memoryRecords.map((m) => m.id));
      for (const p of patterns) {
        for (const memId of p.derivedFrom) {
          expect(memoryIds.has(memId)).toBe(true);
        }
      }
    });

    it('coachInsight references only real Pattern ids', () => {
      const patternIds = new Set(patterns.map((p) => p.id));
      for (const pid of coachInsight.patternIds) {
        expect(patternIds.has(pid)).toBe(true);
      }
    });

    it('every memory has non-empty content, source, and provenance', () => {
      for (const m of memoryRecords) {
        expect(m.content.length).toBeGreaterThan(0);
        expect(m.source.length).toBeGreaterThan(0);
        expect(m.provenance.length).toBeGreaterThan(0);
        expect(m.confidence).toBeGreaterThanOrEqual(0);
        expect(m.confidence).toBeLessThanOrEqual(1);
      }
    });
  });

  describe('rendering', () => {
    it('renders the coach insight headline and synthetic-data disclaimer', () => {
      render(<CamaProof />);
      expect(screen.getByText(/SYNTHETIC DATA/i)).toBeInTheDocument();
      expect(screen.getByText(coachInsight.headline)).toBeInTheDocument();
      expect(screen.getByText(/No Kalos data used/i)).toBeInTheDocument();
    });

    it('renders all patterns and all memory records', () => {
      render(<CamaProof />);
      for (const p of patterns) {
        expect(screen.getByTestId(`pattern-${p.id}`)).toBeInTheDocument();
      }
      for (const m of memoryRecords) {
        expect(screen.getByTestId(`memory-${m.id}`)).toBeInTheDocument();
      }
    });
  });

  describe('provenance interaction (UI)', () => {
    it('clicking a pattern highlights exactly the memories it derives from', () => {
      render(<CamaProof />);
      const stressPattern = patterns.find((p) => p.id === 'pat-stress');
      expect(stressPattern).toBeDefined();
      if (!stressPattern) return;

      fireEvent.click(screen.getByTestId('pat-stress'.startsWith('pat-') ? 'pattern-pat-stress' : ''));

      // every memory in derivedFrom should be highlighted
      for (const memId of stressPattern.derivedFrom) {
        const card = screen.getByTestId(`memory-${memId}`);
        expect(card.getAttribute('data-highlighted')).toBe('true');
      }

      // a memory NOT in derivedFrom should not be highlighted
      const otherMem = memoryRecords.find((m) => !stressPattern.derivedFrom.includes(m.id));
      expect(otherMem).toBeDefined();
      if (otherMem) {
        const card = screen.getByTestId(`memory-${otherMem.id}`);
        expect(card.getAttribute('data-highlighted')).toBe('false');
      }
    });

    it('clicking the same pattern twice clears the highlight', () => {
      render(<CamaProof />);
      const btn = screen.getByTestId('pattern-pat-tone');
      fireEvent.click(btn);
      fireEvent.click(btn);

      for (const m of memoryRecords) {
        const card = screen.getByTestId(`memory-${m.id}`);
        expect(card.getAttribute('data-highlighted')).toBe('false');
      }
    });

    it('insight panel surfaces clickable provenance chips for every pattern it cites', () => {
      render(<CamaProof />);
      const insightPanel = screen.getByTestId('coach-insight');
      for (const pid of coachInsight.patternIds) {
        expect(within(insightPanel).getByRole('button', { name: pid })).toBeInTheDocument();
      }
    });
  });
});
