/**
 * Die Schichten eines gedämmten Steildachs, von aussen nach innen.
 * Grundlage fuer den Dachaufbau-Explorer.
 */

export type Schicht = {
  id: string;
  titel: string;
  /** Was diese Schicht tut, in zwei Saetzen, ohne Werbesprache. */
  text: string;
  /** Typische Staerke, fuer die Massangabe am Rand. */
  mass: string;
  /** Farbe der Schichtplatte im Diagramm. */
  farbe: string;
  /** Hoehe der Platte in Pixeln bei Referenzbreite. */
  hoehe: number;
  /** Oberflaechenmuster der Platte. */
  muster: 'ziegel' | 'latte' | 'bahn' | 'daemmung' | 'holz' | 'platte';
};

export const schichten: Schicht[] = [
  {
    id: 'deckung',
    titel: 'Deckung',
    text: 'Ziegel, Betonstein oder Blech: die Schicht, die Regen, Hagel und Sonne abbekommt. Sie ist nicht wasserdicht, sondern regensicher, denn ein Teil des Wassers läuft bei Wind auch dahinter.',
    mass: 'je nach Material',
    farbe: '#2b3238',
    hoehe: 26,
    muster: 'ziegel',
  },
  {
    id: 'traglattung',
    titel: 'Traglattung',
    text: 'Auf ihr hängen die Ziegel. Der Abstand richtet sich nach dem Ziegelmodell und der Dachneigung und entscheidet darüber, wie weit sich die Reihen überdecken.',
    mass: '30 x 50 mm',
    farbe: '#7a6444',
    hoehe: 14,
    muster: 'latte',
  },
  {
    id: 'konterlattung',
    titel: 'Konterlattung',
    text: 'Sie liegt quer darunter und schafft den Luftspalt zwischen Deckung und Unterspannbahn. Ohne diesen Spalt trocknet nichts ab, was einmal hinter die Ziegel gelangt ist.',
    mass: '30 x 50 mm',
    farbe: '#6a563b',
    hoehe: 14,
    muster: 'latte',
  },
  {
    id: 'unterspannbahn',
    titel: 'Unterspannbahn',
    text: 'Die zweite wasserführende Ebene. Was an Flugschnee oder Schlagregen an der Deckung vorbeikommt, läuft auf ihr zur Traufe ab, statt in die Dämmung zu ziehen.',
    mass: '0,5 mm',
    farbe: '#243b4a',
    hoehe: 8,
    muster: 'bahn',
  },
  {
    id: 'daemmung',
    titel: 'Dämmung',
    text: 'Mineralwolle oder Holzfaser zwischen oder über den Sparren. Sie hält im Winter die Wärme im Haus und im Sommer die Hitze draussen, wobei die zweite Aufgabe unter dem Dach meist die schwierigere ist.',
    mass: '180 bis 240 mm',
    farbe: '#8a7a52',
    hoehe: 46,
    muster: 'daemmung',
  },
  {
    id: 'sparren',
    titel: 'Sparren',
    text: 'Das Tragwerk. Es nimmt das Gewicht der Deckung sowie Schnee- und Windlast auf und leitet sie in die Wände. Bei einer Sanierung sehen wir es uns an, bevor irgendetwas Neues darauf kommt.',
    mass: '80 x 200 mm',
    farbe: '#5c4a32',
    hoehe: 40,
    muster: 'holz',
  },
  {
    id: 'dampfbremse',
    titel: 'Dampfbremse',
    text: 'Sie sitzt auf der warmen Seite und hält die Feuchtigkeit aus der Raumluft von der Dämmung fern. Sie muss luftdicht verklebt sein, sonst wandert warme Luft in die Konstruktion und schlägt sich dort nieder.',
    mass: '0,2 mm',
    farbe: '#3a3324',
    hoehe: 7,
    muster: 'bahn',
  },
  {
    id: 'innenbekleidung',
    titel: 'Innenbekleidung',
    text: 'Gipskarton oder Holz auf einer Lattung, mit Abstand zur Dampfbremse. In diesem Hohlraum liegen Kabel und Leitungen, damit die Luftdichtheitsebene nicht durchbohrt werden muss.',
    mass: '12,5 mm',
    farbe: '#c9c6bd',
    hoehe: 12,
    muster: 'platte',
  },
];
