# A&D Bedachungen und Spenglerei — Projektkontext

Arbeitsdatei für Claude Code und für spätere Sessions. Nach jeder Phase aktualisieren.

---

## 1. Auftrag

Neue Website für einen Dachdecker- und Spenglereibetrieb in Augsburg. Ersetzt
https://ad-bedachungen.de (inhaltlich dünn, Projektbilder als lieblose Galerie).

**Zielgruppe:** Hauseigentümer und Bauherren im Raum Augsburg und Dasing, 35 bis 65,
die eine Dachsanierung, ein Flachdach oder Spenglerarbeiten planen.

**Der eine Job der Seite:** qualifizierte Anfragen per Telefon, WhatsApp und Formular.

---

## 2. Kundendaten

| Feld | Wert |
| --- | --- |
| Firma | A&D Bedachungen und Spenglerei |
| Büro | St.-Lukas-Straße 69, 86169 Augsburg |
| Werkstatt | Sielenbacher Str. 5, 86453 Dasing |
| Telefon und WhatsApp | +49 163 9011330 |
| E-Mail | info@ad-bedachungen.com |
| Zweite E-Mail | ad.baudienstleistungen24@gmail.com |
| Instagram | https://www.instagram.com/ad_bedachungen/ |
| Öffnungszeiten | Montag bis Freitag, 7 bis 17 Uhr (vom Kunden bestätigt) |

Alles davon steht in **einer** Datei: `src/data/betrieb.ts`. Kopfzeile, Fusszeile,
Kontakt, Impressum und das Schema.org-Markup lesen von dort. Nirgends sonst
hartkodieren.

---

## 3. Technischer Stack

- **Astro 5**, statischer Build (`output: 'static'`), TypeScript strict.
- **Tailwind CSS v4** über `@tailwindcss/vite`, Tokens in `src/styles/global.css` unter `@theme`.
- **Kein React, kein Vue, kein GSAP.** Alle Interaktion ist eigenes TypeScript in
  `src/scripts/`, geladen über normale `<script>`-Tags in den Komponenten. Astro
  bündelt und minifiziert sie. Gesamtes JavaScript der Startseite: rund 13 KB
  unkomprimiert, etwa 6 KB gzip.
- **Icons:** `astro-icon` mit Phosphor (`@iconify-json/ph`). Wird zur Buildzeit als
  Inline-SVG eingesetzt, kostet kein Client-JavaScript. Eine Familie, keine
  handgezeichneten Pfade.
- **Schriften:** `@fontsource-variable/archivo` und `@fontsource-variable/libre-franklin`,
  selbst gehostet. **Kein Google-Fonts-CDN**, das wäre ohne Einwilligung ein
  DSGVO-Problem.
- **Bilder:** Astro `<Image>` mit sharp, erzeugt WebP und `srcset` zur Buildzeit.
- **Deployment:** Vercel, statisch. `vercel.json` enthält die Weiterleitung von der
  alten Tippfehler-URL und die Sicherheits-Header.

### Warum keine Animationsbibliothek

Pro Fall entschieden, wie im Auftrag verlangt:

| Effekt | Umsetzung | Begründung |
| --- | --- | --- |
| Hero-Scrub | eigene rAF-Schleife + Canvas | Vorgabe der Tutorial-Datei, siehe Abschnitt 5 |
| Falz am Seitenrand | CSS `animation-timeline: scroll()` | läuft nativ ausserhalb des Hauptthreads, null Byte JavaScript |
| Dachaufbau-Explorer | dieselbe rAF-Schleife wie der Hero | ein Mechanismus für alle scrollgebundenen Werte |
| Einblenden von Sektionen | `IntersectionObserver`, einmalig | Eintritt, kein fortlaufender Wert |
| Zustandswechsel (Segmente, Schieber) | CSS-`transition` | reicht vollständig |

