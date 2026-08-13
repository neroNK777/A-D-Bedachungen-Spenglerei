# Notizen

## Farbumstellung auf die Markenfarben des Logos

### Warum

Bis Version 3 war die Seite durchgehend dunkel: Bitumenschwarz als Grund,
Kupferpatina (Türkis) als einziger Akzent. Diese Palette entstand, bevor das
echte Logo des Kunden vorlag. Das Logo ist eindeutig hell — weißer Grund,
tiefes Weinrot für Dach-Icon und Wortmarke, neutrales Grau für den Untertitel,
darunter ein gestreiftes Ziegelmuster in Terrakotta-Abstufungen. Die Seite hat
sich dem Logo anzupassen, nicht umgekehrt.

### Gemessene Logo-Farben

Nicht geschätzt, sondern mit sharp aus den Bilddateien ausgezählt
(Quantisierung auf 8er- bzw. 16er-Raster, reines Weiß übersprungen).

| Quelle | Ton | Anmerkung |
| --- | --- | --- |
| Wortmarke und Dach-Icon | `#780008`, `#780010`, `#800010` | dominanter Ton, tiefes Weinrot |
| Streifenmuster unten | `#903020` | Terrakotta, häufigster Streifenton |
| Streifenmuster unten | `#800000`, `#801000` | dunkle Streifen |
| Untertitel | `#909090` bis `#c0c0c0` | neutrales Grau, kein Blaustich |
| Untertitel, dunkelste Stelle | `#303030` | |

Der Auftrag nannte die Spanne `#7A2416` bis `#901000`. Die Messung bestätigt
beides, aber an **verschiedenen Stellen**: das Terrakotta `#7A2416`/`#903020`
gehört zum Streifenmuster, die Wortmarke selbst ist mit `#780008` deutlich
tiefer und weniger orange. Das Markenrot der Seite folgt deshalb der
Wortmarke, das Terrakotta bleibt dem Streifenelement und Sekundärflächen
vorbehalten.

### Inventur: wo die alte Palette überall sitzt

Stand vor der Umstellung. Tokens sind in `src/styles/global.css` unter
`@theme` definiert, alle Verwendungen laufen bereits über Tokens — es gibt
praktisch keine hartkodierten Farben in Komponenten, was die Umstellung stark
vereinfacht.

**Token-Verwendungen insgesamt**

| Token | Hex alt | Treffer |
| --- | --- | --- |
| `--color-patina` | `#4FB79E` | 64 |
| `--color-kreide` | `#A5B0B5` | 51 |
| `--color-linie` | `#333C42` | 41 |
| `--color-bitumen` | `#14181A` | 28 |
| `--color-schiefer` | `#8F9AA0` | 28 |
| `--color-zink` | `#21272B` | 21 |
| `--color-zinkweiss` | `#E8ECEC` | 14 |
| `--color-ziegel` | `#D2684A` | 13 |
| `--color-falz` | `#5C676D` | 7 |
| `--color-zink-hell` | `#2A3237` | 4 |
| `--color-patina-tief` | `#1C3B36` | 3 |
| `--color-ziegel-tief` | `#2E1610` | 2 |

**Dateien, nach Trefferzahl**

| Treffer | Datei |
| --- | --- |
| 59 | `src/styles/global.css` |
| 38 | `src/components/Kontakt.astro` |
| 32 | `src/components/Kostenrechner.astro` |
| 15 | `src/components/Einsatzgebiet.astro` |
| 14 | `src/components/Fusszeile.astro` |
| 11 | `src/pages/leistungen/[slug].astro` |
| 11 | `src/components/Sturmschaden.astro` |
| 11 | `src/components/Hero.astro` |
| 10 | `src/pages/leistungen/index.astro` |
| 10 | `src/components/VergleichSchieber.astro` |
| 10 | `src/components/Leistungen.astro` |
| 9 | `src/components/DachaufbauExplorer.astro` |
| 8 | `src/components/KostenrechnerVorschau.astro` |
| 8 | `src/components/Kopfzeile.astro` |
| 6 | `src/components/MobilLeiste.astro` |
| 5 | `src/components/ProjekteVorschau.astro` |
| 4 | `src/components/VorherNachher.astro` |
| 4 | `src/components/Prozess.astro` |
| 2 | `src/pages/404.astro` |

**Hartkodierte Farben außerhalb von `global.css`**

| Stelle | Wert | Zweck |
| --- | --- | --- |
| `src/components/Kopfzeile.astro:80` | `#fff` | weiße Karte unter dem Logo, nur nötig, weil der Grund dunkel ist |
| `src/layouts/Grundlayout.astro:41` | `#14181A` | `theme-color` für die Browserleiste |
| `src/data/dachaufbau.ts` | 8 Werte | Materialfarben der Schichten, siehe unten |

**Sonderfälle, die nicht per Token erledigt sind**

- **Falz** (`global.css`, Signaturelement am linken Rand): arbeitet mit
  `color-mix` gegen Schwarz und Weiß, um eine Blechkante zu simulieren
  (Schatten / Grat / Schatten). Die Logik „heller Grat auf dunklem Grund"
  kehrt sich auf hellem Grund um und muss neu gedacht werden.
- **Einsatzgebiet** (SVG-Radiusdarstellung): `stroke="var(--color-linie)"` an
  drei Stellen, läuft über Tokens.
