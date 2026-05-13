import { describe, it, expect } from 'vitest';
import {
  getMember,
  listMembers,
  listScansForMember,
  listPendingDrafts,
  approveDraft,
  declineDraft,
  matchAnalyst,
  listConnectedApps,
  getDaySchedule,
} from './telosApi';

describe('Telos API · members', () => {
  it('listMembers returns the cohort', async () => {
    const members = await listMembers();
    expect(members.length).toBeGreaterThan(0);
    expect(members[0]).toHaveProperty('id');
    expect(members[0]).toHaveProperty('name');
    expect(members[0]).toHaveProperty('status');
  });

  it('getMember returns Maya by id and rejects unknown ids', async () => {
    const maya = await getMember('maya');
    expect(maya.name).toBe('Maya Reyes');
    expect(maya.status).toBe('flagged');
    await expect(getMember('does-not-exist')).rejects.toThrow();
  });
});

describe('Telos API · DEXA scans', () => {
  it('listScansForMember returns chronologically increasing scan numbers', async () => {
    const scans = await listScansForMember('maya');
    expect(scans.length).toBeGreaterThanOrEqual(6);
    for (let i = 1; i < scans.length; i++) {
      expect(scans[i].scanNumber).toBeGreaterThan(scans[i - 1].scanNumber);
    }
  });

  it("visceral fat decreases across Maya's scan history (improvement trajectory)", async () => {
    const scans = await listScansForMember('maya');
    expect(scans[scans.length - 1].visceralFatLb).toBeLessThan(scans[0].visceralFatLb);
  });

  it('segment values are numbers, not formatted strings', async () => {
    const scans = await listScansForMember('maya');
    const s = scans[0];
    expect(typeof s.segments.trunk).toBe('number');
    expect(typeof s.segments.leftLeg).toBe('number');
    expect(s.symmetryPct).toBeGreaterThan(0);
  });
});

describe('Telos API · AI Inbox state machine', () => {
  it('listPendingDrafts returns all drafts in pending state', async () => {
    const drafts = await listPendingDrafts();
    expect(drafts.length).toBeGreaterThan(0);
    drafts.forEach((d) => {
      expect(d.state).toBe('pending');
    });
  });

  it('approveDraft transitions a draft to approved (or edited)', async () => {
    const drafts = await listPendingDrafts();
    const approved = await approveDraft(drafts[0].id, false);
    expect(approved.state).toBe('approved');

    const edited = await approveDraft(drafts[0].id, true);
    expect(edited.state).toBe('edited');
  });

  it('declineDraft transitions a draft to declined', async () => {
    const drafts = await listPendingDrafts();
    const declined = await declineDraft(drafts[0].id);
    expect(declined.state).toBe('declined');
  });

  it('approving an unknown draft throws (no silent failures)', async () => {
    await expect(approveDraft('definitely-not-a-real-id', false)).rejects.toThrow();
  });
});

describe('Telos API · analyst matching', () => {
  it('matchAnalyst returns higher-scoring analyst for matching tags', async () => {
    const endurance = await matchAnalyst(['endurance', 'sport', 'advanced']);
    expect(endurance).toBeDefined();
    expect(endurance.name).toMatch(/Parker|Feinberg/); // Callum or Noah are endurance/sport-tagged

    const behavior = await matchAnalyst(['holistic', 'longevity', 'beginner']);
    expect(behavior).toBeDefined();
    expect(behavior.name).toMatch(/Shakespeare|Ascherio/); // Max or Matteo are behavior/longevity
  });
});

describe('Telos API · integrations', () => {
  it('listConnectedApps separates live integrations from roadmap', async () => {
    const apps = await listConnectedApps();
    const live = apps.filter((a) => a.status === 'live');
    const roadmap = apps.filter((a) => a.status === 'available');

    // Honesty check: only Kalos's actual current capabilities are 'live'
    expect(live.length).toBeGreaterThan(0);
    expect(roadmap.length).toBeGreaterThan(0);
    live.forEach((a) => {
      expect(a.name.toLowerCase()).toMatch(/kalos|weight|food/);
    });
  });
});

describe("Telos API · today's schedule", () => {
  it("getDaySchedule contains a 'now' session and respects ordering", async () => {
    const sched = await getDaySchedule();
    expect(sched.length).toBeGreaterThan(0);
    const nowSession = sched.find((s) => s.status === 'now');
    expect(nowSession).toBeDefined();
    // morning sessions come before afternoon sessions
    const times = sched.filter((s) => s.status !== 'block').map((s) => s.startTime);
    const sorted = [...times].sort();
    expect(times).toEqual(sorted);
  });
});
