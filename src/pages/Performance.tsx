import { useState } from 'react';
import { CLIENTS } from '../data/clients';
import { DAY_BRIEF } from '../data/day';
import Tabs from '../components/ui/Tabs';
import Feedback from '../components/ui/Feedback';
import AnalystPerformance from '../components/ui/AnalystPerformance';
import DayView from './performance/DayView';
import InboxView from './performance/InboxView';
import CaseloadView from './performance/CaseloadView';
import StandardsView from './performance/StandardsView';
import MemberDetail from './performance/MemberDetail';
import { TABS } from './performance/shared';

export default function Performance() {
  const [tab, setTab] = useState('day');
  const [sel, setSel] = useState<string | null>(null);
  const c = sel ? CLIENTS.find((x) => x.id === sel) : null;

  if (c) return <MemberDetail client={c} onBack={() => setSel(null)} />;

  return (
    <div className="max-w-[1500px] mx-auto px-8 py-14">
      {/* HEAD */}
      <div className="mb-8 flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="lbl mb-4" style={{ color: 'var(--ac-b)' }}>
            PERFORMANCE STUDIO · ANALYST 2 · METABOLIC HEALTH
          </div>
          <h1
            className="brk"
            style={{
              fontSize: 'clamp(2.6rem,5vw,3.8rem)',
              lineHeight: 0.98,
              letterSpacing: '-0.03em',
              fontWeight: 300,
              padding: '8px 0',
            }}
          >
            {DAY_BRIEF.greet.split(',')[0]},{' '}
            <em className="serif italic holo" style={{ fontWeight: 400 }}>
              {DAY_BRIEF.greet.split(', ')[1]?.replace('.', '')}
            </em>
            .
          </h1>
          <p className="mt-3 text-base max-w-2xl" style={{ color: 'var(--ink-s)' }}>
            {DAY_BRIEF.sessions} sessions today · {DAY_BRIEF.drafted} drafted messages to review ·{' '}
            {DAY_BRIEF.flagged} flagged member. Day plan is ready when you are.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="chip chip-cy">
            <span className="dot dot-cy pulse" /> {DAY_BRIEF.weather}
          </span>
          <span className="chip chip-pur">{DAY_BRIEF.cohort}</span>
        </div>
      </div>

      <div className="mb-8">
        <Tabs tabs={TABS} active={tab} onChange={setTab} />
      </div>

      {tab === 'day' && <DayView />}
      {tab === 'inbox' && <InboxView />}
      {tab === 'caseload' && <CaseloadView onOpen={setSel} />}
      {tab === 'me' && <AnalystPerformance />}
      {tab === 'standards' && <StandardsView />}
      {tab === 'feedback' && <Feedback audience="analyst" />}
    </div>
  );
}
