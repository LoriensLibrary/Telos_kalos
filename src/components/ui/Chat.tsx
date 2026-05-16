import { useState, useRef, useEffect } from 'react';
import type { ChatMsg } from '../../data/chat';

interface Props {
  initial: ChatMsg[];
  title?: string;
  subtitle?: string;
  scope?: string;
  placeholder?: string;
}

const REPLIES: Record<string, string> = {
  default:
    "Heard. Logged this against your trend. I'll surface it in your pre-scan brief on May 13 — only the pattern, not the words.",
  yes:
    'Good. Holding the plan as-is. I\'ll check in Friday morning with the first signal read.',
  no:
    'No pressure. We can adjust the plan, or just hold today. What feels off — the volume, the food, or the timing?',
  protein:
    'Aim for 30g before 10am. Greek yogurt + 2 eggs gets you there. Lingo will show the difference within 48h.',
  sleep:
    'Sleep is the upstream variable here. If it stays under 6h for another 3 nights I want your analyst in the loop — okay if I flag it?',
};

function pickReply(input: string): string {
  const t = input.toLowerCase();
  if (/yes|sure|ok|okay|yeah|got it/.test(t)) return REPLIES.yes;
  if (/no|nope|can'?t|cant|won'?t/.test(t)) return REPLIES.no;
  if (/protein|breakfast|food/.test(t)) return REPLIES.protein;
  if (/sleep|tired|hrv|recovery/.test(t)) return REPLIES.sleep;
  return REPLIES.default;
}

let chatMsgCounter = 0;
const nextMsgId = (): string =>
  `m-${Date.now().toString(36)}-${(chatMsgCounter++).toString(36)}`;

export default function Chat({
  initial,
  title = 'Telos',
  subtitle = 'BETWEEN-SCAN CONTINUITY',
  scope = 'PRIVATE TO YOU',
  placeholder = 'Type a message…',
}: Props) {
  // Assign a stable id to each seed message on mount so React's reconciler
  // gets a per-message key instead of array index (which mis-tracks during
  // append + typing-indicator state changes).
  const [msgs, setMsgs] = useState<ChatMsg[]>(() =>
    initial.map((m) => (m.id ? m : { ...m, id: nextMsgId() })),
  );
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [msgs, typing]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setMsgs((m) => [...m, { who: 'me', text, id: nextMsgId() }]);
    setInput('');
    setTyping(true);
    const reply = pickReply(text);
    window.setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [...m, { who: 'ai', text: reply, id: nextMsgId() }]);
    }, 900 + Math.random() * 500);
  };

  return (
    <div className="glass-deep scan flex flex-col" style={{ height: 560 }}>
      <div
        className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center serif text-base"
            style={{
              background:
                'linear-gradient(135deg, color-mix(in srgb, var(--ac) 22%, transparent), color-mix(in srgb, var(--cy) 16%, transparent))',
              border: '1px solid color-mix(in srgb, var(--cy) 26%, transparent)',
              color: 'var(--ac-b)',
              boxShadow: '0 0 18px color-mix(in srgb, var(--ac) 18%, transparent)',
            }}
          >
            T
          </div>
          <div>
            <div className="text-sm" style={{ fontWeight: 500 }}>
              <span className="serif italic">{title}</span>
            </div>
            <div className="lbl mt-0.5" style={{ fontSize: 9 }}>
              {subtitle}
            </div>
          </div>
        </div>
        <span className="chip chip-priv">
          <span className="dot dot-warn" style={{ background: '#FF9988', boxShadow: '0 0 8px #FF9988' }} />
          {scope}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3">
        {msgs.map((m) =>
          m.who === 'sys' ? (
            <div key={m.id} className="flex justify-center">
              <div className="bub-sys">{m.text}</div>
            </div>
          ) : (
            <div key={m.id} className={`flex ${m.who === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div className={`bub ${m.who === 'me' ? 'bub-me' : 'bub-ai'}`}>
                {m.text}
                {m.meta && (
                  <div
                    className="mono mt-2"
                    style={{ fontSize: 9, letterSpacing: '0.10em', color: 'rgba(245,247,250,0.40)' }}
                  >
                    {m.meta}
                  </div>
                )}
              </div>
            </div>
          )
        )}
        {typing && (
          <div className="flex justify-start">
            <div className="bub bub-ai">
              <span className="typ">
                <span />
                <span />
                <span />
              </span>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div
        className="px-5 py-4"
        style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.01), rgba(255,255,255,0.02))',
        }}
      >
        <div className="flex items-center gap-2">
          <input
            aria-label="Message input"
            className="input"
            placeholder={placeholder}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
          />
          <button className="btn-ac" onClick={send} type="button">
            Send
          </button>
        </div>
        <div className="lbl mt-2" style={{ fontSize: 9 }}>
          E2E ENCRYPTED · ANALYST SEES PATTERNS, NOT TEXT · MODEL: KALOS-TELOS-v0.6
        </div>
      </div>
    </div>
  );
}
