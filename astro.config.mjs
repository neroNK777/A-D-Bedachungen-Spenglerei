// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://ad-bedachungen.de',
  // Rein statisch. Das Kontaktformular laeuft ueber Formspree, der Rechner
  // vollstaendig im Browser - es gibt nichts, wofuer ein Server noetig waere.
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [
    sitemap({ i18n: { defaultLocale: 'de', locales: { de: 'de-DE' } } }),
    icon({ include: { ph: ['*'] } }),
  ],
  image: {
    // Astro erzeugt AVIF/WebP-Varianten mit sharp zur Buildzeit.
    //
    // Kein responsives Standard-Styling: es setzt height:auto und das
    // Seitenverhaeltnis der Quelle per Attributselektor und ueberschreibt
    // damit die Boxen, in denen die Bilder hier sitzen. Jedes Bild bekommt
    // sein Format und seinen Ausschnitt in der jeweiligen Komponente.
    responsiveStyles: false,
  },
  vite: { plugins: [tailwindcss()] },
});
