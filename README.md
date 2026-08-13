# A&D Bedachungen und Spenglerei

Website des Dachdecker- und Spenglereibetriebs A&D Bedachungen und Spenglerei,
Augsburg und Dasing.

Astro 5, Tailwind CSS v4, TypeScript. Statischer Build, Deployment auf Vercel.

## Befehle

```bash
npm install
npm run dev      # Entwicklungsserver
npm run build    # Produktionsbuild nach dist/
npm run preview  # Produktionsbuild lokal ansehen
npm run frames   # Hero-Video neu in Bildsequenzen zerlegen (nur nach Videowechsel)
```

## Vor dem Livegang

1. `PUBLIC_FORMSPREE_ID` in den Vercel-Umgebungsvariablen setzen, sonst schickt das
   Kontaktformular nichts ab. Anleitung: `CLAUDE.md`, Abschnitt 8.
2. Impressum und Datenschutzerklärung vervollständigen. Beide Seiten zeigen die
   fehlenden Angaben rot markiert an. Ein unvollständiges Impressum ist abmahnfähig.
3. Die offenen Punkte aus `CLAUDE.md`, Abschnitt 7, abarbeiten.

## Wo was steht

- `CLAUDE.md` — Projektkontext, Designtokens, Kundendaten, offene Punkte
- `NOTIZEN.md` — was gestalterisch probiert und verworfen wurde
- `src/data/betrieb.ts` — Stammdaten des Betriebs, einzige Quelle
- `src/data/kalkulation.ts` — Preislogik des Kostenrechners
- `src/content/projekte/` — Projekte, eine Markdown-Datei je Projekt
