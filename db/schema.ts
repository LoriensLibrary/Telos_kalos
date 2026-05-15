/**
 * Drizzle schema for Telos · for Kalos.
 *
 * Three tables back the live demo today:
 *   - members        — analyst's roster (replaces src/data/clients.ts)
 *   - dexa_scans     — body-comp trajectory per member
 *   - message_drafts — AI Inbox queue (static seeds + live Claude drafts)
 *
 * All tables are seeded from the existing static data so the demo is
 * deterministic. The live-draft endpoint inserts new rows on each
 * Generate Live Draft click; analyst approve/edit/decline updates state
 * + audit fields.
 */

import { pgTable, text, integer, real, jsonb, timestamp } from 'drizzle-orm/pg-core';

export const members = pgTable('members', {
  id: text('id').primaryKey(),                               // 'maya', 'daniel', ...
  name: text('name').notNull(),
  init: text('init').notNull(),
  status: text('status').notNull(),                          // 'on-track' | 'plateau' | 'flagged' | 'new'
  goals: jsonb('goals').$type<string[]>().notNull(),
  analyst: text('analyst').notNull(),
  triangle: jsonb('triangle').$type<[number, number, number]>().notNull(),
  triangleProj: jsonb('triangle_proj').$type<[number, number, number]>().notNull(),
  // Latest metric snapshot
  metFat: text('met_fat').notNull(),
  metFatD: text('met_fat_d').notNull(),
  metLean: text('met_lean').notNull(),
  metLeanD: text('met_lean_d').notNull(),
  metVisc: text('met_visc').notNull(),
  metViscD: text('met_visc_d').notNull(),
  // Wearable snapshot
  wearHrv: text('wear_hrv').notNull(),
  wearSleep: text('wear_sleep').notNull(),
  wearRecov: text('wear_recov').notNull(),
  wearGlu: text('wear_glu').notNull(),
  // 6-week adherence series
  adherence: jsonb('adherence').$type<{ label: string; val: number; color: string }[]>().notNull(),
  // Next milestone + AI suggestion
  nextLabel: text('next_label').notNull(),
  sugChange: text('sug_change').notNull(),
  sugReason: text('sug_reason').notNull(),
  sugConf: text('sug_conf').notNull(),                       // 'high' | 'med' | 'low'
  flag: text('flag'),                                        // nullable
  // Pre-session brief
  briefWhen: text('brief_when').notNull(),
  briefRows: jsonb('brief_rows').$type<string[]>().notNull(),
  briefPts: jsonb('brief_pts').$type<string[]>().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const dexaScans = pgTable('dexa_scans', {
  id: text('id').primaryKey(),                               // 'maya-s1', 'maya-s2', ...
  memberId: text('member_id')
    .notNull()
    .references(() => members.id, { onDelete: 'cascade' }),
  scanNumber: integer('scan_number').notNull(),              // 1..6
  label: text('label').notNull(),                            // 'S1' .. 'S6'
  fat: real('fat').notNull(),                                // body-fat %
  lean: real('lean').notNull(),                              // lean mass lb
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const messageDrafts = pgTable('message_drafts', {
  id: text('id').primaryKey(),                               // 'd1' static seeds, 'd-live-{ts}' live
  memberId: text('member_id'),                               // nullable for live drafts (not in roster)
  memberName: text('member_name').notNull(),
  init: text('init').notNull(),
  draftedAt: text('drafted_at').notNull(),                   // 'HH:MM'
  trigger: text('trigger').notNull(),
  body: text('body').notNull(),
  conf: text('conf').notNull(),                              // 'high' | 'med' | 'low'
  source: text('source').notNull(),
  state: text('state').notNull().default('pending'),         // 'pending' | 'approved' | 'edited' | 'declined'
  isLive: integer('is_live').notNull().default(0),           // 0=static seed, 1=Claude-generated
  // Live-draft transparency fields
  model: text('model'),
  inputTokens: integer('input_tokens'),
  outputTokens: integer('output_tokens'),
  // Audit trail
  editedBody: text('edited_body'),                           // analyst's edit when state='edited'
  decisionAt: timestamp('decision_at'),                      // when approve/edit/decline happened
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Member = typeof members.$inferSelect;
export type NewMember = typeof members.$inferInsert;
export type DexaScanRow = typeof dexaScans.$inferSelect;
export type NewDexaScan = typeof dexaScans.$inferInsert;
export type MessageDraftRow = typeof messageDrafts.$inferSelect;
export type NewMessageDraft = typeof messageDrafts.$inferInsert;