GSAP hätte für dieses Set rund 70 KB gekostet und nichts hinzugefügt.

---

## 4. Designtokens

Alle in `src/styles/global.css` unter `@theme`. Die Kontraste sind gerechnet und im
CSS als Kommentar hinterlegt.

### Farbe

Die Seite ist **durchgehend dunkel**. Das ist keine Modeentscheidung: das Material
des Betriebs ist anthrazitfarbenes Blech gegen Himmel, und die beiden Projektfotos
sowie der Hero-Zeitraffer leben davon. Ein heller Grund hätte sie zu Briefmarken
gemacht. Ein Umschalter existiert bewusst nicht, es gibt nur diese eine Welt.

| Token | Hex | Rolle | Kontrast |
| --- | --- | --- | --- |
| `--color-bitumen` | `#14181A` | Grund. Bitumenbahn, nicht reines Schwarz. | — |
| `--color-zink` | `#21272B` | erhöhte Fläche, eine Bahn auf dem Dach | — |
| `--color-linie` | `#333C42` | Trennlinien, Rahmen | — |
| `--color-falz` | `#5C676D` | Falzkamm, Licht auf der Kante. **Nie für Text.** | — |
| `--color-schiefer` | `#8F9AA0` | Etiketten und Kleintext | 6,21:1 Bitumen, 5,25:1 Zink |
| `--color-kreide` | `#A5B0B5` | Sekundärtext | 8,06:1 auf Bitumen |
| `--color-zinkweiss` | `#E8ECEC` | Primärtext | 15,01:1 auf Bitumen |
| `--color-patina` | `#4FB79E` | **einziger Akzent**, Kupferpatina | 7,32:1 in beide Richtungen |
| `--color-ziegel` | `#D2684A` | **nur** Sturmschaden und Platzhaltermarken | 4,95:1 in beide Richtungen |
| `--color-ziegel-tief` | `#2E1610` | Grund unter Ziegelrot | Ziegel darauf: 4,70:1 |

`--color-falz` und `--color-schiefer` sehen ähnlich aus, haben aber getrennte
Aufgaben. Falz ist der Lichtreflex auf einer Blechkante und erreicht als Text nur
3,08:1. Es gehört an Linien, Rahmen und Verläufe, nie an Schrift. Für gedämpften
Kleintext gibt es Schiefer.

`--color-patina` ist so gewählt, dass es in **beide** Richtungen AA erfüllt: als Text
auf dunklem Grund und als Flächenfarbe mit dunklem Text darauf. Deshalb genügt ein
einziger Akzent-Token für Links, aktive Zustände und gefüllte Schaltflächen.

**Ziegelrot ist kein zweiter Akzent.** Es hat genau zwei Aufgaben: den Notfallblock
und die Platzhaltermarken. Sonst kommt es nirgends vor.

### Typografie

- **Display: Archivo Variable**, Breitenachse auf 105 bis 118 Prozent gestreckt.
  Industriegrotesk mit Charakter, gestreckt wie gekantetes Blech. Die Breitenachse
  ist der Grund für die Wahl: sie gibt der Seite ihren Ton, ohne eine zweite
  Displayschrift zu brauchen.
- **Lauftext: Libre Franklin Variable.** Franklin-Gothic-Abkömmling, ruhig, in
  kleinen Graden gut lesbar, saubere Umlaute.
- Zahlen laufen über `.zahlen` tabellarisch, damit im Rechner beim Hochzählen nichts
  springt. Kein Monospace als Kostüm.

Skala: `--text-display` (Hero), `--text-seite` (Unterseiten-H1), `--text-titel`
(Sektion), `--text-unter`, `--text-lauf`.

### Form

- Kantradius **3 px**, einheitlich. Ein Blechzuschnitt hat keine 16 px Rundung.
- Keine Schatten als Elevation. Getrennt wird mit Linien und Abstand.
- Eine Regel, überall: Karten nur, wo eine Fläche wirklich abgesetzt gehört
  (Rechner-Ablesung, Formular, Notfallblock, Umfangskasten).

