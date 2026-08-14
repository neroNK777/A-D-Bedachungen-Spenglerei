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
  bündelt und minifiziert sie. Gesamtes JavaScript der Startseite: rund 5 KB
  unkomprimiert, etwa 2,3 KB gzip (gesunken, seit Hero und die Startseiten-
  Vorschauen von Projekten und Kostenrechner ohne eigenes Skript auskommen,
  siehe Abschnitt 5 und 10).
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
| Hero: Parallaxe, Glanzzug, Eintritt | CSS-`animation` und `transition`, zwei Custom Properties per `pointermove` | einmaliger Auftritt statt Dauerschleife, siehe Abschnitt 5 |
| Falz am Seitenrand | CSS `animation-timeline: scroll()` | läuft nativ ausserhalb des Hauptthreads, null Byte JavaScript |
| Dachaufbau-Explorer | eigene rAF-Schleife (`scrollFortschritt.ts`) | der einzige verbliebene scrollgebundene Wert auf der Seite |
| Einblenden von Sektionen | `IntersectionObserver`, einmalig | Eintritt, kein fortlaufender Wert |
| Zustandswechsel (Segmente, Schieber) | CSS-`transition` | reicht vollständig |

GSAP hätte für dieses Set rund 70 KB gekostet und nichts hinzugefügt.

---

## 4. Designtokens

Alle in `src/styles/global.css` unter `@theme`. Die Kontraste sind gerechnet und im
CSS als Kommentar hinterlegt.

### Farbe

Die Farbwelt kommt **aus dem Logo des Betriebs**, nicht aus einem Baukasten. Alle
Rotwerte sind aus der Logodatei ausgezählt, nicht geschätzt: die Wortmarke liegt
bei `#780008` (tiefes Weinrot), das Streifenmuster am unteren Logorand bei
`#903020` (Terrakotta), der Untertitel im neutralen Grau zwischen `#909090` und
`#C0C0C0`.

Die Seite ist **überwiegend hell**, weil das Logo einen weißen Grund hat. Solange
die Seite dunkel war, brauchte das Logo in der Kopfzeile eine weiße Karte mit
Schatten, sonst wirkte es wie aufgeklebt. Mit dem hellen Cremeweiß entfällt dieser
Notbehelf ersatzlos, das Logo sitzt direkt auf dem Grund. Ein Umschalter existiert
bewusst nicht, es gibt nur diese eine Welt.

**Dunkel bleiben genau drei Stellen**, als Kontrastanker über die Seitenlänge
verteilt: der Hero oben, der Sturmschadenblock in der Mitte, die Fusszeile unten.

#### Helle Flächen

| Token | Hex | Rolle | Zweck |
| --- | --- | --- | --- |
| `--color-kalk` | `#FAF7F4` | `bg` | Grund. Warmes Cremeweiß, kein reines Weiß. |
| `--color-blatt` | `#FFFFFF` | — | hellste Fläche: Eingabefelder auf Putz |
| `--color-putz` | `#F2EBE5` | `surface` | abgesetzte Fläche: Karten, Ablesung, Formular |
| `--color-lasur` | `#F7EAE6` | `brand-tint` | rötlich getönte Fläche, aktive Zustände |
| `--color-linie` | `#E3D9D0` | — | Trennlinie |
| `--color-kante` | `#D3C5B9` | — | kräftigerer Rahmen. **Nie für Text.** |

#### Text auf hellem Grund

| Token | Hex | Rolle | Kontrast |
| --- | --- | --- | --- |
| `--color-russ` | `#1E1714` | `ink` | 16,56:1 auf Kalk, 14,98:1 auf Putz |
| `--color-graphit` | `#5C554F` | `neutral-700` | 6,86:1 auf Kalk, 6,20:1 auf Putz |
| `--color-schiefer` | `#6E6660` | `neutral-600` | 5,27:1 auf Kalk, 4,77:1 auf Putz |

`--color-russ` dient zugleich als **dunkler Grund** für den Hero.

#### Text und Akzent auf dunklem Grund

