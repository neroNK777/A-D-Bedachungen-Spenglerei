/**
 * Scrollposition eines Elements als Fortschritt 0 bis 1.
 *
 * Bewusst KEIN scroll-Event-Listener: iOS Safari feuert waehrend des
 * Momentum-Scrollings deutlich weniger scroll-Events als Frames. Ein daran
 * haengender Scrub ueberspringt sichtbar Bilder.
 *
 * Stattdessen eine durchgehende requestAnimationFrame-Schleife, die nur
 * laeuft, solange das Element ueberhaupt im Viewport ist. Der Wert geht per
 * Callback raus und wird nirgends zwischengespeichert - alles, was sich
 * jeden Frame aendert, gehoert nicht in den Zustand einer Komponente.
 */

export type Abnehmer = (fortschritt: number) => void;

export function beobachteFortschritt(el: HTMLElement, onChange: Abnehmer): () => void {
  let frame = 0;
  let laeuft = false;

  const messen = () => {
    const rect = el.getBoundingClientRect();
    const strecke = rect.height - window.innerHeight;
    const wert =
      strecke <= 0
        ? // Element ist kleiner als der Viewport: Fortschritt ueber die
          // Durchlaufzeit statt ueber die Eigenhoehe messen.
          (window.innerHeight - rect.top) / (rect.height + window.innerHeight)
        : -rect.top / strecke;
    onChange(Math.min(1, Math.max(0, wert)));
  };

  const schleife = () => {
    messen();
    frame = window.requestAnimationFrame(schleife);
  };

  const start = () => {
    if (laeuft) return;
    laeuft = true;
    schleife();
  };

  const stopp = () => {
    if (!laeuft) return;
    laeuft = false;
    window.cancelAnimationFrame(frame);
  };

  const beobachter = new IntersectionObserver(
    (eintraege) => {
      const sichtbar = eintraege[0]?.isIntersecting ?? false;
      if (sichtbar) {
        start();
      } else {
        // Einmal nachmessen, damit der Endwert exakt 0 oder 1 ist, wenn die
        // Sektion in einem einzigen Frame aus dem Bild gescrollt wird.
        messen();
        stopp();
      }
    },
    { threshold: 0 },
  );
  beobachter.observe(el);

  // Startwert sofort setzen, ohne auf den ersten Frame zu warten.
  messen();

  return () => {
    beobachter.disconnect();
    stopp();
  };
}

/**
 * Fuer Inhalte, die sich nur ein paar Mal ueber die ganze Strecke aendern,
 * etwa vier Textabschnitte. Der Callback feuert nur beim Wechsel des
 * Abschnitts, nicht bei jedem Frame.
 */
export function beobachteAbschnitt(
  el: HTMLElement,
  anzahl: number,
  onWechsel: (index: number) => void,
): () => void {
  let letzter = -1;
  return beobachteFortschritt(el, (p) => {
    const index = Math.min(anzahl - 1, Math.floor(p * anzahl));
    if (index === letzter) return;
    letzter = index;
    onWechsel(index);
  });
}
