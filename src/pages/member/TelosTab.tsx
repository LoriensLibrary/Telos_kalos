import { MAYA_CHAT } from '../../data/chat';
import Chat from '../../components/ui/Chat';

export default function TelosTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="col-span-1 lg:col-span-7">
        <Chat
          initial={MAYA_CHAT}
          title="Telos"
          subtitle="BETWEEN-SCAN CONTINUITY · MAYA"
          scope="PRIVATE TO YOU"
          placeholder="Tell Telos how you're doing…"
        />
      </div>
      <div className="col-span-1 lg:col-span-5 space-y-6">
        <div className="glass p-6 glow-cy">
          <div className="lbl mb-3" style={{ color: 'var(--cy)' }}>WHAT TELOS KNOWS TODAY</div>
          <ul className="space-y-2 text-sm" style={{ color: 'var(--ink-s)' }}>
            {[
              'Adherence dipped 95% → 48% over weeks 4–6.',
              'Sleep avg 5:42 last 7 nights. HRV depressed 38ms.',
              'Lingo: 3 glucose spikes/day, all post-dinner.',
              'Disclosed: high cognitive-load period from family health.',
              'Workouts: 4 of 7 this week. 2 missed mid-week.',
            ].map((x, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1.5 dot dot-cy" />
                <span>{x}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass p-6">
          <div className="lbl mb-3" style={{ color: 'var(--ac-b)' }}>WHAT THE ANALYST SEES</div>
          <div className="text-sm mb-2" style={{ color: 'var(--ink-s)' }}>
            <span className="lbl mr-2">PATTERN</span>High cognitive-load period · last 72h
          </div>
          <div className="text-sm mb-4" style={{ color: 'var(--ink-s)' }}>
            <span className="lbl mr-2">SIGNAL</span>Adherence likely to drop. Recommend simplified structure 2–4 weeks. Do not press.
          </div>
          <button className="btn-gh" style={{ width: '100%' }}>Surface a topic to your analyst</button>
        </div>

        <div className="glass p-6">
          <div className="lbl mb-3" style={{ color: 'var(--ac-b)' }}>CONVERSATION HISTORY</div>
          <div className="space-y-2 text-xs" style={{ color: 'var(--ink-s)' }}>
            {['Today · morning check-in', 'May 11 · sleep concern', 'May 9 · post-workout', 'May 7 · meal planning', 'May 5 · DEXA reaction'].map((c, i) => (
              <div key={i} className="flex items-center justify-between py-2" style={{ borderBottom: i < 4 ? '1px dashed var(--line)' : 'none' }}>
                <span style={{ color: 'var(--ink)' }}>{c}</span>
                <span className="mono" style={{ fontSize: 10 }}>→</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