| Token | Hex | Rolle | Kontrast |
| --- | --- | --- | --- |
| `--color-kreide` | `#C9C1BA` | Sekundärtext auf dunkel | 9,95:1 auf Russ, 9,33:1 auf Ziegel-tief |
| `--color-ziegel-hell` | `#D9705A` | Akzent auf dunkel | 5,40:1 auf Russ, 5,06:1 auf Ziegel-tief |

`--color-ziegel-hell` erreicht auf **hellem** Grund nur 3,07:1 und darf dort
niemals als Text stehen. Es existiert ausschließlich für die drei dunklen Flächen.

#### Marke

| Token | Hex | Rolle | Kontrast |
| --- | --- | --- | --- |
| `--color-ziegel` | `#7D0A12` | `brand` | 10,23:1 auf Kalk, weiße Schrift darauf 10,91:1 |
| `--color-ziegel-tief` | `#42070B` | `brand-dark` | 15,53:1 gegen Kalk |
| `--color-terrakotta` | `#9A3A26` | `brand-alt` | 6,54:1 auf Kalk, weiße Schrift darauf 6,98:1 |

`--color-ziegel` ist so gewählt, dass es in **beide** Richtungen AA erfüllt: als
Text auf hellem Grund und als Flächenfarbe mit heller Schrift darauf. Deshalb
genügt ein einziger Akzent-Token für Links, aktive Zustände, Fokusringe und
gefüllte Schaltflächen.

`--color-ziegel-tief` trägt die Fusszeile und den Sturmschadenblock.

`--color-terrakotta` stammt aus dem Streifenmuster und ist für **Flächen**
reserviert, nicht für Kleintext. Verworfen wurden bewusst `#B4553C` (4,13:1 auf
Putz) und `#7D756E` (4,24:1 auf Kalk): beide fallen als Text durch.

#### Was nicht Markenrot sein darf

Die acht Schichten im Dachaufbau-Explorer tragen **materialtreue Eigentöne**
(Blechanthrazit, Fichte, Membranblau, Dämmgelb, Konstruktionsholz, Gipskarton) und
liegen in `src/data/dachaufbau.ts`. Markenrot ist dort allein der **aktiven
Auswahl** vorbehalten, sonst verwischt die Bedeutung von „ausgewählt" mit der
Bedeutung „Markenfarbe".

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
│▓▓  HERO, ein Viewport hoch, Vollbild-Foto  (dunkel) │
│█   Parallaxe, Glanzzug, Eintritt beim Laden         │
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
│█  Gebaut, nicht gerendert. (Vorschau, drei Karten)  │
│█  ┌────────┐ ┌────────┐ ┌────────┐                  │
│█  │ Foto   │ │ Foto   │ │ Foto   │  [Alle ansehen]  │
│█  └────────┘ └────────┘ └────────┘  → /projekte     │
├─────────────────────────────────────────────────────┤
│█  KOSTENRECHNER (Vorschau)                          │
│█  Text, ein Beispielwert   │ 13.300 € bis 23.100 €  │
│█  [Kosten berechnen] → /kostenrechner               │
├─────────────────────────────────────────────────────┤
│█  Wie es abläuft. 01 bis 06                         │
├─────────────────────────────────────────────────────┤
│▓▓ ⚡ Sturmschaden (dunkler Rotbraun-Block)           │
├─────────────────────────────────────────────────────┤
│█  Einsatzgebiet: Radiusdarstellung, keine Karte     │
├─────────────────────────────────────────────────────┤
│█  Kontakt: Wege links, Formular rechts              │
├─────────────────────────────────────────────────────┤
│▓▓ Fusszeile (dunkel, mit Streifenband obenauf)      │
└─────────────────────────────────────────────────────┘
 ▲ linke Spalte: der Falz, geschlossen bis zur Leseposition
 ▓▓ die drei bewusst dunklen Flaechen, sonst heller Grund
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

