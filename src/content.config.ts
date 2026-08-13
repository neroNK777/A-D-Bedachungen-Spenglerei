import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Projekte fuer die Vorher-Nachher-Sektion.
 *
 * Ein fuenftes und sechstes Projekt braucht nur eine weitere Markdown-Datei
 * in src/content/projekte/ und zwei Bilder in src/assets/projekte/.
 * Am Layoutcode ist dafuer nichts zu aendern.
 *
 * Fehlen die Bilder noch, bleiben `vorher` und `nachher` einfach weg. Die
 * Sektion zeigt dann einen deutlich als solchen erkennbaren Platzhalter.
 */
const projekte = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projekte' }),
  schema: ({ image }) =>
    z.object({
      titel: z.string(),
      /** Reihenfolge auf der Startseite, aufsteigend. */
      reihenfolge: z.number(),
      ort: z.string(),
      art: z.string(),
      material: z.string(),
      dauer: z.string(),
      /** Ein Satz: was war das Problem, was ist jetzt geloest. */
      problem: z.string(),
      vorher: image().optional(),
      nachher: image().optional(),
      vorherAlt: z.string(),
      nachherAlt: z.string(),
      /** Auf der Startseite zeigen wir die ersten vier. */
      startseite: z.boolean().default(true),
    }),
});

export const collections = { projekte };
