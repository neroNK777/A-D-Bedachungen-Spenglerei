/**
 * Bedienung des Dach-Kostenrechners.
 *
 * Rechnet ausschliesslich im Browser. Es geht nichts an einen Server,
 * solange der Nutzer nicht selbst das Kontaktformular absendet.
 * Die Preislogik steht in src/data/kalkulation.ts.
 */
import {
  DACHFORM,
  MATERIAL,
  UMFANG,
  ZUSATZ,
  berechne,
  verfuegbareMaterialien,
  verfuegbareZusatzposten,
  type DachformId,
  type Eingabe,
  type Ergebnis,
  type MaterialId,
  type UmfangId,
  type ZusatzId,
} from '../data/kalkulation';

const euro = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
});
const zahl = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 });

export function starteKostenrechner(): void {
  const wurzel = document.querySelector<HTMLElement>('[data-rechner]');
  if (!wurzel) return;

  const flaecheRegler = wurzel.querySelector<HTMLInputElement>('[data-feld="flaeche"]');
  const flaecheAnzeige = wurzel.querySelector<HTMLElement>('[data-anzeige="flaeche"]');
  const vonAnzeige = wurzel.querySelector<HTMLElement>('[data-anzeige="von"]');
  const bisAnzeige = wurzel.querySelector<HTMLElement>('[data-anzeige="bis"]');
  const postenListe = wurzel.querySelector<HTMLElement>('[data-posten]');
  const hinweisMaterial = wurzel.querySelector<HTMLElement>('[data-hinweis="material"]');
  const zusammenfassung = wurzel.querySelector<HTMLInputElement>('[data-rechner-zusammenfassung]');

  if (!flaecheRegler || !vonAnzeige || !bisAnzeige || !postenListe) return;

  const radios = (name: string) =>
    Array.from(wurzel.querySelectorAll<HTMLInputElement>(`input[name="${name}"]`));

  const gewaehlt = <T extends string>(name: string, standard: T): T =>
    (radios(name).find((r) => r.checked)?.value as T) ?? standard;

  const zusatzBoxen = () =>
    Array.from(wurzel.querySelectorAll<HTMLInputElement>('input[name="zusatz"]'));

  const wenigerBewegung = matchMedia('(prefers-reduced-motion: reduce)');

  // ------------------------------------------------------------------------
  // Anzeige
  // ------------------------------------------------------------------------

  let animation = 0;
  let angezeigt = { von: 0, bis: 0 };

  function schreibeSummen(ziel: { von: number; bis: number }) {
    if (wenigerBewegung.matches) {
      angezeigt = ziel;
      vonAnzeige!.textContent = euro.format(ziel.von);
      bisAnzeige!.textContent = euro.format(ziel.bis);
      return;
    }

    const start = { ...angezeigt };
    const beginn = performance.now();
    const dauer = 480;

    cancelAnimationFrame(animation);
    const schritt = (jetzt: number) => {
      const t = Math.min(1, (jetzt - beginn) / dauer);
      // Exponentielles Ausklingen: schnell los, sanft ankommen.
      const e = 1 - Math.pow(1 - t, 3);
      angezeigt = {
        von: Math.round((start.von + (ziel.von - start.von) * e) / 100) * 100,
        bis: Math.round((start.bis + (ziel.bis - start.bis) * e) / 100) * 100,
      };
      vonAnzeige!.textContent = euro.format(angezeigt.von);
      bisAnzeige!.textContent = euro.format(angezeigt.bis);
      if (t < 1) animation = requestAnimationFrame(schritt);
      else angezeigt = ziel;
    };
    animation = requestAnimationFrame(schritt);
  }

  function schreibePosten(ergebnis: Ergebnis) {
    postenListe!.replaceChildren(
      ...ergebnis.posten.map((p) => {
        const zeile = document.createElement('div');
        zeile.className = 'posten';

        const kopf = document.createElement('div');
        kopf.className = 'posten__kopf';

        const titel = document.createElement('span');
        titel.className = 'posten__titel';
        titel.textContent = p.titel;

        const menge = document.createElement('span');
        menge.className = 'posten__menge';
        menge.textContent = p.menge;

        kopf.append(titel, menge);

        const wert = document.createElement('span');
        wert.className = 'posten__wert zahlen';
        wert.textContent = `${zahl.format(Math.round(p.spanne.von / 100) * 100)} bis ${euro.format(
          Math.round(p.spanne.bis / 100) * 100,
        )}`;

        zeile.append(kopf, wert);
        return zeile;
      }),
    );
  }

  // ------------------------------------------------------------------------
  // Abhaengigkeiten zwischen den Feldern
  // ------------------------------------------------------------------------

  function synchronisiereOptionen(dachform: DachformId): MaterialId {
    const erlaubt = verfuegbareMaterialien(dachform);
    let aktuell = gewaehlt<MaterialId>('material', erlaubt[0]!);

    for (const radio of radios('material')) {
      const id = radio.value as MaterialId;
      const passt = erlaubt.includes(id);
      radio.disabled = !passt;
      radio.closest('label')?.setAttribute('data-deaktiviert', passt ? 'nein' : 'ja');
    }

    // Passt die aktuelle Wahl nicht mehr, auf die erste erlaubte umstellen.
    if (!erlaubt.includes(aktuell)) {
      aktuell = erlaubt[0]!;
      const treffer = radios('material').find((r) => r.value === aktuell);
      if (treffer) treffer.checked = true;
    }

    if (hinweisMaterial) {
      hinweisMaterial.textContent =
        dachform === 'flachdach'
          ? 'Ziegel und Schiefer brauchen Neigung. Auf dem Flachdach stehen sie deshalb nicht zur Wahl.'
          : MATERIAL[aktuell].hinweis;
    }

    const erlaubteZusatz = verfuegbareZusatzposten(dachform);
    for (const box of zusatzBoxen()) {
      const id = box.value as ZusatzId;
      const passt = erlaubteZusatz.includes(id);
      box.disabled = !passt;
      if (!passt) box.checked = false;
      box.closest('label')?.setAttribute('data-deaktiviert', passt ? 'nein' : 'ja');
    }

    return aktuell;
  }

  // ------------------------------------------------------------------------

  function lesen(): Eingabe {
    const dachform = gewaehlt<DachformId>('dachform', 'steildach');
    const material = synchronisiereOptionen(dachform);
    return {
      dachform,
      material,
      umfang: gewaehlt<UmfangId>('umfang', 'neueindeckung'),
      flaeche: Number(flaecheRegler!.value),
      zusatz: zusatzBoxen()
        .filter((b) => b.checked && !b.disabled)
        .map((b) => b.value as ZusatzId),
    };
  }

  function textFassung(eingabe: Eingabe, ergebnis: Ergebnis): string {
    const zusatz = eingabe.zusatz.map((z) => ZUSATZ[z].titel).join(', ');
    return [
      `Schätzung aus dem Kostenrechner: ${euro.format(ergebnis.anzeige.von)} bis ${euro.format(
        ergebnis.anzeige.bis,
      )}`,
      `Dachform: ${DACHFORM[eingabe.dachform].titel}`,
      `Fläche: rund ${eingabe.flaeche} m²`,
      `Material: ${MATERIAL[eingabe.material].titel}`,
      `Umfang: ${UMFANG[eingabe.umfang].titel}`,
      zusatz ? `Zusätzlich: ${zusatz}` : 'Zusätzlich: nichts ausgewählt',
    ].join('\n');
  }

  let letzterText = '';

  function aktualisieren() {
    const eingabe = lesen();
    const ergebnis = berechne(eingabe);

    if (flaecheAnzeige) flaecheAnzeige.textContent = `${eingabe.flaeche} m²`;
    flaecheRegler!.setAttribute('aria-valuetext', `${eingabe.flaeche} Quadratmeter`);

    schreibeSummen(ergebnis.anzeige);
    schreibePosten(ergebnis);

    letzterText = textFassung(eingabe, ergebnis);
    if (zusammenfassung) zusammenfassung.value = letzterText;
    wurzel!.dataset.zusammenfassung = letzterText;
  }

  wurzel.addEventListener('input', aktualisieren);
  wurzel.addEventListener('change', aktualisieren);
  aktualisieren();

  // ------------------------------------------------------------------------
  // Ergebnis in die Anfrage uebernehmen
  // ------------------------------------------------------------------------

  wurzel.querySelector('[data-rechner-uebernehmen]')?.addEventListener('click', () => {
    const nachricht = document.querySelector<HTMLTextAreaElement>('#nachricht');
    const anliegen = document.querySelector<HTMLSelectElement>('#anliegen');

    if (anliegen) {
      const eingabe = lesen();
      const passend =
        eingabe.umfang === 'reparatur'
          ? 'reparatur'
          : eingabe.dachform === 'flachdach'
            ? 'flachdach'
            : 'steildach';
      if (Array.from(anliegen.options).some((o) => o.value === passend)) {
        anliegen.value = passend;
      }
    }

    if (nachricht) {
      const bestand = nachricht.value.trim();
      nachricht.value = bestand ? `${bestand}\n\n${letzterText}` : letzterText;
      nachricht.dispatchEvent(new Event('input', { bubbles: true }));
    }

    document.querySelector('#kontakt')?.scrollIntoView({
      behavior: wenigerBewegung.matches ? 'auto' : 'smooth',
      block: 'start',
    });
    // Fokus nachziehen, damit Tastaturnutzer dort landen, wo es weitergeht.
    window.setTimeout(() => nachricht?.focus({ preventScroll: true }), 600);
  });

  const wa = wurzel.querySelector<HTMLAnchorElement>('[data-rechner-whatsapp]');
  if (wa) {
    const basis = wa.href;
    wurzel.addEventListener('input', () => {
      wa.href = `${basis}?text=${encodeURIComponent(
        `Guten Tag, ich habe Ihren Kostenrechner benutzt.\n\n${letzterText}\n\nKönnen Sie sich das ansehen?`,
      )}`;
    });
    wa.dispatchEvent(new Event('input', { bubbles: true }));
  }
}
