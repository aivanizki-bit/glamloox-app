// Academy-Daten: Kursnamen & Preise sind reale Angebote von glamloox.net (Stand: Nov. 2026).
// Module, Lektionen & Beschreibungen sind kuratierte Demo-Inhalte für den Prototyp.

const CDN = 'https://cdn.shopify.com/s/files/1/0639/5812/2716/files/';

export interface Lesson {
  id: string;
  title: string;
  duration: string; // z. B. "12:40"
  type: 'video' | 'pdf' | 'quiz';
  desc: string;
}
export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}
export interface Course {
  id: string;
  instructor: string;
  audience: string[];
  title: string;
  shortTitle: string;
  subtitle: string;
  price: number;
  level: 'Einsteiger' | 'Fortgeschritten' | 'Profi';
  format: string;
  image: string;
  lessonPoster: string;
  hours: number;
  students: number;
  real: boolean; // true = realer Kurs von glamloox.net
  description: string;
  highlights: string[];
  modules: Module[];
}

export const courses: Course[] = [
  {
    id: 'korean-powder-2',
    instructor: 'Anastasia · GLAMLOOX Academy Head-Trainerin',
    audience: ["Lash Artists mit Lifting-Grundkenntnissen","Studios, die Premium-Lifting positionieren wollen","Trainerinnen, die Korean-Technik weitergeben"],
    title: 'Korean Lash Lift – Powder Technologie 2.0',
    shortTitle: 'Korean Lash Lift Powder 2.0',
    subtitle: 'Premium-Online-Kurs mit Webinar Live-Coaching',
    price: 895,
    level: 'Profi',
    format: 'Online-Kurs · Live-Coaching',
    image: CDN + 'powder_korean_lashlifting_kurs.jpg?width=1200',
    lessonPoster: CDN + 'Korean_Module_1.jpg?width=1200',
    hours: 12,
    students: 1240,
    real: true,
    description:
      'Die koreanische Lash-Lift-Methode im Vergleich zum klassischen Lifting: mehr Schwung, längere Haltbarkeit und ein natürlicherer Look. Du lernst die Powder-Technologie Schritt für Schritt – von der Analyse der Wimpernstruktur bis zum perfekten Finish. Inklusive Live-Coaching-Webinar und Zertifikat.',
    highlights: [
      'Korean Lash Lift vs. klassisches Lifting',
      'Powder-Technologie Schritt für Schritt',
      'Pad-Auswahl & Wimpernanalyse',
      'Live-Coaching-Webinar inklusive',
      'GLAMLOOX Academy Zertifikat',
    ],
    modules: [
      {
        id: 'kp-m1',
        title: 'Grundlagen der Powder-Technologie',
        lessons: [
          { id: 'kp-m1-l1', title: 'Willkommen & Kursüberblick', duration: '04:32', type: 'video', desc: 'So ist der Kurs aufgebaut und was du für den Start brauchst.' },
          { id: 'kp-m1-l2', title: 'Korean Lash Lift vs. klassisches Lifting', duration: '15:48', type: 'video', desc: 'Die wichtigsten Unterschiede in Technik, Haltbarkeit und Ergebnis.' },
          { id: 'kp-m1-l3', title: 'Die Powder-Technologie verstehen', duration: '18:20', type: 'video', desc: 'Wirkweise, Vor- und Nachteile der Pulver-Systeme.' },
          { id: 'kp-m1-l4', title: 'Arbeitsmaterial-Checkliste (PDF)', duration: '2 Seiten', type: 'pdf', desc: 'Alle Produkte & Tools für deinen Korean-Lift-Workspace.' },
        ],
      },
      {
        id: 'kp-m2',
        title: 'Vorbereitung & Pad-Technik',
        lessons: [
          { id: 'kp-m2-l1', title: 'Wimpernanalyse & Kundenberatung', duration: '12:05', type: 'video', desc: 'Welche Wimpernstruktur eignet sich für welche Technik?' },
          { id: 'kp-m2-l2', title: 'Silikonpads richtig auswählen', duration: '14:37', type: 'video', desc: 'Von Teddy bis Topkini: Curl-Wirkung gezielt steuern.' },
          { id: 'kp-m2-l3', title: 'Fixierung ohne Klebereste', duration: '11:52', type: 'video', desc: 'Balm-Glue-Technik für eine saubere Arbeitsfläche.' },
        ],
      },
      {
        id: 'kp-m3',
        title: 'Der Lift in der Praxis',
        lessons: [
          { id: 'kp-m3-l1', title: 'Demo am Modell: kompletter Ablauf', duration: '26:14', type: 'video', desc: 'Vom Cleansing bis zur Pflege – die komplette Behandlung.' },
          { id: 'kp-m3-l2', title: 'Einwirkzeiten & Lotionen', duration: '13:29', type: 'video', desc: 'Step 1–3 richtig timen und kombinieren.' },
          { id: 'kp-m3-l3', title: 'Häufige Fehler & Lösungen', duration: '16:45', type: 'video', desc: 'Overprocessing, unsaubere Ergebnisse, was tun?' },
          { id: 'kp-m3-l4', title: 'Wissenscheck: Module 1–3', duration: '8 Fragen', type: 'quiz', desc: 'Teste dein Wissen vor der Abschlussdemo.' },
        ],
      },
      {
        id: 'kp-m4',
        title: 'Abschluss & Business',
        lessons: [
          { id: 'kp-m4-l1', title: 'Aftercare & Ergebnis pflegen', duration: '09:18', type: 'video', desc: 'So hält das Ergebnis länger – inkl. Booster-Empfehlung.' },
          { id: 'kp-m4-l2', title: 'Preisgestaltung & Angebot im Studio', duration: '11:40', type: 'video', desc: 'Der Korean Lift als Premium-Behandlung positionieren.' },
          { id: 'kp-m4-l3', title: 'Live-Coaching-Webinar & Zertifikat', duration: '90:00', type: 'video', desc: 'Finale Q&A-Session mit der GLAMLOOX Academy.' },
        ],
      },
    ],
  },
  {
    id: 'reanimation',
    instructor: 'GLAMLOOX Academy Team · Pflege-Experten',
    audience: ["Lash Artists nach Extensions- oder Lifting-Stress","Studios mit Aftercare-Fokus","Alle, die Booster-Protokolle professionell nutzen"],
    title: 'REANIMATION DER WIMPERN™',
    shortTitle: 'Reanimation der Wimpern™',
    subtitle: 'Der Online-Kurs für gesunde Wimpern nach Stress',
    price: 226.1,
    level: 'Fortgeschritten',
    format: 'Online-Kurs',
    image: CDN + 'BOTMINILEKTIONANALYSE-3.png?width=1200',
    lessonPoster: CDN + 'Set1.jpg?width=1200',
    hours: 5,
    students: 860,
    real: true,
    description:
      'Wimpern nach Extensions, Lifting-Stress oder Überbeanspruchung gezielt aufbauen: Analyse der Wimpernstruktur, Pflegeprotokolle mit Peptiden und die richtige Beratung deiner Kundinnen – für sichtbar gesündere, kräftigere Wimpern.',
    highlights: [
      'Wimperndiagnostik nach Stress',
      'Pflegeprotokolle mit Peptiden',
      'Booster richtig einsetzen',
      'Kundenberatung & Nachsorge',
    ],
    modules: [
      {
        id: 're-m1',
        title: 'Diagnostik & Grundlagen',
        lessons: [
          { id: 're-m1-l1', title: 'Warum Wimpern leiden', duration: '08:26', type: 'video', desc: 'Extensions, Lifting, Styling – Stressfaktoren verstehen.' },
          { id: 're-m1-l2', title: 'Die Wimpernanalyse', duration: '12:11', type: 'video', desc: 'Zyklen, Dichte und Schadensbild richtig einordnen.' },
        ],
      },
      {
        id: 're-m2',
        title: 'Das Reanimations-Protokoll',
        lessons: [
          { id: 're-m2-l1', title: 'Pflegeplan mit Peptiden', duration: '14:03', type: 'video', desc: 'Wirkstoffe, Anwendungsdauer und Erwartungsmanagement.' },
          { id: 're-m2-l2', title: 'Lash & Brow Booster im Einsatz', duration: '10:47', type: 'video', desc: 'Hormonfreie Seren in der professionellen Nachsorge.' },
          { id: 're-m2-l3', title: 'Begleitende Behandlungen', duration: '09:32', type: 'video', desc: 'Was den Aufbau unterstützt – und was man vermeidet.' },
        ],
      },
      {
        id: 're-m3',
        title: 'Beratung & Abschluss',
        lessons: [
          { id: 're-m3-l1', title: 'Das Beratungsgespräch', duration: '11:24', type: 'video', desc: 'Realistische Ergebnisse kommunizieren.' },
          { id: 're-m3-l2', title: 'Zertifikatsprüfung', duration: '10 Fragen', type: 'quiz', desc: 'Absolviere die Prüfung und erhalte dein Zertifikat.' },
        ],
      },
    ],
  },
  {
    id: 'korean-demo-masterclass',
    instructor: 'GLAMLOOX Senior Trainerin',
    audience: ["Lash Artists mit Lifting-Basis","Visuelle Lerner, die Live-Demos brauchen","Kleingruppen-Fans (max. 12 Plätze)"],
    title: 'Korean Lashlifting Demo Masterclass',
    shortTitle: 'Demo Masterclass',
    subtitle: 'Live-Demo-Tag mit Modellbehandlung',
    price: 699,
    level: 'Profi',
    format: 'Live vor Ort · Kleingruppe',
    image: CDN + 'DEMO_MASTERCLASS_korean-2.jpg?width=1200',
    lessonPoster: CDN + 'schweit_demo_masterclass.jpg?width=1200',
    hours: 6,
    students: 96,
    real: true,
    description:
      'Ein intensiver Live-Tag: Du siehst die komplette Korean-Lashlifting-Behandlung am Modell – Vorbereitung, Arbeitstechnik im Detail und Nachbesprechung. Inklusive Praxis-Übungen unter Anleitung und Tipps aus dem Alltag eines Profi-Studios.',
    highlights: [
      'Komplette Demo am Modell',
      'Kleingruppe mit persönlicher Betreuung',
      'Praxis-Übungen inklusive',
      'Teilnahme-Bestätigung der Academy',
    ],
    modules: [
      {
        id: 'dm-m1',
        title: 'Vorbereitung',
        lessons: [
          { id: 'dm-m1-l1', title: 'Bilder & Vorher-Dokumentation', duration: '06:54', type: 'video', desc: 'Warum Vorher-Fotos dein wichtigstes Tool sind.' },
          { id: 'dm-m1-l2', title: 'Arbeitsplatz-Setup', duration: '08:15', type: 'video', desc: 'Hygiene, Material, Ergonomie.' },
        ],
      },
      {
        id: 'dm-m2',
        title: 'Die Live-Demo',
        lessons: [
          { id: 'dm-m2-l1', title: 'Schwungarbeit am Modell', duration: '21:38', type: 'video', desc: 'Die Kern-Technik in Nahaufnahme.' },
          { id: 'dm-m2-l2', title: 'Details, Übergänge, Finish', duration: '17:26', type: 'video', desc: 'Woran man Profi-Arbeit erkennt.' },
        ],
      },
    ],
  },
  {
    id: 'big-korean-webinar',
    instructor: 'GLAMLOOX Academy Team',
    audience: ["Einsteigerinnen ohne Vorkenntnisse","Teams, die vorab Schnuppern wollen","Alle mit Fragen zum Korean Lash Lift"],
    title: 'BIG KOREAN Lashlift Webinar',
    shortTitle: 'Big Korean Webinar',
    subtitle: 'Live online – mit Aufzeichnung',
    price: 19,
    level: 'Einsteiger',
    format: 'Webinar · Live + Aufzeichnung',
    image: CDN + 'BOTMINILEKTIONANALYSE-3.png?width=1200',
    lessonPoster: CDN + 'bilder_vorbereitung.png?width=1200',
    hours: 2,
    students: 2130,
    real: true,
    description:
      'Der kompakte Einstieg in den Korean Lash Lift: In 90 Minuten zeigen wir dir die Methode, die Technik und die wichtigsten Produkte – live und mit Raum für deine Fragen. Du erhältst Zugriff auf die Aufzeichnung.',
    highlights: [
      '90 Minuten live dabei',
      'Aufzeichnung inklusive',
      'Q&A mit der Academy',
      'Idealer Einstieg in die Methode',
    ],
    modules: [
      {
        id: 'bw-m1',
        title: 'Webinar-Inhalte',
        lessons: [
          { id: 'bw-m1-l1', title: 'Was ist der Korean Lash Lift?', duration: '24:10', type: 'video', desc: 'Methode, Vorteile, Abgrenzung zum klassischen Lift.' },
          { id: 'bw-m1-l2', title: 'Produkt- & Pad-Übersicht', duration: '31:42', type: 'video', desc: 'Welche Systemsysteme und Pads sich eignen.' },
          { id: 'bw-m1-l3', title: 'Live Q&A Session', duration: '28:08', type: 'video', desc: 'Antworten auf die häufigsten Fragen.' },
        ],
      },
    ],
  },
];

export const totalLessons = (c: Course) => c.modules.reduce((n, m) => n + m.lessons.length, 0);
export const allLessonIds = (c: Course) => c.modules.flatMap((m) => m.lessons.map((l) => l.id));
