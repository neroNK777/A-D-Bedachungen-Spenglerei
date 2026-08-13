/**
 * Frame-Engine fuer den Hero: Fortschritt 0 bis 1 wird zum passenden Bild
 * auf einem 2D-Canvas.
 *
 * Zwei Speicherformen mit unterschiedlicher Lebensdauer:
 *
 *   Blob (kodiert, ~30 KB)        ImageBitmap (dekodiert, ~1 bis 3 MB)
 *   ------------------------      -----------------------------------
 *   alle 240 bleiben liegen,      nur ein Fenster von 16 bis 24 Stueck,
 *   sobald sie geladen sind       der Rest wird sofort .close()t
 *
 * 240 gleichzeitig dekodierte Bilder waeren auf dem Telefon mehrere hundert
 * Megabyte und beenden den Tab.
 */

export type Variante = {
  count: number;
  width: number;
  height: number;
  pattern: string;
  bytes: number;
  poster: string;
  standbilder: string[];
};

export type Manifest = {
  step: number;
  saetze: Record<'quer' | 'hoch', Variante>;
};

type Optionen = {
  /** Groesse des Fensters dekodierter Bilder. */
  maxBitmaps: number;
  /** Obergrenze fuer devicePixelRatio. Mehr als die Quellaufloesung bringt nichts. */
  maxDpr: number;
  /** Wird gerufen, sobald der erste Frame auf dem Canvas steht. */
  onBereit?: () => void;
  /** Ladefortschritt 0 bis 1, fuer eine dezente Anzeige. */
  onLadefortschritt?: (anteil: number) => void;
};

/** Parallele Downloads. Netzwerk-I/O, darf breit laufen. */
const DOWNLOAD_PARALLEL = 6;
/** Parallele Dekodierungen. Blockiert kurz den Hauptthread, deshalb schmal. */
const DEKODIER_PARALLEL = 2;
/** Wie viele Frames in Scrollrichtung vorausschauend dekodiert werden. */
const VORLAUF = 8;

function framePfad(pattern: string, index: number): string {
  // Dateien sind ab 0001 nummeriert, der Index laeuft ab 0.
  return pattern.replace(/%(\d+)d/, (_, stellen: string) =>
    String(index + 1).padStart(Number(stellen), '0'),
  );
}

export class FrameSequenz {
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly variante: Variante;
  private readonly opt: Optionen;

  private readonly blobs: (Blob | null)[];
  private readonly bitmaps = new Map<number, ImageBitmap>();
  private readonly dekodiertGerade = new Set<number>();

  private zielIndex = 0;
  private letzterZielIndex = 0;
  private geladen = 0;
  private naechsterDownload = 0;
  private laufendeDownloads = 0;
  private bereit = false;
  private zerstoert = false;
  private readonly abbruch = new AbortController();