- **Dachaufbau-Explorer**: acht Schichtfarben in `src/data/dachaufbau.ts`,
  alle für dunklen Grund gewählt. `Innenbekleidung` (`#c9c6bd`) erreicht auf
  hellem Grund nur 1,60:1 und verschwindet, `Dämmung` (`#8a7a52`) ist ein
  stumpfes Braun statt des typischen Dämmgelbs.
- **Favicon** (`public/favicon.png`): weißer Grund, rotes Icon — passt
  bereits zum hellen Schema, keine Änderung nötig.
- **OG-Bild** (`public/media/og-bild.jpg`): Standbild aus dem inzwischen
  gelöschten Hero-Video, palettenneutral, aber nicht die eigene Arbeit des
  Betriebs.

### Was geändert wurde

**Entscheidung: helles Grundgerüst.** Nicht nur, weil das Logo weiß ist, sondern
weil der bisherige dunkle Grund einen sichtbaren Notbehelf erzwang: das Logo saß
in einer weißen Karte mit Schatten, damit sein weißer Grund nicht wie aufgeklebt
wirkte. Mit dem Cremeweiß entfällt diese Karte ersatzlos. Dunkel bleiben genau
drei Stellen als Kontrastanker: Hero oben, Sturmschadenblock in der Mitte,
Fusszeile unten.

**Tokensystem neu, nicht Suchen-und-Ersetzen.** Die alten Namen beschrieben eine
dunkle Welt (Bitumen, Zink, Patina) und wären als Etikett auf hellen Werten
irreführend gewesen. Umbenannt wurde deshalb rollenweise, mit Platzhaltern in
zwei Durchgängen, damit sich die Muster nicht gegenseitig überschreiben (das alte
`--color-ziegel` wurde zu `--color-terrakotta`, bevor `--color-patina` den frei
gewordenen Namen `--color-ziegel` bekam). 267 Verwendungen in 19 Dateien, danach
null Reste alter Namen. Auch die Klassennamen wurden nachgezogen:
`.knopf--patina` → `.knopf--marke`, `.knopf--ziegel` → `.knopf--terrakotta`.

**Stellen, an denen die mechanische Umbenennung zwangsläufig falsch lag** und die
einzeln nachgezogen wurden:

| Stelle | Problem | Lösung |
| --- | --- | --- |
| Hero-Schleier | wurde zu einem hellen Schleier über dunklem Foto | zurück auf `--color-russ` |
| Hero-Glanzzug | dunkler statt heller Lichtstreifen | zurück auf `--color-blatt` |
| Hero-Text | dunkle Schrift auf dunklem Foto | `--color-kalk` / `--color-kreide` |
| Rand-Knopf im Hero | für hellen Grund gebaut, verschwand im Foto | eigene Werte im Hero |
| Trennkante im Vergleichsschieber | wurde dunkel und unsichtbar auf den Fotos | zurück auf `--color-blatt` |
| Fusszeile, Sturmschaden | hell geworden, sollten Kontrastanker sein | dunkel, mit Dunkelgrund-Tokens |

**Zwei echte Fehler, im Test gefunden:**

- Der WhatsApp-Knopf im Sturmschadenblock hatte keinen Rahmen: `.knopf--rand-hell`
  setzte nur `border-color`, ohne `border-width` und `border-style`. Die Klasse
  erbt nichts von `.knopf--rand`, also gab es gar keinen Rand.
- Das Streifenband über der Fusszeile wirkte fleckig statt gestreift: bei fast
  waagerechten Linien passt in 12 px Bandhöhe keine volle Wiederholung. Jetzt
  leicht geneigte Senkrechte, was zugleich die Stehfalz-Sprache der Seite trifft.

**Dachaufbau-Explorer.** Die acht Schichten haben materialtreue Eigentöne
bekommen; Markenrot bleibt allein der aktiven Auswahl. Zwei Werte mussten ohnehin
geändert werden: `Innenbekleidung` (`#C9C6BD`) erreichte auf hellem Grund nur
1,60:1 und verschwand, `Dämmung` war ein stumpfes Braun statt Dämmgelb. Der
aktive Zustand hellt nicht mehr auf, sondern kräftigt die Farbe — Aufhellen hätte
Dämmgelb und Gipskarton auf hellem Grund ausgebleicht.

**Signature.** Das Streifenmuster sitzt an genau einer Stelle: als 12 px hohes
Band über der Fusszeile. Der Falz am linken Rand bleibt das Hauptsignature, seine
Lichtführung ist umgekehrt (weißer Grat zwischen warmen Schattenkanten statt
hellem Grat zwischen schwarzen Schatten).

**Favicon und OG-Bild.** Das Favicon passte bereits (weißer Grund, rotes Icon) und
blieb unverändert. Das OG-Bild war ein Standbild aus dem gelöschten Hero-Video und
zeigte nicht die eigene Arbeit des Betriebs; es zeigt jetzt das echte
Walmdach-Projekt mit dem Streifenband als unterem Abschluss.

**Kontrollen.** Ein Skript prüft jeden sichtbaren Textknoten aller neun Seiten
gegen seinen tatsächlich gerenderten Hintergrund, inklusive Alpha-Überlagerung und
der Unterscheidung von Gross- und Kleintext: **null Unterschreitungen von WCAG
AA**. `npm run build` läuft ohne Warnung durch, keine Konsolen- oder
Netzwerkfehler in Playwright.
