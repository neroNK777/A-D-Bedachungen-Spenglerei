/**
 * Rechenlogik des Dach-Kostenrechners.
 *
 * ===========================================================================
 *  ALLE PREISE IN DIESER DATEI SIND VOM KUNDEN ZU PRUEFEN.
 * ===========================================================================
 *
 * Es sind Marktspannen fuer Sued-Bayern, Stand 2025, jeweils als Brutto-
 * preise inklusive 19 % Umsatzsteuer und inklusive Material und Lohn.
 * Sie sind bewusst als Spanne von-bis angesetzt, nicht als Punktpreis.
 *
 * Zum Anpassen: nur die Zahlen in `MATERIAL`, `UMFANG`, `DACHFORM` und
 * `ZUSATZ` aendern. Die Rechenfunktion darunter muss nicht angefasst werden.
 *
 * Der Rechner laeuft vollstaendig im Browser. Es werden keine Eingaben
 * uebertragen, solange der Nutzer nicht selbst das Formular absendet.
 */

export type DachformId = 'steildach' | 'walmdach' | 'flachdach';
export type MaterialId = 'ziegel' | 'blech' | 'schiefer' | 'bitumen';
export type UmfangId = 'neueindeckung' | 'sanierung' | 'reparatur';
export type ZusatzId = 'dachrinne' | 'daemmung' | 'geruest' | 'entsorgung';

export type Spanne = { von: number; bis: number };

// ---------------------------------------------------------------------------
// Dachform
// ---------------------------------------------------------------------------

export const DACHFORM: Record<
  DachformId,
  { titel: string; hinweis: string; faktor: number; materialien: MaterialId[] }
> = {
  steildach: {
    titel: 'Steildach',
    hinweis: 'Satteldach oder Pultdach, eine oder zwei geneigte Flächen.',
    // Referenzfall.
    faktor: 1.0,
    materialien: ['ziegel', 'blech', 'schiefer'],
  },
  walmdach: {
    titel: 'Walmdach',
    hinweis: 'Auf allen vier Seiten geneigt, mit Graten und Kehlen.',
    // Grate, Kehlen und mehr Verschnitt: rund 12 % Aufschlag.
    faktor: 1.12,
    materialien: ['ziegel', 'blech', 'schiefer'],
  },
  flachdach: {
    titel: 'Flachdach',
    hinweis: 'Bis etwa 5 Grad Neigung. Dach, Terrasse oder Garagendecke.',
    faktor: 1.0,
    // Ziegel und Schiefer brauchen Neigung. Auf dem Flachdach gibt es sie nicht.
    materialien: ['bitumen', 'blech'],
  },
};

// ---------------------------------------------------------------------------
// Material: Preis je Quadratmeter Dachflaeche, Brutto
// ---------------------------------------------------------------------------

export const MATERIAL: Record<
  MaterialId,
  { titel: string; hinweis: string; lebensdauer: string; proQm: Spanne }
> = {
  ziegel: {
    titel: 'Ziegel oder Betonstein',
    hinweis: 'Ton- oder Betondachstein, inklusive Lattung und Unterdeckbahn.',
    lebensdauer: '40 bis 60 Jahre',
    proQm: { von: 95, bis: 165 },
  },
  blech: {
    titel: 'Blech im Falz',
    hinweis: 'Doppelstehfalz in Titanzink oder Aluminium, in der Werkstatt vorgekantet.',
    lebensdauer: '50 bis 80 Jahre',
    proQm: { von: 155, bis: 265 },
  },
  schiefer: {
    titel: 'Schiefer',
    hinweis: 'Naturschiefer, je nach Deckart unterschiedlich aufwendig.',
    lebensdauer: '80 bis 120 Jahre',
    proQm: { von: 185, bis: 330 },
  },
  bitumen: {
    titel: 'Bitumen oder Kunststoffbahn',
    hinweis: 'Abdichtung für Flachdach, Terrasse und Garagendecke.',
    lebensdauer: '25 bis 40 Jahre',
    proQm: { von: 65, bis: 125 },
  },
};

// ---------------------------------------------------------------------------
// Umfang der Arbeiten
// ---------------------------------------------------------------------------

export const UMFANG: Record<
  UmfangId,
  { titel: string; hinweis: string; faktor: number; grundpreis?: Spanne }
> = {
  neueindeckung: {
    titel: 'Neueindeckung',
    hinweis: 'Dachstuhl steht, es wird neu gedeckt oder abgedichtet.',
    faktor: 1.0,
  },
  sanierung: {
    titel: 'Sanierung',
    hinweis: 'Altdeckung herunter, Unterbau prüfen und ertüchtigen, neu decken.',
    // Aufwand fuer Ertuechtigung von Lattung, Schalung und Anschluessen.
    faktor: 1.18,
  },
  reparatur: {
    titel: 'Reparatur',
    hinweis: 'Nur ein Teilbereich, zum Beispiel nach einem Sturm.',
    // Nur ein Bruchteil der Flaeche wird angefasst.
    faktor: 0.3,
    // Anfahrt, Rüstzeit und Absturzsicherung fallen trotzdem einmal komplett an.
    grundpreis: { von: 380, bis: 780 },
  },
};

// ---------------------------------------------------------------------------
// Zusatzposten
// ---------------------------------------------------------------------------

type ZusatzDefinition = {
  titel: string;
  hinweis: string;
  /** Wie die Menge aus der Dachflaeche geschaetzt wird. */
  art: 'proQm' | 'proLaufmeter';
  preis: Spanne;
  /** Nur bei 'proLaufmeter': Laufmeter je Quadratmeter Dachflaeche. */
  laufmeterFaktor?: number;
  /** Auf welchen Dachformen der Posten ueberhaupt sinnvoll ist. */
  nurBei?: DachformId[];
};

