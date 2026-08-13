/**
 * Verdrahtung des Hero: Sticky-Buehne, Canvas, Fallback-Kette, Resize.
 *
 * Der Ablauf entspricht der Vorgabe aus der Tutorial-Datei, nur ohne React.
 * Das Projekt ist eine Astro-Seite ohne Framework-Laufzeit; die dortigen
 * Hooks werden dadurch nicht nachgebaut, sondern entfallen. Der Kern bleibt:
 * eine rAF-Schleife, kein scroll-Event, kein Zustand pro Frame.
 */
import { beobachteFortschritt } from './scrollFortschritt';
import {
  FrameSequenz,
  darfFramesLaden,
  frameScrubMoeglich,
  wenigerBewegung,
  type Manifest,
  type Variante,
} from './scrollHero';

type Modus = 'statisch' | 'standbilder' | 'scrub';

const PHASEN_ANZAHL = 3;

export function starteHero(): void {
  const sektion = document.querySelector<HTMLElement>('[data-hero]');
  const buehne = document.querySelector<HTMLElement>('[data-hero-buehne]');
  const canvas = document.querySelector<HTMLCanvasElement>('[data-hero-canvas]');
  if (!sektion || !buehne || !canvas) return;

  const standbilder = Array.from(
    document.querySelectorAll<HTMLElement>('[data-hero-standbild]'),
  );
  const phasen = Array.from(document.querySelectorAll<HTMLElement>('[data-hero-phase]'));

  const setzeModus = (modus: Modus) => sektion.setAttribute('data-hero-modus', modus);

  // Nutzer hat Bewegung abgeschaltet: nur das Poster, kein Pinning.
  // Der Inhalt bleibt vollstaendig, nur die Animation entfaellt.
  if (wenigerBewegung()) {
    setzeModus('statisch');
    return;
  }

  // Sehr alte Browser ohne createImageBitmap, oder Datensparmodus und 2G:
  // vier Standbilder, weiterhin an den Scroll gekoppelt.
  if (!frameScrubMoeglich() || !darfFramesLaden()) {
    setzeModus('standbilder');
    verdrahteStandbilder(sektion, buehne, standbilder, phasen);
    return;
  }

  void starteScrub(sektion, buehne, canvas, phasen, setzeModus);
}

// ---------------------------------------------------------------------------
// Regelfall: Frame-Scrub
// ---------------------------------------------------------------------------

async function starteScrub(
  sektion: HTMLElement,
  buehne: HTMLElement,
  canvas: HTMLCanvasElement,
  phasen: HTMLElement[],
  setzeModus: (m: Modus) => void,
): Promise<void> {
  let manifest: Manifest;
  try {
    const antwort = await fetch('/media/hero/manifest.json');
    if (!antwort.ok) throw new Error('Manifest nicht erreichbar');
    manifest = (await antwort.json()) as Manifest;
  } catch {
    // Ohne Manifest bleibt das Poster stehen. Kein leeres Canvas.
    setzeModus('statisch');
    return;
  }

  // Hoch- und Querformat unterscheiden sich stark. Ein Querformat-Frame in
  // ein Hochformat-Canvas hochskaliert sieht matschig aus, deshalb zwei
  // Saetze. Die Wahl faellt einmal beim Start.
  const hochformat = window.innerWidth / window.innerHeight < 0.95;
  const variante: Variante = hochformat ? manifest.saetze.hoch : manifest.saetze.quer;

  const schmal = window.innerWidth < 768;
  const sequenz = new FrameSequenz(canvas, variante, {
    // Das Telefon bekommt ein kleineres Fenster dekodierter Bilder.
    maxBitmaps: schmal ? 16 : 24,
    // Die Quelle ist nur 826 Pixel hoch. Mehr DPR kostet, ohne etwas zu zeigen.
    maxDpr: schmal ? 1.5 : 2,
    onBereit: () => {
      // Canvas erst einblenden, wenn der erste Frame steht. Sonst sieht man
      // kurz eine leere Flaeche ueber dem Poster.
      canvas.dataset.bereit = 'ja';
    },
  });

  setzeModus('scrub');
  sequenz.start();

  let letztePhase = -1;
  const abmelden = beobachteFortschritt(sektion, (p) => {
    sequenz.drawProgress(p);
    // Ein einziger Eigenschaftswert pro Frame. Die Uebersetzung in
    // Deckkraft und Verschiebung macht CSS.
    buehne.style.setProperty('--p', p.toFixed(4));

    const phase = Math.min(PHASEN_ANZAHL - 1, Math.floor(p * PHASEN_ANZAHL));
    if (phase !== letztePhase) {
      letztePhase = phase;
      zeigePhase(phasen, phase, p);
    }
  });

  // Fenster-Resize UND ResizeObserver: nachgeladene Schriften, ein- und
  // ausklappende Browserleisten auf iOS und Zoom aendern die Canvas-Box,
  // ohne ein window-resize auszuloesen.
  const beiResize = () => sequenz.resize();
  window.addEventListener('resize', beiResize, { passive: true });
  const ro = new ResizeObserver(beiResize);
  ro.observe(canvas);

  window.addEventListener(
    'pagehide',
    () => {
      abmelden();
      ro.disconnect();
      window.removeEventListener('resize', beiResize);
      sequenz.destroy();
    },
    { once: true },
  );
}

// ---------------------------------------------------------------------------
// Fallback: vier Standbilder, weiterhin scrollgekoppelt
// ---------------------------------------------------------------------------

function verdrahteStandbilder(
  sektion: HTMLElement,
  buehne: HTMLElement,
  standbilder: HTMLElement[],
  phasen: HTMLElement[],
): void {
  if (standbilder.length === 0) return;
  let letztes = -1;
  let letztePhase = -1;

  beobachteFortschritt(sektion, (p) => {
    buehne.style.setProperty('--p', p.toFixed(4));

    const index = Math.min(standbilder.length - 1, Math.floor(p * standbilder.length));
    if (index !== letztes) {
      letztes = index;
      standbilder.forEach((bild, i) => {
        bild.dataset.aktiv = i === index ? 'ja' : 'nein';
      });
    }

    const phase = Math.min(PHASEN_ANZAHL - 1, Math.floor(p * PHASEN_ANZAHL));
    if (phase !== letztePhase) {
      letztePhase = phase;
      zeigePhase(phasen, phase, p);
    }
  });
}

// ---------------------------------------------------------------------------

function zeigePhase(phasen: HTMLElement[], index: number, fortschritt: number): void {
  // Die Bauabschnitte erscheinen erst, wenn die Ueberschrift ausgeblendet ist.
  const sichtbar = fortschritt > 0.16;
  phasen.forEach((el, i) => {
    el.dataset.aktiv = sichtbar && i === index ? 'ja' : 'nein';
  });
}
