/**
 * Kontaktformular.
 *
 * Ohne JavaScript sendet das Formular ganz normal per POST an Formspree und
 * landet auf deren Dankeseite. Mit JavaScript bleibt der Nutzer auf der
 * Seite und bekommt Fehler dort, wo sie entstanden sind.
 */

const MELDUNGEN: Record<string, string> = {
  valueMissing: 'Bitte ausfüllen.',
  typeMismatch: 'Bitte prüfen Sie die Schreibweise.',
  tooShort: 'Das ist zu kurz.',
  patternMismatch: 'Bitte prüfen Sie die Schreibweise.',
};

const FELD_MELDUNGEN: Record<string, Partial<Record<string, string>>> = {
  name: { valueMissing: 'Bitte tragen Sie Ihren Namen ein.' },
  telefon: { valueMissing: 'Ohne Telefonnummer können wir nicht zurückrufen.' },
  email: {
    valueMissing: 'Bitte tragen Sie eine E-Mail-Adresse ein.',
    typeMismatch: 'Diese E-Mail-Adresse sieht nicht vollständig aus. Fehlt das @?',
  },
  nachricht: { valueMissing: 'Schreiben Sie kurz, worum es geht.' },
  datenschutz: { valueMissing: 'Ohne diese Zustimmung dürfen wir Ihre Daten nicht verarbeiten.' },
};

export function starteKontakt(): void {
  const formular = document.querySelector<HTMLFormElement>('[data-kontakt]');
  if (!formular) return;

  const status = formular.querySelector<HTMLElement>('[data-kontakt-status]');
  const knopf = formular.querySelector<HTMLButtonElement>('[data-kontakt-senden]');
  const ziel = formular.getAttribute('action') ?? '';
  // Formspree ist noch nicht eingetragen: dann lieber gar nicht abschicken,
  // als die Anfrage ins Leere laufen zu lassen.
  const eingerichtet = !ziel.includes('FORMULAR-ID');

  formular.setAttribute('novalidate', '');

  const felder = Array.from(
    formular.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
      'input[name], textarea[name], select[name]',
    ),
  ).filter((f) => f.type !== 'hidden' && f.name !== 'firmenname');

  function fehlerFeld(feld: HTMLElement): HTMLElement | null {
    return formular!.querySelector(`[data-fehler="${feld.getAttribute('name')}"]`);
  }

  function meldung(feld: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement): string {
    const v = feld.validity;
    const eigen = FELD_MELDUNGEN[feld.name] ?? {};
    for (const schluessel of Object.keys(MELDUNGEN)) {
      if (v[schluessel as keyof ValidityState]) {
        return eigen[schluessel] ?? MELDUNGEN[schluessel]!;
      }
    }
    return 'Bitte prüfen Sie diese Angabe.';
  }

  function pruefe(feld: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement): boolean {
    const anzeige = fehlerFeld(feld);
    if (feld.checkValidity()) {
      feld.setAttribute('aria-invalid', 'false');
      if (anzeige) anzeige.textContent = '';
      return true;
    }
    feld.setAttribute('aria-invalid', 'true');
    if (anzeige) anzeige.textContent = meldung(feld);
    return false;
  }

  for (const feld of felder) {
    // Erst nach dem Verlassen meckern, danach beim Tippen sofort korrigieren.
    feld.addEventListener('blur', () => pruefe(feld));
    feld.addEventListener('input', () => {
      if (feld.getAttribute('aria-invalid') === 'true') pruefe(feld);
    });
  }

  function setzeStatus(art: 'nichts' | 'laeuft' | 'fehler' | 'fertig', text = '') {
    if (!status) return;
    status.dataset.art = art;
    status.textContent = text;
    status.hidden = art === 'nichts';
  }

  formular.addEventListener('submit', async (e) => {
    e.preventDefault();

    const ungueltig = felder.filter((f) => !pruefe(f));
    if (ungueltig.length > 0) {
      setzeStatus(
        'fehler',
        ungueltig.length === 1
          ? 'Ein Feld fehlt noch. Es ist unten rot markiert.'
          : `${ungueltig.length} Felder fehlen noch. Sie sind unten rot markiert.`,
      );
      ungueltig[0]!.focus();
      return;
    }

    if (!eingerichtet) {
      setzeStatus(
        'fehler',
        'Der Formularversand ist noch nicht eingerichtet. Bitte rufen Sie an oder schreiben Sie per WhatsApp.',
      );
      return;
    }

    setzeStatus('laeuft', 'Wird gesendet ...');
    if (knopf) knopf.disabled = true;

    try {
      const antwort = await fetch(ziel, {
        method: 'POST',
        body: new FormData(formular),
        headers: { Accept: 'application/json' },
      });

      if (antwort.ok) {
        formular.reset();
        setzeStatus(
          'fertig',
          'Ihre Anfrage ist angekommen. Wir melden uns, in der Regel am nächsten Werktag.',
        );
        status?.focus();
      } else {
        const daten = (await antwort.json().catch(() => null)) as
          | { errors?: { message?: string }[] }
          | null;
        setzeStatus(
          'fehler',
          daten?.errors?.[0]?.message ??
            'Das Absenden hat nicht geklappt. Bitte versuchen Sie es noch einmal oder rufen Sie an.',
        );
      }
    } catch {
      setzeStatus(
        'fehler',
        'Keine Verbindung zum Server. Prüfen Sie Ihre Internetverbindung, oder rufen Sie uns an.',
      );
    } finally {
      if (knopf) knopf.disabled = false;
    }
  });

  // Dateiname anzeigen, sobald ein Foto gewaehlt wurde.
  const datei = formular.querySelector<HTMLInputElement>('#foto');
  const dateiName = formular.querySelector<HTMLElement>('[data-dateiname]');
  datei?.addEventListener('change', () => {
    if (!dateiName) return;
    const anzahl = datei.files?.length ?? 0;
    dateiName.textContent =
      anzahl === 0
        ? ''
        : anzahl === 1
          ? datei.files![0]!.name
          : `${anzahl} Dateien ausgewählt`;
  });
}