### Layoutkonzept

Die Seite ist eine **Stehfalzdeckung**. Inhalt liegt in Bahnen (`.bahn`, max. 90 rem),
Sektionen sind Bahnen unterschiedlicher Dichte, und am linken Rand läuft der Falz,
der sie zusammenhält. Spalten sind bewusst ungleich breit (1,15 / 1 / 0,85 bei den
Leistungen, 1,35 / 1 beim Rechner), nie ein Dreiklang gleicher Karten.

```
┌─────────────────────────────────────────────────────┐
│▓ Kopfzeile: Marke · Navigation · Telefon · Anfrage  │  fix, 68 px
├─────────────────────────────────────────────────────┤
│█                                                    │
│█   HERO 400vh, Canvas gepinnt                       │
│█   Zeitraffer: offener Dachstuhl schliesst sich     │
│█                                                    │
│█   Dicht ist keine Meinung.                         │
│█   Dachdeckerei und Spenglerei in Augsburg.         │
│█   [Anfrage stellen] [Anrufen]                      │
├─────────────────────────────────────────────────────┤
│█  Zwei Gewerke, ein Ansprechpartner.                │
│█  ┌ Dachdeckerei ┐ ┌ Spenglerei ┐ ┌──────────┐      │
│█  │ 5 Leistungen │ │ 4 Leistungen│ │  Foto    │      │
│█  └──────────────┘ └─────────────┘ └──────────┘      │
├─────────────────────────────────────────────────────┤
│█  DACHAUFBAU 320vh gepinnt                          │
│█  Text + Tafel        ▤▤▤▤▤ Schnitt, fährt          │
│█                      ▤▤▤▤▤ beim Scrollen auf       │
├─────────────────────────────────────────────────────┤
│█  Vier Dächer, vorher und nachher.                  │
│█  ┌──────────┃──────────┐  Schieber                 │
│█  │ vorher   ┃ nachher  │                           │
│█  └──────────┸──────────┘                           │
│█  Ort · Arbeit · Material · Dauer                   │
├─────────────────────────────────────────────────────┤
│█  KOSTENRECHNER                                     │
│█  Steuerung          │ 13.300 € bis 23.100 €        │
│█  Form/Fläche/       │ Posten                       │
│█  Material/Umfang    │ Vorbehalt                    │
│█                     │ [In die Anfrage übernehmen]  │
├─────────────────────────────────────────────────────┤
│█  Wie es abläuft. 01 bis 06                         │
├─────────────────────────────────────────────────────┤
│█  ⚡ Sturmschaden (einziger Ziegelrot-Block)         │
├─────────────────────────────────────────────────────┤
│█  Einsatzgebiet: Radiusdarstellung, keine Karte     │
├─────────────────────────────────────────────────────┤
│█  Kontakt: Wege links, Formular rechts              │
├─────────────────────────────────────────────────────┤
│▓ Fusszeile                                          │
└─────────────────────────────────────────────────────┘
 ▲ linke Spalte: der Falz, geschlossen bis zur Leseposition
```

### Signature

**Der Falz am linken Seitenrand** (`src/components/Falz.astro`). Ein Doppelstehfalz
ist die hochgestellte, zweifach umgeschlagene Kante zwischen zwei Blechbahnen. Hier
läuft er über die volle Fensterhöhe. Beim Scrollen wandert die Falzzange nach unten:
Was sie passiert hat, ist geschlossen und fängt Licht auf dem Grat, was darunter
liegt, steht noch als stumpfer Steg offen. **Wer die Seite liest, falzt sie zu.**

Angetrieben ausschliesslich von CSS `animation-timeline: scroll()`. Kein JavaScript,
kein Scroll-Listener. Wo der Browser das nicht kann, steht der Falz fertig
geschlossen da und sieht genauso beabsichtigt aus.

