import { useState } from 'react';
import Tabs from '../components/ui/Tabs';
import Feedback from '../components/ui/Feedback';
import Schedule from '../components/ui/Schedule';
import Apps from '../components/ui/Apps';
import DEXAReport from '../components/ui/DEXAReport';
import Onboarding from '../components/ui/Onboarding';
import AnalystMatch from '../components/ui/AnalystMatch';
import TodayTab from './member/TodayTab';
import BodyTab from './member/BodyTab';
import NutritionTab from './member/NutritionTab';
import MovementTab from './member/MovementTab';
import SleepTab from './member/SleepTab';
import TelosTab from './member/TelosTab';

const TABS = [
  { id: 'today', label: 'Today' },
  { id: 'schedule', label: 'Schedule' },
  { id: 'body', label: 'Body' },
  { id: 'dexa', label: 'DEXA Report' },
  { id: 'nutrition', label: 'Nutrition' },
  { id: 'movement', label: 'Movement' },
  { id: 'sleep', label: 'Sleep · Recovery' },
  { id: 'telos', label: 'Telos', badge: 3 },
  { id: 'apps', label: 'Apps' },
  { id: 'match', label: 'Find Your Analyst' },
  { id: 'onboarding', label: 'Onboarding' },
  { id: 'feedback', label: 'Suggestions' },
];

export default function MemberApp() {
  const [tab, setTab] = useState('today');

  return (
    <div className="max-w-[1500px] mx-auto px-8 py-14">
      {/* HEAD */}
      <div className="mb-8 flex items-end justify-between flex-wrap gap-6">
        <div>
          <div className="lbl mb-4" style={{ color: 'var(--ac-b)' }}>
            MEMBER APP · MAYA REYES · MAY 13 · 07:42
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
            Good morning,{' '}
            <em className="serif italic holo" style={{ fontWeight: 400 }}>
              Maya
            </em>
            .
          </h1>
          <p className="mt-3 text-base max-w-xl" style={{ color: 'var(--ink-s)' }}>
            8 days since DEXA #6 · 21 days until DEXA #7. Telos is here when you need it.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="chip chip-ac">
            <span className="dot dot-ac pulse" /> KALOS FOOD LOG
          </span>
          <span className="chip chip-ac">WEIGHT LOG</span>
          <span className="chip chip-cy">WHOOP · ROADMAP Q2</span>
          <span className="chip">APPLE HEALTH · ROADMAP Q2</span>
        </div>
      </div>

      <div className="mb-8">
        <Tabs tabs={TABS} active={tab} onChange={setTab} />
      </div>

      {tab === 'today' && <TodayTab />}
      {tab === 'schedule' && <Schedule />}
      {tab === 'body' && <BodyTab />}
      {tab === 'dexa' && <DEXAReport />}
      {tab === 'nutrition' && <NutritionTab />}
      {tab === 'movement' && <MovementTab />}
      {tab === 'sleep' && <SleepTab />}
      {tab === 'telos' && <TelosTab />}
      {tab === 'apps' && <Apps />}
      {tab === 'match' && <AnalystMatch />}
      {tab === 'onboarding' && <Onboarding />}
      {tab === 'feedback' && <Feedback audience="member" />}
    </div>
  );
}