export const ZUSATZ: Record<ZusatzId, ZusatzDefinition> = {
  dachrinne: {
    titel: 'Dachrinne und Fallrohre',
    hinweis: 'Rinne, Stutzen und Fallrohre komplett neu.',
    art: 'proLaufmeter',
    preis: { von: 55, bis: 95 },
    // Faustwert: Traufenlänge in Laufmetern etwa 2 mal Wurzel der Dachfläche.
    // Umgerechnet auf einen Faktor je Quadratmeter siehe `laufmeter()`.
    laufmeterFaktor: 2,
  },
  daemmung: {
    titel: 'Dämmung',
    hinweis: 'Zwischensparren- oder Aufsparrendämmung inklusive Dampfbremse.',
    art: 'proQm',
    preis: { von: 55, bis: 120 },
  },
  geruest: {
    titel: 'Gerüst',
    hinweis: 'Auf- und Abbau, Standzeit für die Dauer der Arbeiten.',
    art: 'proQm',
    preis: { von: 12, bis: 24 },
    // Auf dem Flachdach wird in der Regel anders gesichert.
    nurBei: ['steildach', 'walmdach'],
  },
  entsorgung: {
    titel: 'Entsorgung der Altdeckung',
    hinweis: 'Abriss, Container und Deponiegebühren.',
    art: 'proQm',
    preis: { von: 18, bis: 42 },
  },
};

/** Grenzen des Flaechenreglers. */
export const FLAECHE = { min: 20, max: 500, schritt: 5, start: 140 } as const;

// ---------------------------------------------------------------------------
// Rechnung
// ---------------------------------------------------------------------------

export type Eingabe = {
  dachform: DachformId;
  material: MaterialId;
  umfang: UmfangId;
  flaeche: number;
  zusatz: ZusatzId[];
};

export type Posten = { id: string; titel: string; menge: string; spanne: Spanne };

export type Ergebnis = {
  posten: Posten[];
  summe: Spanne;
  /** Auf 100 Euro gerundete Anzeigewerte. */
  anzeige: Spanne;
};

/** Geschaetzte Traufenlaenge in Laufmetern aus der Dachflaeche. */
function laufmeter(flaeche: number, faktor: number): number {
  return Math.round(Math.sqrt(flaeche) * faktor);
}

function runde(wert: number, schritt: number): number {
  return Math.round(wert / schritt) * schritt;
}

/** Welche Materialien passen zu dieser Dachform. */
export function verfuegbareMaterialien(dachform: DachformId): MaterialId[] {
  return [...DACHFORM[dachform].materialien];
}

/** Welche Zusatzposten passen zu dieser Dachform. */
export function verfuegbareZusatzposten(dachform: DachformId): ZusatzId[] {
  return (Object.keys(ZUSATZ) as ZusatzId[]).filter((id) => {
    const nurBei = ZUSATZ[id].nurBei;
    return !nurBei || nurBei.includes(dachform);
  });
}

export function berechne(eingabe: Eingabe): Ergebnis {
  const { dachform, material, umfang, flaeche } = eingabe;
  const posten: Posten[] = [];

  const formFaktor = DACHFORM[dachform].faktor;
  const umfangDef = UMFANG[umfang];

  // Hauptposten: Deckung beziehungsweise Abdichtung.
  const basis = MATERIAL[material].proQm;
  const deckungVon = basis.von * flaeche * formFaktor * umfangDef.faktor;
  const deckungBis = basis.bis * flaeche * formFaktor * umfangDef.faktor;

  posten.push({
    id: 'deckung',
    titel: umfang === 'reparatur' ? `${MATERIAL[material].titel}, Teilfläche` : MATERIAL[material].titel,
    menge:
      umfang === 'reparatur'
        ? `rund ${Math.max(1, Math.round(flaeche * umfangDef.faktor))} m² angefasst`
        : `${flaeche} m²`,
    spanne: { von: deckungVon, bis: deckungBis },
  });

  // Grundpreis, falls der Umfang einen kennt.
  if (umfangDef.grundpreis) {
    posten.push({
      id: 'grundpreis',
      titel: 'Anfahrt, Rüstzeit und Sicherung',
      menge: 'pauschal',
      spanne: { ...umfangDef.grundpreis },
    });
  }

  // Zusatzposten in der Reihenfolge, in der sie definiert sind.
  for (const id of Object.keys(ZUSATZ) as ZusatzId[]) {
    if (!eingabe.zusatz.includes(id)) continue;
    const def = ZUSATZ[id];
    if (def.nurBei && !def.nurBei.includes(dachform)) continue;

    if (def.art === 'proLaufmeter') {
      const lfm = laufmeter(flaeche, def.laufmeterFaktor ?? 2);
      posten.push({
        id,
        titel: def.titel,
        menge: `rund ${lfm} lfm`,
        spanne: { von: def.preis.von * lfm, bis: def.preis.bis * lfm },
      });
    } else {
      posten.push({
        id,
        titel: def.titel,
        menge: `${flaeche} m²`,
        spanne: { von: def.preis.von * flaeche, bis: def.preis.bis * flaeche },
      });
    }
  }

  const summe = posten.reduce(
    (akku, p) => ({ von: akku.von + p.spanne.von, bis: akku.bis + p.spanne.bis }),
    { von: 0, bis: 0 },
  );

  return {
    posten,
    summe,
    anzeige: { von: runde(summe.von, 100), bis: runde(summe.bis, 100) },
  };
}

/** Der Satz, der rechtlich unter jedem Ergebnis stehen muss. */
export const VORBEHALT =
  'Diese Schätzung ist unverbindlich und ersetzt kein Angebot. Der tatsächliche Preis hängt von der Vor-Ort-Besichtigung ab.';