---

## 5. Hero: Frame-Scrub statt Video

Umgesetzt nach der gelieferten Tutorial-Datei. **Eine bewusste Abweichung, bitte
gegenlesen:**

> Der allgemeine Auftrag verlangt ein `<video muted playsinline preload="auto">`.
> Die Tutorial-Datei verbietet genau das und begründet es (iOS Safari rundet
> `currentTime` auf den nächsten Keyframe, Rückwärts-Scrubben zwingt den Decoder
> zurück, iOS entscheidet über die Wiedergabe teils selbst). Laut Auftrag gewinnt im
> Konflikt die Tutorial-Datei, deshalb gibt es **kein `<video>`-Element**. Die
> Poster-Anforderung ist erfüllt: das Poster ist LCP-Kandidat und wird vorgeladen.
> Das Quellvideo liegt weiterhin unter `/public/video/`, wie verlangt.

**Ablauf**

1. `scripts/hero-frames.mjs` zerlegt das Video einmalig in zwei WebP-Sequenzen.
   `npm run frames`. Braucht kein System-ffmpeg, nutzt `ffmpeg-static`.
2. Ergebnis liegt eingecheckt unter `public/media/hero/`, damit der Vercel-Build
   kein ffmpeg braucht.

| Satz | Frames | Auflösung | Grösse |
| --- | --- | --- | --- |
| quer | 240 | 1100 × 618 | 7,0 MB |
| hoch | 240 | 620 × 826 | 4,3 MB |

Jeder Frame der Quelle, kein Sampling, `-vsync 0`. Das Wasserzeichen des Generators
unten rechts wird per `delogo` herausgerechnet, nicht weggeschnitten.

**Bausteine**

| Datei | Aufgabe |
| --- | --- |
| `src/scripts/scrollFortschritt.ts` | rAF-Schleife + IntersectionObserver, **kein** `scroll`-Event |
| `src/scripts/scrollHero.ts` | `FrameSequenz`: Blobs behalten, ImageBitmaps in einem Fenster, `.close()` beim Verwerfen, Eviction nach Distanz |
| `src/scripts/heroInit.ts` | Modus wählen, Resize, Bauabschnitte |
| `src/components/Hero.astro` | Sticky-Pinning, Poster, Canvas, Fallbacks |

**Fallback-Kette**, Entscheidung erst im Browser:

| Situation | Modus |
| --- | --- |
| Regelfall | Frame-Scrub, 400vh gepinnt |
| `prefers-reduced-motion` | nur Poster, kein Pinning |
| `saveData` oder 2G | vier Standbilder, 250vh, weiter scrollgekoppelt |
| kein `createImageBitmap` | vier Standbilder |
| kein JavaScript | Poster, Inhalt vollständig |

Scrollauflösung: 400vh minus ein Viewport ergibt 300vh Weg, bei 900 px Fensterhöhe
rund 11 Scrollpixel je Frame.

---

## 6. Ordnerstruktur

```
scripts/hero-frames.mjs      Video → Bildsequenz, einmalig
public/video/                Quellvideo
public/media/hero/           240 Frames je Satz, Poster, Standbilder, manifest.json
src/data/betrieb.ts          Stammdaten, einzige Quelle
src/data/leistungen.ts       9 Leistungen, je mit bestaetigt-Flag
src/data/kalkulation.ts      Preislogik, alles Nötige an einer Stelle
src/data/dachaufbau.ts       die 8 Schichten
src/data/einsatzgebiet.ts    Orte mit Entfernung und Richtung
src/content/projekte/        Content-Collection, eine Datei je Projekt
src/scripts/                 Client-TypeScript
src/components/              Sektionen
src/pages/                   Routen
```

---

## 7. Was ich vom Kunden brauche

### 7.1 Fotos

