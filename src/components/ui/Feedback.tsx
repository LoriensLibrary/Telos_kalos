import { useState } from 'react';

const CATEGORIES = ['New feature', 'Bug', 'Design', 'Coaching idea', 'Other'];

interface Props {
  audience: 'member' | 'analyst';
}

export default function Feedback({ audience }: Props) {
  const [text, setText] = useState('');
  const [anon, setAnon] = useState(true);
  const [name, setName] = useState('');
  const [cat, setCat] = useState<string>(CATEGORIES[0]);
  const [sent, setSent] = useState(false);

  const heroLine =
    audience === 'member'
      ? 'Tell Telos what would make this better for you.'
      : 'Tell Telos what would help you do your work.';

  const placeholder =
    audience === 'member'
      ? 'I wish I could… / It would help if… / I noticed that…'
      : "I'd like to see… / This breaks when… / The brief is missing…";

  const submit = () => {
    if (!text.trim()) return;
    setSent(true);
    window.setTimeout(() => {
      setSent(false);
      setText('');
      setName('');
    }, 4200);
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-8">
        <div className="glass p-8">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div className="lbl" style={{ color: 'var(--ac-b)' }}>
              SUGGESTIONS · IMPROVE TELOS
            </div>
            <span className="chip chip-cy">
              <span className="dot dot-cy pulse" />
              ROUTED TO KALOS PRODUCT TEAM
            </span>
          </div>
          <h2
            className="serif text-3xl mb-3"
            style={{ fontWeight: 400, lineHeight: 1.1 }}
          >
            {heroLine}
          </h2>
          <p className="text-sm mb-6" style={{ color: 'var(--ink-s)' }}>
            Anonymous by default. Add your name only if you want a reply.
          </p>

          <div className="lbl mb-2">CATEGORY</div>
          <div className="flex items-center gap-2 flex-wrap mb-6">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`chip ${cat === c ? 'chip-ac' : ''}`}
                style={{ cursor: 'pointer' }}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="lbl mb-2">YOUR SUGGESTION</div>
          <textarea
            className="input mb-5"
            rows={6}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={placeholder}
            style={{ resize: 'vertical', fontFamily: 'inherit' }}
          />

          <div
            className="flex items-center gap-3 mb-5 p-3 rounded-lg"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--line)' }}
          >
            <label className="flex items-center gap-2 cursor-pointer text-sm" style={{ color: 'var(--ink-s)' }}>
              <input
                type="checkbox"
                checked={anon}
                onChange={(e) => setAnon(e.target.checked)}
                style={{ accentColor: 'var(--ac)' }}
              />
              Send anonymously
            </label>
            {!anon && (
              <input
                className="input"
                placeholder="Your name (optional reply route)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ flex: 1, marginLeft: 'auto', maxWidth: 320 }}
              />
            )}
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button className="btn-ac" onClick={submit} disabled={!text.trim()}>
              {sent ? 'Sent ✓' : 'Send suggestion'}
            </button>
            <span className="lbl">
              E2E ENCRYPTED · {anon ? 'NO IDENTITY ATTACHED' : 'NAME ATTACHED FOR REPLY'}
            </span>
          </div>

          {sent && (
            <div
              className="mt-5 p-4 rounded-lg"
              style={{
                background: 'color-mix(in srgb, var(--ac) 8%, transparent)',
                border: '1px solid color-mix(in srgb, var(--ac) 28%, transparent)',
                color: 'var(--ink)',
              }}
            >
              <div className="lbl mb-1" style={{ color: 'var(--ac-b)' }}>RECEIVED</div>
              <div className="text-sm">
                Thanks for shaping Telos. Your note went into the next sprint review. {!anon && name ? `We'll get back to you, ${name.split(' ')[0]}.` : ''}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="col-span-4 space-y-6">
        <div className="glass p-6">
          <div className="lbl mb-3" style={{ color: 'var(--ac-b)' }}>WHAT WE'RE WORKING ON</div>
          <ul className="space-y-3 text-sm" style={{ color: 'var(--ink-s)' }}>
            {[
              { v: 'Voice-dictated session notes', s: 'in-build · ETA 2wk' },
              { v: 'Native iOS / Android', s: 'in-design' },
              { v: 'Cohort comparison view', s: 'queued' },
              { v: 'Apple Watch complications', s: 'queued' },
            ].map((x, i) => (
              <li key={i}>
                <div className="text-sm" style={{ fontWeight: 500, color: 'var(--ink)' }}>{x.v}</div>
                <div className="lbl mt-0.5" style={{ fontSize: 9 }}>{x.s}</div>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass p-6">
          <div className="lbl mb-3" style={{ color: 'var(--ac-b)' }}>RECENT IDEAS THAT SHIPPED</div>
          <ul className="space-y-3 text-sm" style={{ color: 'var(--ink-s)' }}>
            {audience === 'member'
              ? [
                  'Lingo glucose-trace on Nutrition tab',
                  'Telos conversation history',
                  'Supplement adherence tracking',
                  'Goal progress bars with cohort delta',
                ]
              : [
                  'AI-prepared day schedule',
                  'Standards protocol library',
                  'Session-notes autosave',
                  'AI Inbox draft-message review',
                ]
            .map((v, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="dot dot-ac" style={{ marginTop: 7 }} />
                <span>{v}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass p-6 glow-cy">
          <div className="lbl mb-3" style={{ color: 'var(--cy)' }}>YOUR THOUGHTS, FAST</div>
          <p className="text-sm" style={{ color: 'var(--ink-s)' }}>
            Every suggestion lands in the same queue the founders review weekly. Quick wins ship in 2 weeks, bigger asks move to roadmap. You'll see it appear in <em className="serif italic">"Recent ideas that shipped"</em> when it lands.
          </p>
        </div>
      </div>
    </div>
  );
}
