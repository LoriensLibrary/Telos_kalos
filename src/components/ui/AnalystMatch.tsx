import { useState } from 'react';
import { MATCH_QUESTIONS, scoreAnalysts, type Analyst } from '../../data/match';

export default function AnalystMatch() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [matched, setMatched] = useState<Analyst | null>(null);

  const onAnswer = (qid: string, tag: string) => {
    const next = { ...answers, [qid]: tag };
    setAnswers(next);
    if (step < MATCH_QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      // reveal
      const ranked = scoreAnalysts(next);
      setMatched(ranked[0]);
    }
  };

  const restart = () => {
    setStep(0);
    setAnswers({});
    setMatched(null);
  };

  if (matched) return <MatchResult analyst={matched} onRestart={restart} />;

  const q = MATCH_QUESTIONS[step];
  const progress = ((step + 1) / MATCH_QUESTIONS.length) * 100;

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-8">
        <div className="glass glow-cy p-10">
          <div className="flex items-center justify-between mb-5">
            <div className="lbl" style={{ color: 'var(--cy)' }}>
              FIND YOUR ANALYST · STEP {step + 1} OF {MATCH_QUESTIONS.length}
            </div>
            <span className="chip">~60 SECONDS</span>
          </div>

          <div className="mb-6" style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 999 }}>
            <div
              style={{
                width: `${progress}%`,
                height: '100%',
                background: 'linear-gradient(90deg, var(--ac), var(--cy))',
                borderRadius: 999,
                boxShadow: '0 0 12px var(--cy)',
                transition: 'width 400ms ease',
              }}
            />
          </div>

          <h2 className="serif text-3xl mb-6" style={{ fontWeight: 400, lineHeight: 1.15 }}>
            {q.label}
          </h2>

          <div className="space-y-2">
            {q.options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => onAnswer(q.id, opt.tag)}
                className="w-full text-left p-4 rounded-xl transition-all"
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--line)',
                  cursor: 'pointer',
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="text-base" style={{ fontWeight: 500 }}>
                    {opt.label}
                  </div>
                  <span className="mono" style={{ color: 'var(--ac-b)', fontSize: 16 }}>
                    →
                  </span>
                </div>
              </button>
            ))}
          </div>

          {step > 0 && (
            <button
              className="btn-gh mt-5"
              onClick={() => setStep(step - 1)}
              style={{ padding: '6px 12px' }}
            >
              ← Back
            </button>
          )}
        </div>
      </div>

      <div className="col-span-4 space-y-6">
        <div className="glass p-6">
          <div className="lbl mb-3" style={{ color: 'var(--ac-b)' }}>WHY THIS QUIZ</div>
          <p className="text-sm mb-3" style={{ color: 'var(--ink-s)' }}>
            Kalos has 14 analysts — every one is an athlete who became a data scientist. They specialize in
            different things: hypertrophy, longevity, performance, behavior change, mobility.
          </p>
          <p className="text-sm" style={{ color: 'var(--ink-s)' }}>
            Four questions surfaces the right starting match. After scan #2, you can switch if a different
            specialty fits better.
          </p>
        </div>
        <div className="glass p-6">
          <div className="lbl mb-3" style={{ color: 'var(--ac-b)' }}>WHAT WE'LL DO WITH IT</div>
          <ul className="space-y-2 text-sm" style={{ color: 'var(--ink-s)' }}>
            {[
              'Match you to an analyst whose specialty fits',
              'Pre-brief them so your first session lands fast',
              'Seed your first 4-week program template',
            ].map((x, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1.5 dot dot-ac" />
                <span>{x}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function MatchResult({ analyst, onRestart }: { analyst: Analyst; onRestart: () => void }) {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-8 space-y-6">
        <div className="glass glow p-10">
          <div className="lbl mb-3" style={{ color: 'var(--ac-b)' }}>YOUR ANALYST · MATCHED</div>
          <div className="flex items-center gap-5 mb-6">
            <div
              className="rounded-2xl flex items-center justify-center serif"
              style={{
                width: 96,
                height: 96,
                fontSize: 36,
                background:
                  'linear-gradient(135deg, color-mix(in srgb, var(--ac) 22%, transparent), color-mix(in srgb, var(--cy) 16%, transparent))',
                color: 'var(--ac-b)',
                border: '1px solid color-mix(in srgb, var(--ac) 30%, transparent)',
                boxShadow: '0 14px 28px -8px rgba(0,0,0,0.55)',
              }}
            >
              {analyst.initials}
            </div>
            <div>
              <h2 className="serif text-4xl mb-1" style={{ fontWeight: 400 }}>
                {analyst.name}
              </h2>
              <div className="lbl">{analyst.cert} · {analyst.location.toUpperCase()}</div>
            </div>
          </div>

          <p className="text-base mb-5" style={{ color: 'var(--ink-s)' }}>
            {analyst.bio}
          </p>

          <div className="lbl mb-2" style={{ fontSize: 9 }}>SPECIALTIES</div>
          <div className="flex flex-wrap gap-2 mb-5">
            {analyst.specialties.map((s) => (
              <span key={s} className="chip chip-ac">{s}</span>
            ))}
          </div>

          <div
            className="p-4 rounded-xl mb-5"
            style={{
              background: 'color-mix(in srgb, var(--cy) 8%, transparent)',
              border: '1px solid color-mix(in srgb, var(--cy) 28%, transparent)',
            }}
          >
            <div className="lbl mb-2" style={{ color: 'var(--cy)' }}>SIGNATURE</div>
            <p className="text-sm serif italic" style={{ color: 'var(--ink)', fontSize: 16 }}>
              "{analyst.signature}"
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button className="btn-ac">Book first session</button>
            <button className="btn-gh">Message {analyst.name.split(' ')[0]}</button>
            <button className="btn-gh" onClick={onRestart}>Retake quiz</button>
          </div>
        </div>

        <div className="glass p-7">
          <div className="lbl mb-4" style={{ color: 'var(--ac-b)' }}>FIRST-SESSION PREP</div>
          <p className="text-sm mb-4" style={{ color: 'var(--ink-s)' }}>
            We'll send {analyst.name.split(' ')[0]} a pre-brief 24 hours before your first session. They'll
            arrive already calibrated to your goals + history.
          </p>
          <div className="space-y-2">
            {[
              { v: 'Pre-brief sent to analyst', s: '24h before · auto' },
              { v: 'Goals + history shared', s: 'from this quiz' },
              { v: 'Reading list (optional)', s: '3 quick reads from your protocol' },
            ].map((x, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-lg"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--line)' }}
              >
                <div className="text-sm">{x.v}</div>
                <div className="lbl" style={{ fontSize: 9 }}>{x.s}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="col-span-4 space-y-6">
        <div className="glass p-6">
          <div className="lbl mb-3" style={{ color: 'var(--ac-b)' }}>SECOND-CHOICE MATCHES</div>
          <p className="text-xs mb-4" style={{ color: 'var(--ink-s)' }}>
            After scan #2, you can switch if a different specialty fits better.
          </p>
          {scoreAnalysts({}).slice(0, 3).map((a) =>
            a.id === analyst.id ? null : (
              <div
                key={a.id}
                className="flex items-center gap-3 mb-3 p-3 rounded-lg"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--line)' }}
              >
                <div
                  className="rounded-lg flex items-center justify-center serif"
                  style={{
                    width: 36,
                    height: 36,
                    background: 'color-mix(in srgb, var(--ac) 12%, transparent)',
                    color: 'var(--ac-b)',
                    border: '1px solid color-mix(in srgb, var(--ac) 28%, transparent)',
                    fontSize: 14,
                  }}
                >
                  {a.initials}
                </div>
                <div className="flex-1">
                  <div className="text-xs" style={{ fontWeight: 500 }}>{a.name}</div>
                  <div className="lbl mt-0.5" style={{ fontSize: 9 }}>{a.specialties.slice(0, 2).join(' · ')}</div>
                </div>
              </div>
            )
          ).slice(0, 2)}
        </div>

        <div className="glass p-6 glow-cy">
          <div className="lbl mb-3" style={{ color: 'var(--cy)' }}>HOW THE MATCH WORKED</div>
          <p className="text-sm" style={{ color: 'var(--ink-s)' }}>
            Telos scored every analyst on the team against your 4 answers — goal fit, training history,
            coaching style, schedule. {analyst.name.split(' ')[0]} topped the list because their specialties
            map to what you said you want most.
          </p>
        </div>
      </div>
    </div>
  );
}