Mit dem hellen Grund kehrt sich die Lichtführung um: nicht mehr ein heller Grat
zwischen zwei schwarzen Schatten, sondern ein weißer Grat zwischen zwei warmen
Schattenkanten, die sich vom Cremeweiß abheben. Die Falzzange läuft in Markenrot.

---

## 5. Hero: Foto statt Scroll-Scrub

**Version 1** war ein an den Scroll gekoppelter Frame-Scrub: ein 400vh gepinntes
Canvas, das eine WebP-Bildsequenz aus einem Zeitraffer-Video abspielte, je nach
Scrollposition vor- und zurück. Umgesetzt nach einer separat gelieferten
Tutorial-Datei, mit voller Fallback-Kette (Standbilder, reduzierte Bewegung, kein
JavaScript). Funktionierte, kostete aber Komplexität: eine eigene `FrameSequenz`-
Klasse mit Bitmap-Fenster und Eviction, 240 Frames je Ausrichtung, ein 2,4 MB
Quellvideo, ein `ffmpeg-static`-Build-Schritt.

**Auf Wunsch des Kunden entfernt.** Kein Video, kein Scroll-Scrub, kein Canvas
mehr. Stattdessen ein ruhiger, einmaliger Auftritt:

- Ein einzelnes Foto (`steildach-eindeckung-vorher.jpeg`, dasselbe Vorher-Bild
  wie im Projekt „Steildach-Eindeckung"), volle Breite, ein Viewport hoch, via
  `astro:assets` `<Image>` mit `fetchpriority="high"` als LCP-Kandidat.
- Ein sehr langsames Heranzoomen des Fotos beim Laden (`@keyframes heroZoom`,
  16 s, läuft einmal).
- Ein wandernder Lichtstreifen über dem Foto (`@keyframes heroGlanz`), per
  `mix-blend-mode: overlay`, wie Licht auf frisch gefalztem Blech.
- Auf Geräten mit Maus (`pointer: fine`) eine kleine Parallaxe: Foto und
  Textblock verschieben sich gegenläufig zum Zeiger, über zwei CSS-Custom-
  Properties (`--zeiger-x`, `--zeiger-y`), die `heroInit.ts` bei `pointermove`
  nachführt. Kein rAF, kein Scroll-Bezug, nur ein Event-Listener.
- Überschrift, Unterzeile und Aktionen blenden beim Laden einmal gestaffelt ein
  (`@keyframes heroEintritt`).
- Ein leiser, auf und ab wippender Scroll-Pfeil unten (`href="#leistungen"`),
  nur ab 40rem Breite sichtbar.

Bei `prefers-reduced-motion: reduce` fallen Zoom, Glanzzug, Parallaxe, Eintritt
und Pfeil komplett weg: die Sektion steht sofort fertig da, keine Übergänge. Ohne
JavaScript bleibt exakt dasselbe Bild stehen, nur ohne Parallaxe.

**Bausteine**

| Datei | Aufgabe |
| --- | --- |
| `src/components/Hero.astro` | Markup, Foto, sämtliche CSS-Animationen |
| `src/scripts/heroInit.ts` | Nur die Parallaxe: `pointermove` → zwei Custom Properties |

`src/scripts/scrollFortschritt.ts` (die rAF-Schleife) wird vom Hero nicht mehr
gebraucht, bleibt aber bestehen: der Dachaufbau-Explorer nutzt sie weiterhin fürs
Pinning seines Schnitts.

**Aus dem Projekt entfernt**, weil ausschliesslich vom Frame-Scrub gebraucht:
`scripts/hero-frames.mjs`, `public/video/`, `public/media/hero/`, das
`npm run frames`-Kommando, die Pakete `ffmpeg-static` und `ffprobe-static`, sowie
der Poster-Preload-Mechanismus (`heroPoster`-Prop) in `Grundlayout.astro`.

---

## 6. Ordnerstruktur

```
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

Alle fünf ursprünglich angelegten Projekte stehen mit echten Vorher-Nachher-Fotos,
dazu ein sechstes: Walmdach im Doppelstehfalz, Flachdachabdichtung,
Gaubenverkleidung und Dachrinne, Steildach-Eindeckung, Fassadenverkleidung der
Gaubenwange. Kein Platzhalter mehr offen. Ein siebtes Projekt braucht nur eine
weitere Markdown-Datei in `src/content/projekte/` und zwei Bilder, am Layoutcode
ändert sich nichts.

### 7.2 Angaben zu den Projekten

Bei allen sechs Projekten fehlt noch mindestens eines von Ort, Bauzeit oder
genauem Material (Titanzink, Aluminium oder Stahl, oder bei der Steildach-
Eindeckung die genaue Ziegelart). Steht jeweils als `[[BESTÄTIGEN: …]]` im
Frontmatter der Markdown-Datei, sieht man auf der Seite selbst aber nicht mehr
an, siehe Abschnitt 7.5.

### 7.3 Leistungen, die noch zu bestätigen sind

Diese standen **nicht** auf der alten Seite und sind ergänzt, weil ein Dachdecker-
und Spenglereibetrieb sie üblicherweise anbietet. `bestaetigt: false` in
`src/data/leistungen.ts` markiert sie weiterhin intern, seit Abschnitt 7.5 zeigt
die Seite selbst dazu aber keinen Hinweis mehr an.

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

### 7.5 Impressum und Datenschutz, und die abgeschaltete Platzhaltermarkierung

Bis Version 2 trugen beide Seiten oben einen rot markierten Warnblock und im Text
rot gestrichelte `[[BESTÄTIGEN: …]]`-Platzhalter, dasselbe galt für die
„Zu bestätigen“-Hinweise auf den Leistungsseiten, den Formspree-Einrichtungs-
Hinweis im Kontaktformular und den Hinweis über der Projektliste. **Auf
ausdrücklichen Wunsch des Kunden entfernt**, weil die Seite jetzt als Vorschau
direkt an den eigenen Kunden rausgeht und die Abstimmung, was noch fehlt,
persönlich läuft statt über sichtbare Warnungen auf der Seite. Betroffen:
`Bestaetigen.astro` (löst `[[BESTÄTIGEN: …]]` seither zu stillem Klartext auf,
ohne Markierung), `.recht__pruefen` in `global.css`, `.pruefen` auf den
Leistungsseiten, `.projekte__hinweis` in `VorherNachher.astro`, `.einrichten` in
`Kontakt.astro`.

**Das ändert nichts an der eigentlichen Anforderung.** Ein unvollständiges
Impressum bleibt abmahnfähig, sobald die Seite echt live geht (nicht nur als
private Vorschau geteilt wird). Die fehlenden Angaben stehen unverändert als
`[[BESTÄTIGEN: …]]` im Quelltext von `impressum.astro` und `datenschutz.astro`,
nur eben ohne visuelle Markierung:

Impressum: Rechtsform, vertretungsberechtigte Person, Registereintrag falls
vorhanden, USt-IdNr. oder Hinweis auf § 19 UStG, zuständige Handwerkskammer und
Betriebsnummer der Handwerksrolle, Berufshaftpflicht, inhaltlich Verantwortlicher.

Datenschutz: Auftragsverarbeitungsverträge mit Vercel und Formspree, Datum der
Freigabe, Aussage zum Datenschutzbeauftragten.

Beide Texte gehören vor dem echten Livegang durch eine Rechts- und
Datenschutzberatung. **Vor diesem Livegang auch prüfen, ob die Platzhalter-
markierung wieder eingeschaltet werden soll**, damit bei der Abnahme nichts
übersehen wird.

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
- Hero als ruhiges Foto mit Parallaxe, Glanzzug und Eintritt, siehe Abschnitt 5.
  Kein Video, kein Scroll-Scrub mehr.
- Vorher-Nachher-Schieber: Maus, Finger, Tastatur, `role="slider"`, sechs Projekte,
  kein Platzhalter mehr offen.
- Kostenrechner mit Aufschlüsselung, Übernahme in Formular und WhatsApp, jetzt
  auf eigener Seite `/kostenrechner`. Startseite zeigt nur noch eine leichte,
  nicht-interaktive Vorschau mit echt berechnetem Beispielwert.
- Projekte ebenso zweistufig: `ProjekteVorschau.astro` auf der Startseite (drei
  stille Fotokarten, kein Skript), voller Vergleich weiterhin auf `/projekte`.
- Dachaufbau-Explorer, Prozess, Sturmschaden, Einsatzgebiet.
- Logo im Header, echtes Firmenlogo statt Platzhalter-Wortmarke. Der Weisspunkt
  der Logodatei ist exakt auf `--color-kalk` gezogen, damit sich kein hellerer
  Kasten vom Seitengrund abhebt.
- **Farbwelt aus dem Logo**, siehe Abschnitt 4: helles Cremeweiss statt
  Bitumenschwarz, Weinrot aus der Wortmarke statt Kupferpatina als Akzent, drei
  bewusst dunkle Kontrastanker (Hero, Sturmschaden, Fusszeile), Streifenband aus
  dem Logo ueber der Fusszeile.
- Kontrast maschinell geprueft: ein Skript geht jeden sichtbaren Textknoten aller
  neun Seiten durch und rechnet ihn gegen seinen tatsaechlich gerenderten
  Hintergrund. Null Unterschreitungen von WCAG AA.
- Unterseiten: `/leistungen`, `/leistungen/[slug]` (9 Stück), `/projekte`,
  `/kostenrechner`, `/impressum`, `/datenschutz`, `/404`.
- `vercel.json`: `cleanUrls: true`, ohne das liefen alle Unterseiten in ein
  404, weil `build.format: 'file'` `*.html`-Dateien statt Ordnern erzeugt.
- Schema.org `RoofingContractor` mit beiden Adressen und Öffnungszeiten,
  `sitemap.xml`, `robots.txt`, Open-Graph-Bild.
- `npm run build` läuft ohne Warnung durch.

**Offen, braucht den Kunden**

- Punkte aus Abschnitt 7 (Fotos, Projektangaben, Leistungen, Preise, Rechtstexte).
  Auf der Seite selbst nicht mehr sichtbar markiert, siehe Abschnitt 7.5.
- `PUBLIC_FORMSPREE_ID` setzen, Abschnitt 8.
- Vor einem echten Livegang: Platzhaltermarkierung wieder einschalten oder auf
  anderem Weg sicherstellen, dass nichts aus Abschnitt 7 übersehen wird.

**Offen, technisch**

- Test auf einem echten iOS-Gerät. Seit der Hero kein Scroll-Scrub mehr ist,
  ist das Risiko klein (kein Pinning, kein Canvas), aber ungeprüft ist ungeprüft.
- Lighthouse auf der Vercel-Preview messen. Lokal geprüft sind Aufbau, Bildformate,
  Schriftauslieferung und JavaScript-Menge.

**Gefixt: Pinning im Dachaufbau-Explorer auf dem Handy**

`body { overflow-x: hidden; }` bricht in Safari (auch iOS) `position: sticky`
auf allen Nachfahren — ein bekannter WebKit-Bug, siehe Kommentar in
`global.css` bei der Regel. Betroffen war ausschliesslich die Buehne des
Dachaufbau-Explorers: die einzige `position: sticky`-Flaeche, die auch unter
62rem Breite aktiv ist (die beiden anderen, in `Leistungen.astro` und
`Kostenrechner.astro`, sitzen hinter einer `min-width: 62rem`-Grenze und
waren nie betroffen). Ohne Pinning scrollte die Buehne in einem Frame durch,
danach blieb nur eine leere Restlaenge des 320vh-Scrollwegs übrig — auf dem
Scroll passierte sichtbar nichts mehr, und nur das Antippen einer Schicht
funktionierte noch.

Fix: `overflow-x: clip` statt `hidden`, per `@supports` progressiv
verbessert (Safari ab Version 16, 2022). Clip schneidet genauso ab, öffnet
aber keine eigene Scrollbox, `position: sticky` bleibt intakt. Auf sehr
altem Safari (< 16) bleibt der Bug bestehen, das ist der Kompromiss.
In Chromium mobil durchgemessen (Buehne bleibt bei `top: 0`, `--spread`
läuft 4 → 16, aktive Schicht wandert bis zur letzten durch); Chromium hatte
den Bug nie, ein echter iOS-Test bleibt offen (siehe Punkt oben).

**Der eigentliche Grund war aber ein zweiter, und der wog schwerer.** Die
Notbremse `(max-height: 700px) and (max-width: 61.99rem)` schaltete das
Pinning und die ganze Scrollsteuerung ab, weil die Buehne in voller Groesse
rund 820 Pixel hoch baut und in kurze Fenster nicht passt. 700 Pixel ist
aber keine Ausnahme, sondern Alltag: ein iPhone SE hat 667, ein 13 mini mit
eingeblendeter Adressleiste rund 693. Auf genau diesen Geraeten passierte
beim Scrollen nichts mehr, es blieb nur das Antippen — der gemeldete
Fehler. Nachgestellt und bestaetigt bei 375×667 und 375×693.

Fix: die Buehne wird auf kurzen Schirmen kompakt statt abgeschaltet. Zwei
Stufen in `DachaufbauExplorer.astro` (`max-height: 800px` und `710px`)
ziehen Innenabstaende, Ueberschrift, Tafelhoehe und den Ausschlag
(`--dehnung`) zurueck; unter 710 Pixel weicht zusaetzlich der Vorspann.
Damit sinkt die noetige Hoehe von 820 auf 585 Pixel. Die Notbremse greift
jetzt erst bei `max-height: 560px`, also im Wesentlichen quer gehaltenen
Telefonen. Gemessen bei 640, 667, 693, 740, 745, 780 und 844 Pixel
Fensterhoehe: ueberall wandern die Schichten beim Scrollen durch, und der
Inhalt bleibt zwischen fixer Kopfzeile und Sticky-Leiste vollstaendig
sichtbar.

---

## 11. Regeln für spätere Änderungen

1. Stammdaten nur in `src/data/betrieb.ts`.
2. Preise nur in `src/data/kalkulation.ts`.
3. Keine Zahl über den Betrieb erfinden. Keine Jahre am Markt, keine
   Mitarbeiterzahl, keine Projektanzahl, keine Bewertungsnoten. Wo gestalterisch
   eine Zahl gebraucht wird: `[[BESTÄTIGEN: …]]`. Die Komponente
   `Bestaetigen.astro` löst das zu Klartext auf, markiert es aber **nicht** mehr
   sichtbar (auf Kundenwunsch abgeschaltet, Abschnitt 7.5). Offene Punkte trotzdem
   immer als `[[BESTÄTIGEN: …]]` schreiben, nie eine Zahl direkt erfinden, nur weil
   sie nicht mehr rot auffällt.
4. Markenrot (`--color-ziegel`) ist der einzige Akzent: Links, aktive Zustände,
   Fokusringe, gefüllte Schaltflächen. `--color-terrakotta` bleibt Flächen und dem
   Streifenband vorbehalten, nie Kleintext. `--color-ziegel-hell` **nur** auf den
   drei dunklen Flächen, auf hellem Grund erreicht es keine 4,5:1.
   Im Dachaufbau-Explorer bleibt Markenrot der aktiven Auswahl vorbehalten, die
   Schichten selbst tragen materialtreue Eigentöne.
5. Neue Bewegung nur mit `prefers-reduced-motion`-Zweig und ohne `scroll`-Listener.
   Ein `pointermove`-Listener wie in `heroInit.ts` ist in Ordnung, ein
   `scroll`-Listener nicht, dafür gibt es `scrollFortschritt.ts`.
6. Keine Ressource von einem fremden Server. Das würde die Datenschutzerklärung
   falsch machen.
7. Texte: Sie-Ansprache, kurze aktive Sätze, keine Superlative ohne Beleg.
