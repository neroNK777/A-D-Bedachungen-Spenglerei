/**
 * Zerlegt das Hero-Video einmalig in zwei WebP-Bildsequenzen (quer + hoch)
 * und schreibt ein manifest.json, das die Laufzeit ohne Verzeichnis-Scan liest.
 *
 * Warum Bildsequenz statt <video> + currentTime:
 * iOS Safari rundet currentTime auf den naechsten Keyframe (Bild springt),
 * Rueckwaerts-Scrubben zwingt den Decoder zurueck zum letzten Keyframe, und
 * iOS entscheidet ueber Videowiedergabe teilweise selbst. Ein 2D-Canvas mit
 * drawImage ist auf jedem Geraet gleich schnell, vorwaerts wie rueckwaerts.
 *
 * Ausfuehren:  npm run frames
 * Das Ergebnis liegt in /public/media/hero/ und ist eingecheckt, damit der
 * Vercel-Build kein ffmpeg braucht.
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ffmpegPath from 'ffmpeg-static';
import ffprobeStatic from 'ffprobe-static';

const wurzel = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const quelle = path.join(wurzel, 'public/video/dachaufbau-zeitraffer.mp4');
const ziel = path.join(wurzel, 'public/media/hero');

/**
 * Das Quellvideo traegt unten rechts ein Generator-Wasserzeichen.
 * delogo interpoliert den Kasten aus seinen Raendern, statt das Bild zu
 * beschneiden - so bleibt der volle Bildausschnitt erhalten.
 */
const DELOGO = 'delogo=x=1124:y=560:w=78:h=76';

const SAETZE = {
  // Querformat: volle Bildbreite, leicht unter Quellaufloesung. Das Canvas
  // deckt per object-cover ab; mehr Pixel als sichtbar kosten nur Bytes.
  quer: {
    breite: 1100,
    vorFilter: DELOGO,
    qualitaet: 50,
  },
  // Hochformat: Mittenzuschnitt auf 3:4. Ein Querformat-Frame in ein
  // Hochformat-Canvas hochskaliert sieht matschig aus, deshalb ein
  // eigener Satz mit eigenem Ausschnitt.
  hoch: {
    breite: 620,
    vorFilter: `${DELOGO},crop=ih*3/4:ih`,
    qualitaet: 50,
  },
};

// Standbilder fuer den Datensparmodus-Fallback: vier Punkte der Sequenz.
const STANDBILD_ANTEILE = [0, 0.34, 0.67, 1];

function run(bin, args) {
  execFileSync(bin, args, { stdio: ['ignore', 'pipe', 'pipe'] });
}

function ordnerFrisch(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
}

function byteSumme(dir) {
  return fs
    .readdirSync(dir)
    .reduce((summe, datei) => summe + fs.statSync(path.join(dir, datei)).size, 0);
}

function masse(datei) {
  const roh = execFileSync(ffprobeStatic.path, [
    '-v', 'error',
    '-select_streams', 'v:0',
    '-show_entries', 'stream=width,height',
    '-of', 'json',
    datei,
  ]).toString();
  const s = JSON.parse(roh).streams[0];
  return { width: s.width, height: s.height };
}

if (!fs.existsSync(quelle)) {
  console.error(`Quellvideo fehlt: ${quelle}`);
  process.exit(1);
}

fs.mkdirSync(ziel, { recursive: true });
const manifest = { erzeugtAus: path.basename(quelle), step: 1, saetze: {} };

for (const [name, cfg] of Object.entries(SAETZE)) {
  const dir = path.join(ziel, name);
  ordnerFrisch(dir);

  console.log(`[${name}] Frames extrahieren ...`);
  run(ffmpegPath, [
    '-y', '-v', 'error',
    '-i', quelle,
    // -vsync 0: exakt ein Ausgabe-Frame pro Eingabe-Frame. Ohne das
    // dedupliziert oder interpoliert ffmpeg und die Bewegung wird ungleich.
    '-vsync', '0',
    '-vf', `${cfg.vorFilter},scale=${cfg.breite}:-2:flags=lanczos`,
    '-c:v', 'libwebp',
    '-quality', String(cfg.qualitaet),
    '-compression_level', '6',
    '-preset', 'photo',
    '-an',
    path.join(dir, 'frame-%04d.webp'),
  ]);

  const dateien = fs.readdirSync(dir).filter((d) => d.endsWith('.webp')).sort();
  const { width, height } = masse(path.join(dir, dateien[0]));
  const bytes = byteSumme(dir);

  manifest.saetze[name] = {
    count: dateien.length,
    width,
    height,
    pattern: `/media/hero/${name}/frame-%04d.webp`,
    bytes,
  };

  // Poster: erster Frame in hoher Qualitaet. Es steht still unter dem Canvas
  // und ist LCP-Kandidat, deshalb hier keine Scrub-Qualitaet.
  console.log(`[${name}] Poster + Standbilder ...`);
  run(ffmpegPath, [
    '-y', '-v', 'error',
    '-i', quelle,
    '-frames:v', '1',
    '-vf', `${cfg.vorFilter},scale=${cfg.breite}:-2:flags=lanczos`,
    '-c:v', 'libwebp', '-quality', '82', '-compression_level', '6', '-preset', 'photo',
    path.join(ziel, `poster-${name}.webp`),
  ]);

  const standbilder = [];
  STANDBILD_ANTEILE.forEach((anteil, i) => {
    const index = Math.max(1, Math.round(anteil * (dateien.length - 1)) + 1);
    const von = path.join(dir, `frame-${String(index).padStart(4, '0')}.webp`);
    const nach = path.join(ziel, `standbild-${name}-${i + 1}.webp`);
    fs.copyFileSync(von, nach);
    standbilder.push(`/media/hero/standbild-${name}-${i + 1}.webp`);
  });

  manifest.saetze[name].poster = `/media/hero/poster-${name}.webp`;
  manifest.saetze[name].standbilder = standbilder;

  console.log(
    `[${name}] ${dateien.length} Frames, ${width}x${height}, ${(bytes / 1e6).toFixed(1)} MB`,
  );
}

// Social-Preview aus einem spaeten Frame (fertiges Dach), 1200x630.
run(ffmpegPath, [
  '-y', '-v', 'error',
  '-i', quelle,
  '-frames:v', '1', '-ss', '9.5',
  '-vf', `${DELOGO},crop=iw:iw*630/1200,scale=1200:630:flags=lanczos`,
  '-q:v', '3',
  path.join(wurzel, 'public/media/og-bild.jpg'),
]);

fs.writeFileSync(path.join(ziel, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
console.log('manifest.json geschrieben.');
