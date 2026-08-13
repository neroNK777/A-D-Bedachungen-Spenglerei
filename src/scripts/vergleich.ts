/**
 * Vorher-Nachher-Schieber.
 *
 * Bedienbar mit Maus, Finger und Tastatur. Der Griff traegt role="slider"
 * mit aria-valuenow, damit eine Vorlesehilfe die Position ansagen kann.
 * Kein Hover-Effekt als einzige Bedienart: auf dem Telefon gibt es keinen.
 */

const SCHRITT = 4;
const GROSSER_SCHRITT = 12;

export function starteVergleiche(): void {
  for (const wurzel of document.querySelectorAll<HTMLElement>('[data-vergleich]')) {
    verdrahte(wurzel);
  }
}

function verdrahte(wurzel: HTMLElement): void {
  const griff = wurzel.querySelector<HTMLElement>('[data-vergleich-griff]');
  if (!griff) return;

  let wert = Number(griff.getAttribute('aria-valuenow') ?? 50);
  let zieht = false;

  const setze = (neu: number) => {
    wert = Math.min(100, Math.max(0, neu));
    wurzel.style.setProperty('--schnitt', `${wert}%`);
    griff.setAttribute('aria-valuenow', String(Math.round(wert)));
  };

  const ausPosition = (clientX: number) => {
    const box = wurzel.getBoundingClientRect();
    if (box.width === 0) return;
    setze(((clientX - box.left) / box.width) * 100);
  };

  // Pointer Events decken Maus, Finger und Stift in einem ab.
  wurzel.addEventListener('pointerdown', (e) => {
    // Nur die primaere Taste, und nicht auf Links im Bildbereich.
    if (e.button !== 0) return;
    zieht = true;
    griff.setPointerCapture?.(e.pointerId);
    ausPosition(e.clientX);
    e.preventDefault();
  });

  wurzel.addEventListener('pointermove', (e) => {
    if (!zieht) return;
    ausPosition(e.clientX);
  });

  const loslassen = () => {
    zieht = false;
  };
  wurzel.addEventListener('pointerup', loslassen);
  wurzel.addEventListener('pointercancel', loslassen);
  wurzel.addEventListener('pointerleave', loslassen);

  griff.addEventListener('keydown', (e) => {
    let neu = wert;
    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        neu = wert - SCHRITT;
        break;
      case 'ArrowRight':
      case 'ArrowUp':
        neu = wert + SCHRITT;
        break;
      case 'PageDown':
        neu = wert - GROSSER_SCHRITT;
        break;
      case 'PageUp':
        neu = wert + GROSSER_SCHRITT;
        break;
      case 'Home':
        neu = 0;
        break;
      case 'End':
        neu = 100;
        break;
      default:
        return;
    }
    e.preventDefault();
    setze(neu);
  });

  setze(wert);
}