| Wo | Was |
| --- | --- |
| `src/assets/projekte/` | Vorher und Nachher für **drei** weitere Projekte. Wichtig: beide Aufnahmen von derselben Stelle, bei ähnlichem Licht. Nahezu quadratisch oder 4:3 quer ist ideal. |
| Projekt 1 | vorhanden (Walmdach im Doppelstehfalz) |

Ein fünftes und sechstes Projekt braucht nur eine weitere Markdown-Datei in
`src/content/projekte/` und zwei Bilder. Am Layoutcode ist nichts zu ändern.

### 7.2 Angaben zu Projekt 1

Ort oder Stadtteil, Bauzeit, und ob die Deckung Titanzink oder beschichtetes
Aluminium ist.

### 7.3 Leistungen, die noch zu bestätigen sind

Diese standen **nicht** auf der alten Seite und sind ergänzt, weil ein Dachdecker-
und Spenglereibetrieb sie üblicherweise anbietet. Jede zeigt auf ihrer Seite einen
sichtbaren Hinweis, solange `bestaetigt: false` in `src/data/leistungen.ts` steht.

- Dachsanierung
- Dachfenster
- Dachwartung und Dachcheck
- Sturmschaden-Reparatur
- Fassadenverkleidung

Bestätigt (standen auf der Altseite): Flachdachabdichtung, Blechdach und
Falzarbeiten, Steildach-Eindeckung, Dachrinnen und Entwässerung, Spenglerarbeiten.

### 7.4 Preise im Rechner prüfen

Alle Werte in `src/data/kalkulation.ts` sind Marktspannen für Südbayern, Stand 2025,
**brutto inklusive 19 Prozent Umsatzsteuer**, Material und Lohn. Nur die Zahlen in
`MATERIAL`, `UMFANG`, `DACHFORM` und `ZUSATZ` ändern, die Rechenfunktion bleibt.

### 7.5 Impressum und Datenschutz

Beide Seiten tragen oben einen rot markierten Warnblock und im Text rot gestrichelte
Platzhalter. **Ohne diese Angaben darf die Seite nicht live gehen**, ein
unvollständiges Impressum ist abmahnfähig.

Impressum: Rechtsform, vertretungsberechtigte Person, Registereintrag falls
vorhanden, USt-IdNr. oder Hinweis auf § 19 UStG, zuständige Handwerkskammer und
Betriebsnummer der Handwerksrolle, Berufshaftpflicht, inhaltlich Verantwortlicher.

Datenschutz: Auftragsverarbeitungsverträge mit Vercel und Formspree, Datum der
Freigabe, Aussage zum Datenschutzbeauftragten.

Beide Texte gehören vor dem Livegang durch eine Rechts- und Datenschutzberatung.

---

## 8. Formspree einrichten

Das Formular braucht keinen Server. Einrichtung dauert etwa fünf Minuten und geht
vollständig im Browser, also auch vom iPad.

1. Auf https://formspree.io registrieren.
2. Neues Formular anlegen, als Zieladresse `info@ad-bedachungen.com` eintragen.
3. Formspree zeigt eine Endpunkt-Adresse der Form
   `https://formspree.io/f/xdorwkyz`. Der Teil hinter `/f/` ist die Formular-ID.
4. Im Vercel-Dashboard: **Settings → Environment Variables**, neue Variable anlegen:

   ```
   Name:  PUBLIC_FORMSPREE_ID
   Wert:  die ID aus Schritt 3, also zum Beispiel xdorwkyz
   ```

   Für alle drei Umgebungen setzen (Production, Preview, Development).
5. **Redeploy auslösen.** Umgebungsvariablen greifen erst beim nächsten Build.

Solange die Variable fehlt, zeigt das Formular einen sichtbaren Hinweis und schickt
nichts ab. Telefon und WhatsApp funktionieren unabhängig davon.

