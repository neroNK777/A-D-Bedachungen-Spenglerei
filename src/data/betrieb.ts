/**
 * Stammdaten des Betriebs. Einzige Quelle der Wahrheit - Kopfzeile, Fusszeile,
 * Kontakt, Impressum und das Schema.org-Markup lesen alle hier.
 *
 * Alles in dieser Datei ist vom Kunden bestaetigt, ausser was ausdruecklich
 * mit BESTAETIGEN markiert ist.
 */

export const betrieb = {
  name: 'A&D Bedachungen und Spenglerei',
  kurzname: 'A&D Bedachungen',

  telefon: {
    anzeige: '+49 163 9011330',
    waehlbar: '+491639011330',
  },

  /** WhatsApp nutzt dieselbe Nummer, ohne Plus und ohne Leerzeichen. */
  whatsapp: '491639011330',

  email: 'info@ad-bedachungen.com',
  emailZweit: 'ad.baudienstleistungen24@gmail.com',

  instagram: 'https://www.instagram.com/ad_bedachungen/',

  standorte: [
    {
      rolle: 'Büro',
      strasse: 'St.-Lukas-Straße 69',
      plz: '86169',
      ort: 'Augsburg',
      /** Ungefaehre Lage fuer die Radiusdarstellung. Keine Kartendaten Dritter. */
      geo: { lat: 48.3897, lon: 10.9414 },
    },
    {
      rolle: 'Werkstatt',
      strasse: 'Sielenbacher Str. 5',
      plz: '86453',
      ort: 'Dasing',
      geo: { lat: 48.3897, lon: 11.0561 },
    },
  ],

  /** Vom Kunden bestaetigt: Montag bis Freitag, 7 bis 17 Uhr. */
  oeffnungszeiten: {
    tage: ['Mo', 'Di', 'Mi', 'Do', 'Fr'],
    von: '07:00',
    bis: '17:00',
    anzeige: 'Montag bis Freitag, 7 bis 17 Uhr',
    /** Schema.org-Notation. */
    schema: ['Mo', 'Tu', 'We', 'Th', 'Fr'],
  },
} as const;

/** Vorgefertigter WhatsApp-Link mit optionalem Text. */
export function whatsappLink(text?: string): string {
  const basis = `https://wa.me/${betrieb.whatsapp}`;
  return text ? `${basis}?text=${encodeURIComponent(text)}` : basis;
}

export const telLink = `tel:${betrieb.telefon.waehlbar}`;
export const mailLink = `mailto:${betrieb.email}`;
