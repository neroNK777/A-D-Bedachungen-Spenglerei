# Gestaltungsnotizen

Was probiert und wieder verworfen wurde, damit spätere Sessions nicht dieselben
Runden drehen.

---

## Die drei verbotenen Muster

Der Auftrag nennt drei ausgelatschte KI-Muster. Zur Kontrolle hier, was stattdessen
passiert ist:

| Verbotenes Muster | Warum es nahegelegen hätte | Was stattdessen kam |
| --- | --- | --- |
| Creme + Serifen-Display + Terrakotta | Handwerk, Ziegel, Bodenständigkeit: das ist der Reflex für jedes Handwerkerbriefing | Bitumenschwarz mit Kupferpatina. Ziegelrot existiert, aber nur als Notfallsignal, nicht als Grundakzent |
| Fast-Schwarz + Neonakzent | Die Seite ist dunkel, der Schritt zu Neongrün wäre klein | Patina ist mit 42 Prozent Sättigung eine Materialfarbe, kein Leuchtmittel. Kein einziger Glow, keine `box-shadow` in Akzentfarbe ausser am Falzwerkzeug |
| Broadsheet, Haarlinien, Radius null | Präzision und Technik legen es nahe | Radius 3 px durchgehend, Trennlinien nur, wo sie etwas trennen, und eine gestreckte Grotesk statt einer Redaktionsserife |

---

## Verworfen

### Isometrische Explosionszeichnung für den Dachaufbau

Erste Idee: die acht Schichten in 3D auffächern, `rotateX(58deg) rotateZ(-38deg)`.
Sah nach Produktrendering aus, nicht nach Handwerk, und die Beschriftung wäre bei
gedrehten Ebenen entweder schief oder unlesbar gewesen. Ein **Schnitt** ist das, was
ein Dachdecker tatsächlich zeichnet, wenn er einem Bauherrn den Aufbau erklärt.
Ausserdem billiger zu rendern und ohne 3D-Rechnerei responsiv.

### Materialwähler als eigene Sektion

Stand als Option im Auftrag. Verworfen, weil er sich mit dem Kostenrechner
überschnitten hätte: dort wird das Material ohnehin gewählt, und die Angaben
(Lebensdauer, Preisniveau) sind dort am Auswahlpunkt nützlicher als in einer
Extrasektion. Lebensdauer steht jetzt direkt an der Materialwahl im Rechner. Lieber
vier Interaktionen, die sitzen, als fünf, die sich gegenseitig wiederholen.

### Alternierendes Zickzack bei den Projekten

Bild links / Text rechts, dann umgekehrt. Bei vier Projekten wären das vier
Wechsel gewesen, das liest sich als Füllmaterial. Jetzt liegen alle vier gleich
aufgebaut untereinander, Schieber über die volle Breite, Daten darunter. Eine Liste
gleichartiger Dinge darf gleich aussehen.

### Drei gleiche Leistungskarten

Der Standardgriff. Neun Leistungen als Karten wären ein Raster aus neun identischen
Kästen geworden. Jetzt: zwei fachliche Gruppen (Dachdeckerei, Spenglerei) mit
ungleich breiten Spalten und einem echten Foto als dritter, schmalerer Spalte.
Sturmschaden ist aus der Liste heraus und hat eine eigene Sektion, weil er
Notfallcharakter hat.

### Eingebettete Karte im Einsatzgebiet

Google Maps hätte eine Einwilligung gebraucht, eine Zwei-Klick-Lösung wäre eine
graue Fläche mit Knopf gewesen. Die Frage des Besuchers lautet ohnehin nicht "wo
liegt Augsburg", sondern "kommen die zu mir". Deshalb eine gerechnete
Radiusdarstellung: echte Entfernungen, echte Himmelsrichtungen, drei Ringe, daneben
dieselben Orte als Liste für alle, die kein SVG lesen wollen.

### Textpräfix an jeder Platzhaltermarke

