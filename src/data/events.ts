// Live-Events: Formate & Preise basieren auf realen Angeboten der GLAMLOOX Academy.
// Konkrete Termine/Orte sind Demo-Daten für den Prototyp.

const CDN = 'https://cdn.shopify.com/s/files/1/0639/5812/2716/files/';

export interface LiveEvent {
  id: string;
  title: string;
  subtitle: string;
  dateISO: string; // Demo-Termin
  time: string;
  location: string;
  online: boolean;
  price: number;
  priceNote: string;
  seats: string;
  host: string;
  image: string;
  description: string;
  agenda: { time: string; point: string }[];
  realBasis: string; // Hinweis, worauf das Event basiert
}

export const events: LiveEvent[] = [
  {
    id: 'ev-big-korean-webinar',
    title: 'BIG KOREAN Lashlift Webinar',
    subtitle: 'Live online – mit Aufzeichnung',
    dateISO: '2026-12-03',
    time: '19:00 – 20:30 Uhr',
    location: 'Online (Zoom, Link per E-Mail)',
    online: true,
    price: 19,
    priceNote: 'Preis wie im GLAMLOOX Shop',
    seats: 'Noch 38 von 200 Plätzen',
    host: 'GLAMLOOX Academy Team',
    image: CDN + 'BOTMINILEKTIONANALYSE-3.png?width=1200',
    description:
      'Der kompakte Einstieg in den Korean Lash Lift – live und interaktiv. Nach dem Webinar erhältst du die Aufzeichnung sowie die vorgestellte Produkt-Checkliste.',
    agenda: [
      { time: '19:00', point: 'Begrüßung & Einstieg in die Methode' },
      { time: '19:25', point: 'Technik live demonstriert' },
      { time: '20:00', point: 'Produkte & Pad-Auswahl' },
      { time: '20:20', point: 'Offene Q&A-Runde' },
    ],
    realBasis: 'Format & Preis entsprechen dem realen Webinar-Angebot von glamloox.net. Termin ist ein Demo-Datum.',
  },
  {
    id: 'ev-demo-masterclass',
    title: 'Korean Lashlifting Demo Masterclass',
    subtitle: 'Live vor Ort – Kleingruppe mit Praxis',
    dateISO: '2027-01-23',
    time: '10:00 – 17:00 Uhr',
    location: 'Düsseldorf (Studio wird nach Anmeldung mitgeteilt)',
    online: false,
    price: 699,
    priceNote: 'Preis wie im GLAMLOOX Shop',
    seats: 'Noch 4 von 12 Plätzen',
    host: 'GLAMLOOX Academy · Senior Trainerin',
    image: CDN + 'DEMO_MASTERCLASS_korean-2.jpg?width=1200',
    description:
      'Ein kompletter Live-Tag: Demo-Behandlung am Modell mit Erklärung jeder einzelnen Phase, anschließend eigene Praxis-Übungen unter Anleitung. Für Lash Artistinnen mit Grundkenntnissen im Lifting.',
    agenda: [
      { time: '10:00', point: 'Ankommen, Theorie-Refresher' },
      { time: '11:00', point: 'Live-Demo: kompletter Korean Lift' },
      { time: '13:00', point: 'Mittagspause (inkl.)' },
      { time: '14:00', point: 'Praxis-Übungen mit Betreuung' },
      { time: '16:30', point: 'Feedback, Zertifikat, Fotos' },
    ],
    realBasis: 'Format & Preis entsprechen der realen Masterclass von glamloox.net. Termin & Ort sind Demo-Daten.',
  },
  {
    id: 'ev-reanimation-live',
    title: 'REANIMATION DER WIMPERN™ – Live-Seminar',
    subtitle: 'Online-Seminar mit Workbook',
    dateISO: '2027-01-14',
    time: '18:30 – 21:30 Uhr',
    location: 'Online (Link per E-Mail)',
    online: true,
    price: 226.1,
    priceNote: 'Preis wie im GLAMLOOX Shop',
    seats: 'Noch 17 von 60 Plätzen',
    host: 'GLAMLOOX Academy Team',
    image: CDN + 'Set1.jpg?width=1200',
    description:
      'Das Live-Seminar zur Wimpern-Rehabilitation: Diagnostik nach Extensions- und Lifting-Stress, Pflegeprotokolle mit Peptiden und Beratungskompetenz. Inklusive digitalem Workbook.',
    agenda: [
      { time: '18:30', point: 'Wimpern unter dem Mikroskop' },
      { time: '19:15', point: 'Das Reanimations-Protokoll' },
      { time: '20:15', point: 'Fallbeispiele aus dem Studio' },
      { time: '21:00', point: 'Q&A & Workbook' },
    ],
    realBasis: 'Format & Preis basieren auf dem realen Online-Kurs von glamloox.net. Termin ist ein Demo-Datum.',
  },
  {
    id: 'ev-community-meetup',
    title: 'GLAMLOOX Community Meet-up',
    subtitle: 'Netzwerken mit Lash- & Brow-Profis',
    dateISO: '2026-12-12',
    time: '14:00 – 17:00 Uhr',
    location: 'Köln, Beauty Loft Rheinblick',
    online: false,
    price: 0,
    priceNote: 'Kostenlos für Community-Mitglieder',
    seats: 'Noch 21 von 40 Plätzen',
    host: 'GLAMLOOX Community',
    image: CDN + 'Haarband_Glamloox1.png?width=1200',
    description:
      'Lernen, austauschen, wachsen: Beim Meet-up stellen Community-Mitglieder ihre Arbeiten vor, wir zeigen Neuheiten und es gibt Live-Demos an zwei Stationen. Bring gerne dein Portfolio mit!',
    agenda: [
      { time: '14:00', point: 'Ankommen & Begrüßung' },
      { time: '14:30', point: 'Show & Tell: Arbeiten der Community' },
      { time: '15:30', point: 'Live-Demo-Stationen' },
      { time: '16:30', point: 'Networking & Snacks' },
    ],
    realBasis: 'Demo-Event zur Präsentation der Community-Funktionen.',
  },
];

export const formatDate = (iso: string): string => {
  const d = new Date(iso + 'T12:00:00');
  return d.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
};
export const formatDateShort = (iso: string): string => {
  const d = new Date(iso + 'T12:00:00');
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: 'short' });
};
