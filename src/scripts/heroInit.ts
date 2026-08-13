/**
 * Kleine Parallaxe fuer den Hero: Foto und Text verschieben sich
 * gegenlaeufig zum Zeiger. Kein rAF, keine Scroll-Kopplung, nur zwei
 * CSS-Variablen, die bei Zeigerbewegung nachgefuehrt werden. Auf
 * Touch-Geraeten und bei prefers-reduced-motion bleibt das Bild ruhig.
 */
export function starteHero(): void {
  const sektion = document.querySelector<HTMLElement>('[data-hero]');
  if (!sektion) return;

  const feinerZeiger = matchMedia('(pointer: fine)').matches;
  const wenigerBewegung = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!feinerZeiger || wenigerBewegung) return;

  const setze = (x: number, y: number) => {
    sektion.style.setProperty('--zeiger-x', x.toFixed(3));
    sektion.style.setProperty('--zeiger-y', y.toFixed(3));
  };

  sektion.addEventListener(
    'pointermove',
    (ereignis) => {
      const box = sektion.getBoundingClientRect();
      // -0.5 bis 0.5 in beide Richtungen, Mitte der Buehne ist 0.
      setze(
        (ereignis.clientX - box.left) / box.width - 0.5,
        (ereignis.clientY - box.top) / box.height - 0.5,
      );
    },
    { passive: true },
  );

  sektion.addEventListener('pointerleave', () => setze(0, 0), { passive: true });
}
