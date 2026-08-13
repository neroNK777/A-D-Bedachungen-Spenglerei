/**
 * Leistungen des Betriebs.
 *
 * `bestaetigt: true`  = stand so auf der alten Seite, vom Kunden belegt.
 * `bestaetigt: false` = sinnvolle Ergaenzung fuer einen Dachdecker- und
 *                       Spenglereibetrieb, muss vom Kunden bestaetigt werden.
 *                       Siehe CLAUDE.md, Abschnitt "Offene Punkte".
 */

export type Leistung = {
  slug: string;
  titel: string;
  /** Kurzzeile fuer die Uebersicht. */
  zeile: string;
  /** Zwei bis drei Saetze fuer die Detailseite und die Startseite. */
  text: string;
  /** Stichpunkte: was konkret dazugehoert. */
  umfang: string[];
  icon: string;
  bestaetigt: boolean;
  /** Titel und Beschreibung der Unterseite. */
  seitentitel: string;
  seitenbeschreibung: string;
};

export const leistungen: Leistung[] = [
  {
    slug: 'flachdachabdichtung',
    titel: 'Flachdachabdichtung',
    zeile: 'Flachdächer, Terrassen und Tiefgaragen dicht bekommen und dicht halten.',
    text: 'Ein Flachdach verzeiht keine Nachlässigkeit. Wir dichten mit Bitumenbahnen oder Kunststoffbahnen ab, führen jede Durchdringung sauber an und legen die Gefälle so an, dass kein Wasser stehen bleibt. Anschlüsse an aufgehende Bauteile bekommen eine Hohlkehle und eine ordentliche Randaufkantung.',
    umfang: [
      'Bitumen-Schweißbahn zweilagig oder Kunststoffbahn einlagig',
      'Gefälledämmung, damit Wasser abläuft statt zu stehen',
      'Anschlüsse an Wände, Attiken, Lichtkuppeln und Rohre',
      'Terrassen und befahrbare Tiefgaragendecken',
    ],
    icon: 'ph:rectangle',
    bestaetigt: true,
    seitentitel: 'Flachdachabdichtung Augsburg',
    seitenbeschreibung:
      'Flachdach, Terrasse oder Tiefgarage abdichten in Augsburg und Umgebung. Bitumen- und Kunststoffabdichtung, Gefälledämmung, saubere Anschlüsse.',
  },
  {
    slug: 'blechdach-und-falzarbeiten',
    titel: 'Blechdach und Falzarbeiten',
    zeile: 'Metallfalzdächer in Titanzink, Aluminium, Kupfer und Edelstahl.',
    text: 'Ein Falzdach hält, weil die Bahnen mechanisch verbunden sind und nicht verklebt. Wir kanten die Scharen in der eigenen Werkstatt in Dasing vor und schließen sie auf dem Dach im Doppelstehfalz. Das funktioniert auch bei flacher Neigung, wo Ziegel längst durchlassen würden.',
    umfang: [
      'Doppelstehfalz und Winkelstehfalz',
      'Titanzink, Aluminium, Kupfer, Edelstahl und beschichtetes Stahlblech',
      'Gauben, Kehlen, Grate und Ortgänge',
      'Vorfertigung in der eigenen Werkstatt',
    ],
    icon: 'ph:steps',
    bestaetigt: true,
    seitentitel: 'Blechdach und Metallfalzdach Augsburg',
    seitenbeschreibung:
      'Metallfalzdach vom Spengler: Doppelstehfalz in Titanzink, Aluminium oder Kupfer. Vorfertigung in eigener Werkstatt, Montage in Augsburg und Umgebung.',
  },
  {
    slug: 'steildach-eindeckung',
    titel: 'Steildach-Eindeckung',
    zeile: 'Neueindeckung mit allen gängigen Ziegel- und Betonsteinarten.',
    text: 'Ob Biberschwanz, Falzziegel oder Betondachstein: die Deckung ist nur so gut wie das, was darunter liegt. Wir prüfen Lattung und Konterlattung, erneuern die Unterspannbahn und decken erst dann ein. Firste und Grate werden trocken verlegt und bleiben belüftet.',
    umfang: [
      'Biberschwanz, Falzziegel, Hohlpfanne, Betondachstein',
      'Unterspannbahn, Konterlattung, Traglattung',
      'Trockenfirst und Gratabdeckung',
      'Schnee- und Sicherheitshaken nach Lage',
    ],
    icon: 'ph:house-line',
    bestaetigt: true,
    seitentitel: 'Steildach eindecken in Augsburg',
    seitenbeschreibung:
      'Steildach neu eindecken in Augsburg: Ziegel, Biberschwanz oder Betondachstein, inklusive Unterspannbahn, Lattung und Trockenfirst.',
  },
  {
    slug: 'dachrinnen-und-entwaesserung',
    titel: 'Dachrinnen und Entwässerung',
    zeile: 'Rinnen, Fallrohre und Anschlüsse, die das Wasser wirklich wegbringen.',
    text: 'Die meisten Feuchteschäden an Fassaden fangen an einer undichten Rinne an. Wir setzen Rinnen mit dem nötigen Gefälle, löten Ecken und Stutzen statt sie zu kleben, und hängen Fallrohre so auf, dass sie sich bei Frost bewegen dürfen.',
    umfang: [
      'Hängerinne und Kastenrinne in Zink, Kupfer oder Aluminium',
      'Gelötete Ecken, Stutzen und Endböden',
      'Fallrohre mit Standrohr und Laubfang',
      'Austausch einzelner Rinnenstücke ohne komplette Neuanlage',
    ],
    icon: 'ph:drop-half-bottom',
    bestaetigt: true,
    seitentitel: 'Dachrinne montieren und reparieren, Augsburg',
    seitenbeschreibung:
      'Dachrinnen, Fallrohre und Dachentwässerung in Augsburg. Gelötete Verbindungen in Zink, Kupfer oder Aluminium, auch stückweise Reparatur.',
  },
  {
    slug: 'spenglerarbeiten',
    titel: 'Spenglerarbeiten',
    zeile: 'Alles, was am Dach aus Blech ist: Anschlüsse, Abdeckungen, Verwahrungen.',
    text: 'Spenglerarbeit ist der Teil, den man erst bemerkt, wenn er fehlt. Kaminverwahrung, Mauerabdeckung, Ortgangblech, Kehle: überall dort, wo zwei Bauteile aufeinandertreffen, entscheidet das Blech darüber, ob das Dach dicht bleibt. Wir fertigen die Teile nach Aufmaß an.',
    umfang: [
      'Kaminverwahrung und Wandanschlüsse',
      'Mauerabdeckungen und Attikaabdeckungen',
      'Ortgang-, Traufe- und Kehlbleche',
      'Sonderanfertigung nach Aufmaß',
    ],
    icon: 'ph:wrench',
    bestaetigt: true,
    seitentitel: 'Spenglerei Augsburg und Dasing',
    seitenbeschreibung:
      'Spenglerarbeiten am Dach: Kaminverwahrung, Mauerabdeckung, Ortgang- und Kehlbleche. Eigene Werkstatt in Dasing, Montage im Raum Augsburg.',
  },
  {
    slug: 'dachsanierung',
    titel: 'Dachsanierung',
    zeile: 'Vom Abriss der Altdeckung bis zum gedämmten, dichten Dach.',
    text: 'Bei einer Sanierung kommt fast immer mehr zum Vorschein als geplant. Wir decken ab, sehen uns den Dachstuhl an und sagen Ihnen, was tatsächlich ersetzt werden muss, bevor weitergearbeitet wird. Dämmung, Unterdeckung und neue Deckung kommen dann in einem Zug.',
    umfang: [
      'Abriss und Entsorgung der Altdeckung',
      'Prüfung von Sparren, Lattung und Schalung',
      'Zwischensparren- oder Aufsparrendämmung',
      'Neue Unterdeckung und Neueindeckung',
    ],
    icon: 'ph:arrows-clockwise',
    bestaetigt: false,
    seitentitel: 'Dachsanierung Augsburg',
    seitenbeschreibung:
      'Dachsanierung in Augsburg und Umgebung: Altdeckung abtragen, Dachstuhl prüfen, dämmen und neu eindecken. Ein Ansprechpartner für alle Schritte.',
  },
  {
    slug: 'dachfenster',
    titel: 'Dachfenster',
    zeile: 'Einbau, Austausch und dichter Anschluss an die Deckung.',
    text: 'Ein Dachfenster ist eine Öffnung in einer dichten Fläche, und genau dort geht es üblicherweise schief. Entscheidend ist der Eindeckrahmen und die Anbindung an die Unterspannbahn, nicht das Fenster selbst. Wir tauschen auch einzelne alte Fenster aus, ohne die Deckung ringsum zu zerlegen.',
    umfang: [
      'Neueinbau in vorhandene Sparrenfelder',
      'Austausch alter Fenster im Bestandsmaß',
      'Eindeckrahmen passend zur Deckungsart',
      'Anschluss an Unterspannbahn und Dampfbremse',
    ],
    icon: 'ph:frame-corners',
    bestaetigt: false,
    seitentitel: 'Dachfenster einbauen und austauschen, Augsburg',
    seitenbeschreibung:
      'Dachfenster einbauen oder austauschen in Augsburg. Dichter Eindeckrahmen, sauberer Anschluss an Unterspannbahn und Dampfbremse.',
  },
  {
    slug: 'dachwartung',
    titel: 'Dachwartung und Dachcheck',
    zeile: 'Einmal im Jahr nachsehen ist billiger als einmal sanieren.',
    text: 'Wir gehen das Dach durch, reinigen Rinnen und Abläufe, prüfen Verwahrungen, Kittfugen und lose Ziegel und halten fest, was wir gefunden haben. Sie bekommen einen Bericht mit Fotos und die klare Aussage, was jetzt dran ist und was noch warten kann.',
    umfang: [
      'Sichtprüfung der Deckung und aller Anschlüsse',
      'Rinnen und Abläufe reinigen',
      'Kleinreparaturen direkt vor Ort',
      'Bericht mit Fotos und Einschätzung',
    ],
    icon: 'ph:clipboard-text',
    bestaetigt: false,
    seitentitel: 'Dachwartung und Dachcheck Augsburg',
    seitenbeschreibung:
      'Jährliche Dachwartung in Augsburg: Deckung und Anschlüsse prüfen, Rinnen reinigen, Kleinschäden sofort beheben, Bericht mit Fotos.',
  },
  {
    slug: 'sturmschaden',
    titel: 'Sturmschaden-Reparatur',
    zeile: 'Notabdichtung zuerst, saubere Reparatur danach.',
    text: 'Nach einem Sturm zählt, dass kein Wasser mehr ins Haus läuft. Wir sichern die Stelle zuerst provisorisch ab und reparieren dann in Ruhe. Die Dokumentation für Ihre Gebäudeversicherung machen wir mit, Fotos und Aufmaß gehören dazu.',
    umfang: [
      'Notabdichtung und Absicherung',
      'Ersatz fehlender Ziegel und beschädigter Bleche',
      'Fotodokumentation für die Versicherung',
      'Reparatur nach Freigabe',
    ],
    icon: 'ph:lightning',
    bestaetigt: false,
    seitentitel: 'Sturmschaden am Dach, Augsburg',
    seitenbeschreibung:
      'Sturmschaden am Dach in Augsburg: schnelle Notabdichtung, Reparatur und Fotodokumentation für die Gebäudeversicherung.',
  },
  {
    slug: 'fassadenverkleidung',
    titel: 'Fassadenverkleidung',
    zeile: 'Hinterlüftete Bekleidung in Blech, passend zum Dach.',
    text: 'Gauben, Giebel und ganze Fassadenflächen lassen sich mit demselben Material bekleiden wie das Dach. Das sieht nicht nur zusammenhängend aus, es hält auch dieselbe Zeit. Hinterlüftet aufgebaut, damit die Konstruktion dahinter trocken bleibt.',
    umfang: [
      'Stehfalz-, Leisten- und Kassettenbekleidung',
      'Gauben und Giebelflächen',
      'Hinterlüftete Unterkonstruktion',
      'Material passend zur Dachdeckung',
    ],
    icon: 'ph:columns',
    bestaetigt: false,
    seitentitel: 'Fassadenverkleidung aus Blech, Augsburg',
    seitenbeschreibung:
      'Hinterlüftete Fassadenverkleidung in Titanzink, Aluminium oder Kupfer. Gauben, Giebel und Fassadenflächen im Raum Augsburg.',
  },
];

export const leistungNachSlug = (slug: string) => leistungen.find((l) => l.slug === slug);
