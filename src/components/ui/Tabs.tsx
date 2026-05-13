interface Tab {
  id: string;
  label: string;
  badge?: string | number;
}

interface Props {
  tabs: Tab[];
  active: string;
  onChange: (id: string) => void;
}

export default function Tabs({ tabs, active, onChange }: Props) {
  return (
    <div className="tabs">
      {tabs.map((t) => (
        <button
          key={t.id}
          className="tab"
          data-active={active === t.id}
          onClick={() => onChange(t.id)}
        >
          {t.label}
          {t.badge !== undefined && (
            <span
              className="mono"
              style={{
                marginLeft: 6,
                fontSize: 9,
                padding: '2px 6px',
                borderRadius: 999,
                background: 'rgba(255,255,255,0.08)',
                color: 'var(--ink)',
              }}
            >
              {t.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