  constructor(canvas: HTMLCanvasElement, variante: Variante, opt: Optionen) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) throw new Error('2D-Kontext nicht verfügbar');
    this.ctx = ctx;
    this.variante = variante;
    this.opt = opt;
    this.blobs = new Array(variante.count).fill(null);
    this.resize();
  }

  // -------------------------------------------------------------------------
  // 1. Downloads: der Reihe nach, mit fester Parallelitaet.
  // -------------------------------------------------------------------------

  start(): void {
    for (let i = 0; i < DOWNLOAD_PARALLEL; i++) this.pumpeDownload();
  }

  private pumpeDownload(): void {
    if (this.zerstoert) return;
    if (this.laufendeDownloads >= DOWNLOAD_PARALLEL) return;
    if (this.naechsterDownload >= this.variante.count) return;

    const index = this.naechsterDownload++;
    this.laufendeDownloads++;

    fetch(framePfad(this.variante.pattern, index), { signal: this.abbruch.signal })
      .then((antwort) => (antwort.ok ? antwort.blob() : null))
      .then((blob) => {
        if (this.zerstoert) return;
        if (blob) {
          this.blobs[index] = blob;
          this.geladen++;
          this.opt.onLadefortschritt?.(this.geladen / this.variante.count);
        }
      })
      .catch(() => {
        // Abgebrochene oder fehlgeschlagene Frames werden uebersprungen.
        // Gezeichnet wird ohnehin der naechstliegende vorhandene Frame.
      })
      .finally(() => {
        if (this.zerstoert) return;
        this.laufendeDownloads--;
        this.pumpeDekodierung();
        this.pumpeDownload();
      });
  }

  // -------------------------------------------------------------------------
  // 2. Dekodierung: nur ein Fenster um den Zielframe, in Scrollrichtung
  //    vorausschauend.
  // -------------------------------------------------------------------------

  private pumpeDekodierung(): void {
    if (this.zerstoert) return;
    const richtung = this.zielIndex >= this.letzterZielIndex ? 1 : -1;

    for (let schritt = 0; schritt <= VORLAUF; schritt++) {
      if (this.dekodiertGerade.size >= DEKODIER_PARALLEL) return;
      const index = this.zielIndex + schritt * richtung;
      if (index < 0 || index >= this.variante.count) continue;
      if (this.bitmaps.has(index) || this.dekodiertGerade.has(index)) continue;
      const blob = this.blobs[index];
      if (blob) void this.dekodiere(index, blob);
    }
  }

  private async dekodiere(index: number, blob: Blob): Promise<void> {
    this.dekodiertGerade.add(index);
    try {
      const bitmap = await createImageBitmap(blob);
      if (this.zerstoert) {
        bitmap.close();
        return;
      }
      this.bitmaps.set(index, bitmap);
      this.raeumeAuf();
      this.zeichne();
      if (!this.bereit) {
        this.bereit = true;
        this.opt.onBereit?.();
      }
    } catch {
      // Ein defekter Frame darf die Sequenz nicht anhalten.
    } finally {
      this.dekodiertGerade.delete(index);
      this.pumpeDekodierung();
    }
  }

  // -------------------------------------------------------------------------
  // 3. Eviction nach Distanz, nicht nach Alter. Beim Scrubben ist ein Frame
  //    direkt neben dem aktuellen wertvoller als ein neu geladener weit weg.
  // -------------------------------------------------------------------------

  private raeumeAuf(): void {
    while (this.bitmaps.size > this.opt.maxBitmaps) {
      let opfer = -1;
      let weiteste = -1;
      for (const index of this.bitmaps.keys()) {
        const abstand = Math.abs(index - this.zielIndex);
        if (abstand > weiteste) {
          weiteste = abstand;
          opfer = index;
        }
      }
      if (opfer < 0) return;
      // .close() gibt den Decoder-Speicher sofort frei. Ohne das wartet man
      // auf den Garbage Collector, und auf dem Telefon reicht das nicht.
      this.bitmaps.get(opfer)?.close();
      this.bitmaps.delete(opfer);
    }
  }

  // -------------------------------------------------------------------------
  // 4. Zeichnen: naechstliegender bereits dekodierter Frame, nicht zwingend
  //    der exakte Zielframe. Sonst friert das Bild ein, waehrend geladen wird.
  // -------------------------------------------------------------------------

  private naechsteBitmap(index: number): ImageBitmap | null {
    const treffer = this.bitmaps.get(index);
    if (treffer) return treffer;

    let bester: ImageBitmap | null = null;
    let kleinsterAbstand = Infinity;
    for (const [i, bitmap] of this.bitmaps) {
      const abstand = Math.abs(i - index);
      if (abstand < kleinsterAbstand) {
        kleinsterAbstand = abstand;
        bester = bitmap;
      }
    }
    return bester;
  }

  private zeichne(): void {
    const bitmap = this.naechsteBitmap(this.zielIndex);
    if (!bitmap) return;

    const { width: cw, height: ch } = this.canvas;
    if (cw === 0 || ch === 0) return;

    // object-cover von Hand: Seitenverhaeltnis halten, Rest beschneiden.
    const skala = Math.max(cw / bitmap.width, ch / bitmap.height);
    const bw = bitmap.width * skala;
    const bh = bitmap.height * skala;
    this.ctx.drawImage(bitmap, (cw - bw) / 2, (ch - bh) / 2, bw, bh);
  }

  drawProgress(fortschritt: number): void {
    if (this.zerstoert) return;
    const index = Math.round(fortschritt * (this.variante.count - 1));
    if (index !== this.zielIndex) {
      this.letzterZielIndex = this.zielIndex;
      this.zielIndex = index;
    }
    this.zeichne();
    this.pumpeDekodierung();
  }

  resize(): void {
    if (this.zerstoert) return;
    const dpr = Math.min(window.devicePixelRatio || 1, this.opt.maxDpr);
    const breite = Math.round(this.canvas.clientWidth * dpr);
    const hoehe = Math.round(this.canvas.clientHeight * dpr);
    if (breite === 0 || hoehe === 0) return;
    if (this.canvas.width === breite && this.canvas.height === hoehe) return;
    this.canvas.width = breite;
    this.canvas.height = hoehe;
    this.zeichne();
  }

  destroy(): void {
    this.zerstoert = true;
    this.abbruch.abort();
    for (const bitmap of this.bitmaps.values()) bitmap.close();
    this.bitmaps.clear();
    this.blobs.fill(null);
  }
}

// ---------------------------------------------------------------------------
// Fallback-Kette. Die Entscheidung faellt erst im Browser: der Server kennt
// weder Netzwerktyp noch Faehigkeiten des Geraets.
// ---------------------------------------------------------------------------

export function frameScrubMoeglich(): boolean {
  return (
    typeof window.HTMLCanvasElement !== 'undefined' &&
    typeof window.createImageBitmap === 'function' &&
    typeof window.fetch === 'function' &&
    typeof window.AbortController === 'function'
  );
}

export function darfFramesLaden(): boolean {
  const c = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } })
    .connection;
  if (!c) return true;
  if (c.saveData) return false;
  if (/2g$/.test(c.effectiveType ?? '')) return false;
  return true;
}

export function wenigerBewegung(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
