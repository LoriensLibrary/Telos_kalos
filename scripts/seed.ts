/**
 * Seed script — populates Neon Postgres from the existing static data files.
 *
 * Run locally with:
 *   npx tsx scripts/seed.ts
 *
 * Idempotent: clears the three tables first, then re-inserts the canonical
 * 9-member roster + 6-scan-per-member DEXA history + 3 static AI Inbox
 * drafts. Re-running returns the DB to a known-good demo state.
 *
 * The frontend continues to render exactly the same content; the data
 * source moves from src/data/clients.ts + src/data/chat.ts → Postgres.
 */

import 'dotenv/config';
import { db } from '../db/client';
import { dexaScans, members, messageDrafts } from '../db/schema';
import { CLIENTS } from '../src/data/clients';
import { DRAFTS } from '../src/data/chat';

async function main() {
  console.log('🗑️  Clearing existing rows…');
  // Order matters because of FK from dexa_scans → members
  await db.delete(messageDrafts);
  await db.delete(dexaScans);
  await db.delete(members);

  console.log(`👥  Inserting ${CLIENTS.length} members…`);
  for (const c of CLIENTS) {
    await db.insert(members).values({
      id: c.id,
      name: c.name,
      init: c.init,
      status: c.status,
      goals: c.goals,
      analyst: c.analyst,
      triangle: c.triangle,
      triangleProj: c.triProj,
      metFat: c.met.fat,
      metFatD: c.met.fatD,
      metLean: c.met.lean,
      metLeanD: c.met.leanD,
      metVisc: c.met.visc,
      metViscD: c.met.viscD,
      wearHrv: c.wear.hrv,
      wearSleep: c.wear.sleep,
      wearRecov: c.wear.recov,
      wearGlu: c.wear.glu,
      adherence: c.adh,
      nextLabel: c.next,
      sugChange: c.sug.change,
      sugReason: c.sug.reason,
      sugConf: c.sug.conf,
      flag: c.flag,
      briefWhen: c.brief.when,
      briefRows: c.brief.rows,
      briefPts: c.brief.pts,
    });

    // Insert each member's 6 DEXA scans
    for (let i = 0; i < c.scans.length; i++) {
      const s = c.scans[i];
      await db.insert(dexaScans).values({
        id: `${c.id}-s${i + 1}`,
        memberId: c.id,
        scanNumber: i + 1,
        label: s.label,
        fat: s.fat,
        lean: s.lean,
      });
    }
    console.log(`   ✓ ${c.name} (${c.scans.length} scans)`);
  }

  console.log(`💬  Inserting ${DRAFTS.length} static AI Inbox drafts…`);
  for (const d of DRAFTS) {
    // Resolve memberId from the static draft's "member" name where possible.
    // Static seeds use display names; we match via a tiny map for the 3 demo drafts.
    const memberIdMap: Record<string, string> = {
      'Maya Reyes': 'maya',
      'Daniel K.': 'daniel',
      'Priya S.': 'priya',
    };
    await db.insert(messageDrafts).values({
      id: d.id,
      memberId: memberIdMap[d.member] ?? null,
      memberName: d.member,
      init: d.init,
      draftedAt: d.draftedAt,
      trigger: d.trigger,
      body: d.body,
      conf: d.conf,
      source: d.source,
      state: 'pending',
      isLive: 0,
    });
    console.log(`   ✓ ${d.id} → ${d.member}`);
  }

  // Sanity-check counts
  const memberCount = (await db.select().from(members)).length;
  const scanCount = (await db.select().from(dexaScans)).length;
  const draftCount = (await db.select().from(messageDrafts)).length;

  console.log('');
  console.log('✅ Seed complete.');
  console.log(`   members:        ${memberCount}`);
  console.log(`   dexa_scans:     ${scanCount}`);
  console.log(`   message_drafts: ${draftCount}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  });