Erste Fassung schrieb `ZU BESTÄTIGEN:` vor jeden Platzhalter. Bei vier Feldern pro
Projekt mal vier Projekten war die Sektion zugekleistert und man sah das Layout
nicht mehr. Jetzt: gestrichelter Rahmen in Ziegelrot, dazu **ein** Hinweis über der
Liste. Genauso auffindbar, ohne die Gestaltung zu ersticken.

### 16:11 und 3:2 für den Vorher-Nachher-Schieber

Beide Formate haben genau das Dach weggeschnitten. Die gelieferten Fotos sind
nahezu quadratisch, das Dach liegt in der unteren Bildhälfte. Ein breites Fenster
lässt vom Quadrat nur den mittleren Streifen übrig, und der ist Himmel. Jetzt 4:3
mit `object-position: center 88%` und maximal 54 rem breit, damit ein Vergleich auf
dem Schreibtisch ganz ins Fenster passt.

---

## Fallen, die Zeit gekostet haben

### Astros responsive Bildstile überschreiben die eigene Box

`image.responsiveStyles: true` setzt per Attributselektor `height: auto` und das
Seitenverhältnis der Quelle. Das gewinnt gegen eigene Klassen und macht jede Box mit
festem Format kaputt: das Bild wird höher als der Rahmen und oben abgeschnitten,
`object-position` läuft ins Leere. Jetzt `responsiveStyles: false`, jedes Bild
bekommt sein Format in der Komponente.

### Gitterzeile ohne feste Höhe

`display: grid` mit einer Fläche, `aspect-ratio` auf dem Container und `height: 100%`
auf den Kindern: die Zeile richtet sich nach dem Eigenformat des Bildes, `height:
100%` wird zirkulär und fällt auf `auto` zurück. Das Kind wird höher als der
Container und `overflow: hidden` schneidet oben ab, statt dass `object-fit` greift.
Betraf den Vergleichsschieber sichtbar und den Hero unbemerkt. Heilmittel:
`grid-template-rows: 100%`.

### `.abschnitt` auf einer Sticky-Sektion

Der Dachaufbau-Explorer trug die allgemeine Sektionsklasse mit bis zu 144 px
Aussenabstand. Dadurch begann die Strecke erst 144 px tiefer, die Bühne rastete spät
am Fensterrand ein und der Text stand halb unter der Kante. Sticky-Sektionen tragen
ihren Abstand selbst, in der Bühne.

### Der Hero passt nicht überall

Bei 360 × 640 fasst ein gepinnter Dachaufbau die Erklärung nicht mehr, egal wie eng
man setzt. Statt Schrift kaputtzuschrumpfen: unter `max-height: 700px` und schmal
läuft die Sektion normal mit, der Aufbau liegt von Anfang an offen, erkunden geht
weiter per Tipp. Dieselbe Abfrage steht im CSS und im Skript.

---

## Bewusste Entscheidungen, die wie Fehler aussehen könnten

- **Kein `<video>` im Hero.** Der allgemeine Auftrag verlangt eines, die
  Tutorial-Datei verbietet es. Laut Auftrag gewinnt die Tutorial-Datei. Steht in
  CLAUDE.md, Abschnitt 5, zum Gegenlesen.
- **Nur dunkel, kein Umschalter.** Das Material ist anthrazitfarbenes Blech gegen
  Himmel. Eine helle Variante hätte die beiden Fotos und den Zeitraffer zu
  Briefmarken gemacht.
- **Nummern in der Prozess-Timeline.** Sonst sind Abschnittsnummern Deko. Hier
  existiert die Reihenfolge wirklich: Schritt 4 ohne Schritt 3 gibt es nicht.
- **`aria-hidden` auf der Erklärtafel des Dachaufbaus.** Der Scroll wechselt die
  Schicht bis zu achtmal. Als Live-Region hätte das jede Vorlesehilfe zugetextet.
  Der vollständige Text hängt stattdessen an der jeweiligen Schaltfläche, wo er beim
  Durchtabben genau einmal vorgelesen wird.
- **Beschriftungen im Vergleichsschieber liegen auf dem Bild.** Sonst ein Tell, hier
  Bedienelement: sie sagen, welche Hälfte welche ist, und müssen deshalb an der
  Trennkante sitzen.
