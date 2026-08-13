/**
 * Einsatzgebiet als stilisierte Radiusdarstellung.
 *
 * Bewusst keine eingebettete Karte: Google Maps laedt beim Seitenaufruf
 * Daten des Besuchers zu Google, das braucht eine Einwilligung. Auch eine
 * Zwei-Klick-Loesung waere hier nur Aufwand ohne Nutzen, denn die Frage des
 * Besuchers lautet nicht "wo genau", sondern "kommen die zu mir".
 *
 * Die Winkel- und Entfernungsangaben sind aus den Koordinaten der Orte
 * relativ zum Buero in Augsburg gerechnet und einmalig hier abgelegt.
 */

export type Ort = {
  name: string;
  /** Luftlinie vom Buero Augsburg, gerundet. */
  km: number;
  /** Himmelsrichtung in Grad, 0 = Norden, im Uhrzeigersinn. */
  winkel: number;
  /** Hebt die beiden eigenen Standorte hervor. */
  standort?: 'buero' | 'werkstatt';
  /**
   * Verschiebung der Beschriftung in SVG-Einheiten. Nur noetig, wo Orte
   * nah beieinander liegen und sich die Namen sonst ueberdecken.
   */
  versatz?: { x: number; y: number };
  /** Ueberschreibt die automatische Textausrichtung. */
  anker?: 'start' | 'middle' | 'end';
};

export const orte: Ort[] = [
  { name: 'Augsburg', km: 0, winkel: 0, standort: 'buero', versatz: { x: -8, y: -4 }, anker: 'end' },
  { name: 'Dasing', km: 9, winkel: 88, standort: 'werkstatt', versatz: { x: 9, y: 4 }, anker: 'start' },
  { name: 'Friedberg', km: 5, winkel: 118, versatz: { x: 8, y: 13 }, anker: 'start' },
  { name: 'Gersthofen', km: 8, winkel: 340, versatz: { x: -8, y: -2 }, anker: 'end' },
  { name: 'Neusäß', km: 6, winkel: 300, versatz: { x: -8, y: 4 }, anker: 'end' },
  { name: 'Königsbrunn', km: 12, winkel: 195 },
  { name: 'Aichach', km: 20, winkel: 55 },
  { name: 'Mering', km: 14, winkel: 155, versatz: { x: 8, y: 4 }, anker: 'start' },
  { name: 'Gablingen', km: 13, winkel: 328 },
  { name: 'Zusmarshausen', km: 24, winkel: 275 },
  { name: 'Schwabmünchen', km: 24, winkel: 205 },
  { name: 'Pöttmes', km: 28, winkel: 30 },
];

/** Ringe der Radiusdarstellung in Kilometern. */
export const ringe = [10, 20, 30] as const;

export const einsatzradius = 30;
