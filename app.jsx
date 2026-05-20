/* global React, ReactDOM */
const { useEffect: useAppEffect } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "vibe": "warm",
  "accent": "#d9f04a",
  "cursor": "trail",
  "stars": true
}/*EDITMODE-END*/;

const ACCENT_MAP = {
  '#d9f04a': 'chartreuse',
  '#ff5a3c': 'tomato',
  '#7fc8e8': 'sky',
  '#b39cf0': 'violet'
};

function App() {
  const [t, setTweak] = window.useTweaks(TWEAK_DEFAULTS);

  // Sync body attrs to tweaks
  useAppEffect(() => {
    document.body.setAttribute('data-vibe', t.vibe);
    document.body.setAttribute('data-accent', ACCENT_MAP[t.accent] || 'chartreuse');
    document.body.setAttribute('data-cursor', t.cursor);
    document.querySelectorAll('.star').forEach(s => {
      s.style.display = t.stars ? '' : 'none';
    });
  }, [t.vibe, t.accent, t.cursor, t.stars]);

  return (
    <React.Fragment>
      {t.cursor !== 'off' && <window.CustomCursor />}
      <window.TopBar />
      <window.PageIndicator />
      <window.Hero />
      <window.About />
      <window.Works />
      <window.Footer />

      <div className="tweak-hint">
        <span className="kbd">⌥</span> + click hover regions · drag curved text · click stars
      </div>

      <window.TweaksPanel>
        <window.TweakSection label="Vibe" />
        <window.TweakSelect
          label="Theme"
          value={t.vibe}
          options={[
            { value: 'warm',     label: 'Warm · beige (default)' },
            { value: 'midnight', label: 'Midnight · dark-mode flip' },
            { value: 'paper',    label: 'Paper · high-key minimal' },
            { value: 'sticker',  label: 'Sticker · playful + tilted' }
          ]}
          onChange={(v) => setTweak('vibe', v)}
        />
        <window.TweakColor
          label="Accent"
          value={t.accent}
          options={['#d9f04a', '#ff5a3c', '#7fc8e8', '#b39cf0']}
          onChange={(v) => setTweak('accent', v)}
        />

        <window.TweakSection label="Cursor" />
        <window.TweakRadio
          label="Style"
          value={t.cursor}
          options={[
            { value: 'trail',  label: 'Trail' },
            { value: 'dotring', label: 'Dot+Ring' },
            { value: 'off',    label: 'Off' }
          ]}
          onChange={(v) => setTweak('cursor', v)}
        />

        <window.TweakSection label="Decor" />
        <window.TweakToggle
          label="Show stars"
          value={t.stars}
          onChange={(v) => setTweak('stars', v)}
        />
      </window.TweaksPanel>
    </React.Fragment>
  );
}

// Wait for all globals to be ready then mount
function mount() {
  if (!window.CustomCursor || !window.TopBar || !window.Hero || !window.About || !window.Works || !window.Footer || !window.useTweaks || !window.TweaksPanel) {
    setTimeout(mount, 30);
    return;
  }
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<App />);
}
mount();