**Foto-Upload:** Das Feld ist eingebaut. Dateianhänge sind bei Formspree
kostenpflichtig. Ohne bezahlten Tarif kommt die Anfrage an, die Datei aber nicht.
Entweder Tarif buchen oder das Feld in `src/components/Kontakt.astro` entfernen.

---

## 9. Rechtliches und Datenschutz

**Kein Consent-Banner, weil kein Banner nötig ist.** Die Seite

- setzt keine Cookies,
- nutzt kein Tracking und keine Analyse,
- lädt keine Schriften, Karten, Videos oder Skripte von fremden Servern,
- enthält keine Werbenetzwerke.

Eine Einwilligung wäre nur nötig, wenn Informationen auf dem Gerät des Besuchers
gespeichert oder ausgelesen würden, die für den Betrieb nicht erforderlich sind. Das
passiert nicht. Wird später Analytics eingebaut, ändert sich das und ein Banner wird
Pflicht.

Statt einer eingebetteten Karte gibt es eine gerechnete Radiusdarstellung als SVG.
Google Maps hätte beim Laden Daten des Besuchers übertragen.

WhatsApp und Instagram sind reine Links. Erst beim Klick entsteht eine Verbindung,
und darauf weist die Datenschutzerklärung hin.

Weiterleitung von der alten Tippfehler-URL `/datenschultz` auf `/datenschutz`:
in `vercel.json` als `permanent` (301), zusammen mit `/datenschultz.html`.

---

## 10. Stand und offene Punkte

**Fertig**

- Alle neun Sektionen der Startseite, inhaltlich befüllt.
- Hero-Frame-Scrub mit vollständiger Fallback-Kette.
- Vorher-Nachher-Schieber: Maus, Finger, Tastatur, `role="slider"`.
- Kostenrechner mit Aufschlüsselung, Übernahme in Formular und WhatsApp.
- Dachaufbau-Explorer, Prozess, Sturmschaden, Einsatzgebiet.
- Unterseiten: `/leistungen`, `/leistungen/[slug]` (9 Stück), `/projekte`,
  `/impressum`, `/datenschutz`, `/404`.
- Schema.org `RoofingContractor` mit beiden Adressen und Öffnungszeiten,
  `sitemap.xml`, `robots.txt`, Open-Graph-Bild.
- `npm run build` läuft ohne Warnung durch.

**Offen, braucht den Kunden**

- Punkte aus Abschnitt 7 (Fotos, Projektangaben, Leistungen, Preise, Rechtstexte).
- `PUBLIC_FORMSPREE_ID` setzen, Abschnitt 8.

**Offen, technisch**

- Test auf einem echten iOS-Gerät. Der Frame-Scrub ist genau dafür gebaut, aber
  Momentum-Scrolling verhält sich dort anders als in der Desktop-Simulation.
- Lighthouse auf der Vercel-Preview messen. Lokal geprüft sind Aufbau, Bildformate,
  Schriftauslieferung und JavaScript-Menge.

---

## 11. Regeln für spätere Änderungen

1. Stammdaten nur in `src/data/betrieb.ts`.
2. Preise nur in `src/data/kalkulation.ts`.
3. Keine Zahl über den Betrieb erfinden. Keine Jahre am Markt, keine
   Mitarbeiterzahl, keine Projektanzahl, keine Bewertungsnoten. Wo gestalterisch
   eine Zahl gebraucht wird: `[[BESTÄTIGEN: …]]`. Die Komponente
   `Bestaetigen.astro` macht daraus automatisch eine sichtbare Marke.
4. Ziegelrot bleibt dem Notfallblock und den Platzhaltern vorbehalten.
5. Neue Bewegung nur mit `prefers-reduced-motion`-Zweig und ohne `scroll`-Listener.
6. Keine Ressource von einem fremden Server. Das würde die Datenschutzerklärung
   falsch machen.
7. Texte: Sie-Ansprache, kurze aktive Sätze, keine Superlative ohne Beleg.
