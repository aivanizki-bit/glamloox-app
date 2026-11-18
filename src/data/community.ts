// Community-Demo-Daten: Beiträge, Autorinnen & Interaktionen sind Beispieldaten für den Prototyp.
// Verwendete Bilder sind Original-Bilder von glamloox.net (Produkte & Academy).

const CDN = 'https://cdn.shopify.com/s/files/1/0639/5812/2716/files/';

export interface Member {
  id: string;
  name: string;
  role: string;
  studio: string;
  city: string;
  joined: string;
  followers: number;
  postsCount: number;
  gradient: string; // Avatar-Gradient (CSS)
  bio: string;
  skills: string[];
}

export interface Comment {
  id: string;
  authorId: string;
  text: string;
  ago: string;
}

export interface Post {
  id: string;
  authorId: string;
  type: 'ergebnis' | 'frage' | 'tipp';
  title?: string;
  text: string;
  images: string[];
  ago: string;
  likes: number;
  comments: Comment[];
  productHandle?: string;
  tag?: string;
}

export const members: Member[] = [
  {
    id: 'm-lena',
    name: 'Lena Meier',
    role: 'Lash Artist & Studio-Ownerin',
    studio: 'Lash Lounge Lena',
    city: 'Köln',
    joined: 'März 2024',
    followers: 412,
    postsCount: 23,
    gradient: 'linear-gradient(135deg, #2E5BF0, #7A96F8)',
    bio: 'Alles über natürliche Lashes & gesunde Wimpern. Korean-Lift-Fan seit Tag 1. 💙',
    skills: ['Korean Lash Lift', 'Brow Lifting', 'Booster-Beratung'],
  },
  {
    id: 'm-jules',
    name: 'Jules Berger',
    role: 'Brow Specialist',
    studio: 'Brow Atelier Jules',
    city: 'München',
    joined: 'Juni 2024',
    followers: 387,
    postsCount: 31,
    gradient: 'linear-gradient(135deg, #1C3193, #4C6EF5)',
    bio: 'Brauen sind mein Leben. Waxing, Tinting, Lamination – im Atelier und hier in der Community.',
    skills: ['Brow Waxing', 'Brow Tint', 'Styling'],
  },
  {
    id: 'm-aylin',
    name: 'Aylin Kaya',
    role: 'Lash Trainerin',
    studio: 'Studio Kaya',
    city: 'Berlin',
    joined: 'Januar 2024',
    followers: 655,
    postsCount: 42,
    gradient: 'linear-gradient(135deg, #14267A, #A3BAFC)',
    bio: 'Ich bringe Lash-Anfängerinnen auf Profi-Niveau. Tippt gerne in der Fragerunde. 🙌',
    skills: ['Lash Lifting', 'Schulungen', 'Hygiene'],
  },
  {
    id: 'm-marie',
    name: 'Marie Sommer',
    role: 'Beauty Content Creatorin',
    studio: 'Eigenes Studio',
    city: 'Hamburg',
    joined: 'September 2024',
    followers: 289,
    postsCount: 17,
    gradient: 'linear-gradient(135deg, #0A1E5A, #2E5BF0)',
    bio: 'Vorher-Nachher ist meine Sprache. Ich dokumentiere jeden Booster-Fortschritt.',
    skills: ['Content', 'Booster-Kuren', 'Fotografie'],
  },
  {
    id: 'm-sophie',
    name: 'Sophie Wagner',
    role: 'Lash & Brow Artist',
    studio: 'Glow Room Sophie',
    city: 'Stuttgart',
    joined: 'Mai 2025',
    followers: 154,
    postsCount: 9,
    gradient: 'linear-gradient(135deg, #1D38B8, #C5D6FE)',
    bio: 'Neu im Business, aber mit viel Herz dabei. Lerne jeden Tag dazu.',
    skills: ['Klassisches Lifting', 'Undereye-Pads-Fan'],
  },
];

export const memberById = (id: string): Member =>
  members.find((m) => m.id === id) ?? members[0];

export const posts: Post[] = [
  {
    id: 'p1',
    authorId: 'm-marie',
    type: 'ergebnis',
    title: '8 Wochen Lash-Booster-Kur – der Unterschied',
    text: 'Meine Kundin hat 8 Wochen lang konsequent den LASH BOOSTER genutzt, dazwischen eine Lift-Pause. Das Vorher-Nachher spricht für sich – und das ganz ohne Hormone. 💙',
    images: [CDN + 'Vorher_Nachher_1.jpg?width=900', CDN + 'Vorher_Nachher_6.jpg?width=900'],
    ago: 'vor 2 Std.',
    likes: 84,
    productHandle: 'wimpernserum-4ml',
    tag: 'Vorher · Nachher',
    comments: [
      { id: 'c1', authorId: 'm-sophie', text: 'Wow, das Ergebnis! Ab wann hast du die erste Verbesserung gesehen?', ago: 'vor 1 Std.' },
      { id: 'c2', authorId: 'm-marie', text: 'Bei ihr nach ca. 4 Wochen – Foto folgt in Woche 12! 😍', ago: 'vor 45 Min.' },
    ],
  },
  {
    id: 'p2',
    authorId: 'm-aylin',
    type: 'tipp',
    title: 'Mein Pad-Trick für sehr feine Wimpern',
    text: 'Feine, kurze Wimpern kleben gern ab. Ich kombiniere die TEDDY Pads (Ultra Sticky) mit einem Hauch Balm Glue am inneren Eck – hält perfekt, ohne dass Haare ausreißen. Wer arbeitet ähnlich?',
    images: [CDN + 'Maxymova_Silikonpads_Teddy.png?width=900'],
    ago: 'vor 5 Std.',
    likes: 61,
    productHandle: 'pads-teddy',
    comments: [
      { id: 'c3', authorId: 'm-jules', text: 'Probiere ich morgen aus! Bisher hatte ich am inneren Eck immer Lift-Aussetzer.', ago: 'vor 3 Std.' },
    ],
  },
  {
    id: 'p3',
    authorId: 'm-sophie',
    type: 'frage',
    title: 'Step 2 bei sehr widerstandsfähigen Wimpern?',
    text: 'Ich habe eine Kundin mit sehr dichten, harten Wimpern – Step 2 scheint bei der Maximalzeit noch nicht richtig zu greifen. Was macht ihr in so einem Fall: Zeit erhöhen oder prüfen, ob Step 1 tief genug gearbeitet hat? Danke für eure Erfahrung! 🙏',
    images: [],
    ago: 'vor 8 Std.',
    likes: 23,
    comments: [
      { id: 'c4', authorId: 'm-aylin', text: 'Zuerst Step 1 checken – bei dichten Wimpern meist der eigentliche Grund. Erst dann Step 2 vorsichtig +1 Min.', ago: 'vor 6 Std.' },
      { id: 'c5', authorId: 'm-lena', text: 'Und Pad-Größe prüfen! Zu kleine Pads = zu viel Widerstand.', ago: 'vor 5 Std.' },
      { id: 'c6', authorId: 'm-sophie', text: 'Danke euch! Step 1 war tatsächlich das Problem. 💙', ago: 'vor 2 Std.' },
    ],
  },
  {
    id: 'p4',
    authorId: 'm-jules',
    type: 'ergebnis',
    title: 'Brow Lamination + Tint #03 – weicher Naturlook',
    text: 'Heute im Atelier: Brow Lifting mit der NUDE RANGE in einem warmen Ton. Die Kundin wollte „nicht zu dunkel, nicht zu streng" – passt, oder?',
    images: [CDN + 'BRONSUN_NUDE_Black.jpg?width=900', CDN + 'Zola_Augenbrauenfarbe_03_Brown.png?width=900'],
    ago: 'vor 12 Std.',
    likes: 97,
    productHandle: 'bronsun-nude-black',
    comments: [
      { id: 'c7', authorId: 'm-marie', text: 'Der Farbverlauf ist so schön natürlich! 👌', ago: 'vor 10 Std.' },
      { id: 'c8', authorId: 'm-aylin', text: 'Genau so sollen Brauen aussehen. Bookmark fürs Atelier.', ago: 'vor 9 Std.' },
    ],
  },
  {
    id: 'p5',
    authorId: 'm-lena',
    type: 'tipp',
    title: 'So fotografiere ich Vorher-Nachher konsistent',
    text: 'Immer gleicher Platz am Fenster, gleicher Winkel, kein Blitz, Vorher-Foto vor dem Entfernen der Pads machen. Meine Kundinnen erkennen sich wieder – und die Wirkung deiner Arbeit wird sichtbar. Kamera-Grid an!',
    images: [],
    ago: 'vor 1 Tag',
    likes: 132,
    comments: [
      { id: 'c9', authorId: 'm-sophie', text: 'Das Grid habe ich nie benutzt – gamechanger!', ago: 'vor 20 Std.' },
    ],
  },
  {
    id: 'p6',
    authorId: 'm-aylin',
    type: 'ergebnis',
    title: 'Korean Lift mit FUSION Pads – 6 Wochen danach',
    text: 'Nachbehandlung von vor 6 Wochen: Der Schwung sitzt noch perfekt. Die Kombination aus koreanischer Technik und sauberem Layering zahlt sich aus.',
    images: [CDN + 'Maxymova_Fusion_Silikonpads.png?width=900'],
    ago: 'vor 1 Tag',
    likes: 76,
    productHandle: 'pads-fusion',
    comments: [],
  },
  {
    id: 'p7',
    authorId: 'm-marie',
    type: 'tipp',
    title: 'Booster-Beratung: Erwartungen richtig setzen',
    text: 'Ich sage Kundinnen immer: „Erste sichtbare Veränderung nach 4–6 Wochen, volle Wirkung nach 12." So bleiben alle zufrieden und die Kur wird durchgezogen. Wie kommuniziert ihr das?',
    images: [CDN + 'peptide_mascara.png?width=900'],
    ago: 'vor 2 Tagen',
    likes: 58,
    productHandle: 'peptide-mascara-8ml',
    comments: [
      { id: 'c10', authorId: 'm-lena', text: 'Genau so mache ich das auch – plus Fortschheitsfotos alle 4 Wochen.', ago: 'vor 2 Tagen' },
    ],
  },
  {
    id: 'p8',
    authorId: 'm-sophie',
    type: 'frage',
    title: 'Organizer: Was muss wirklich mit?',
    text: 'Ich fange bald mobil an zu arbeiten. Was packt ihr in euren Organizer für Hausbesuche? Ich will nicht den kompletten Stationswagen mitnehmen. 😅',
    images: [CDN + '1.1.png?width=900'],
    ago: 'vor 3 Tagen',
    likes: 34,
    productHandle: 'glamloox-bag',
    comments: [
      { id: 'c11', authorId: 'm-jules', text: 'Lotionen 1–3, 2 Pad-Größen, Balm, Pinsel, Pads, Timer. Mehr braucht es nicht!', ago: 'vor 3 Tagen' },
      { id: 'c12', authorId: 'm-aylin', text: 'Und ein zweites Paar Handschuhe immer dazupacken.', ago: 'vor 2 Tagen' },
    ],
  },
  {
    id: 'p9',
    authorId: 'm-jules',
    type: 'tipp',
    title: 'Waxing-Wärmer: die ersten 15 Minuten nutzen',
    text: 'Ich schalte den Wärmer an, bevor die Kundin Platz nimmt – so ist das Wachs exakt auf Temperatur, wenn es losgeht. Spart mir pro Behandlung 10+ Minuten.',
    images: [CDN + 'ELAN_WachsSet_Schulung.png?width=900'],
    ago: 'vor 4 Tagen',
    likes: 45,
    productHandle: 'elan-wachserwarmer',
    comments: [],
  },
  {
    id: 'p10',
    authorId: 'm-lena',
    type: 'ergebnis',
    title: 'Brow-Booster-Kur: Woche 10',
    text: 'Zehn Wochen Brow Booster nach einer durchgestylten Brauen-Phase. Die Lücken sind deutlich aufgefüllt – und das Serum ist hormonfrei, also auch für meine schwangere Kundin okay.',
    images: [CDN + '4.png?width=900', CDN + '5.png?width=900'],
    ago: 'vor 5 Tagen',
    likes: 112,
    productHandle: 'brow-booster',
    comments: [
      { id: 'c13', authorId: 'm-marie', text: 'Die Differenz im Vorderbereich ist enorm. Danke fürs Teilen!', ago: 'vor 4 Tagen' },
      { id: 'c14', authorId: 'm-sophie', text: 'Darf ich das Foto (anonymisiert) für meine Beratung nutzen?', ago: 'vor 4 Tagen' },
    ],
  },
  {
    id: 'p11',
    authorId: 'm-aylin',
    type: 'tipp',
    title: 'Dual Timer = Ruhezustand für dich',
    text: 'Klingt banal, hat meine Behandlungen entspannter gemacht: Ein Timer für links, einer für rechts, beide parallel laufen lassen. Kein Kopf-Rechnen mehr, kein Überziehen.',
    images: [CDN + 'Dual_Timer_Noemi.jpg?width=900'],
    ago: 'vor 6 Tagen',
    likes: 39,
    productHandle: 'noemi-dual-timer',
    comments: [
      { id: 'c15', authorId: 'm-jules', text: 'Und die Kundin hört das Signal – wirkt professioneller als Handy-Kitchen.', ago: 'vor 5 Tagen' },
    ],
  },
  {
    id: 'p12',
    authorId: 'm-marie',
    type: 'frage',
    title: 'Peptide Mascara als Aftercare-Empfehlung?',
    text: 'Verkauft ihr die PEPTIDE MASCARA aktiv als Nachsorge nach dem Lift? Meine Kundinnen lieben sie als „sofort sichtbar"-Produkt zwischen den Kuren. Wie sind eure Erfahrungen mit der Kombination Booster + Mascara?',
    images: [CDN + 'mascara_peptide.jpg?width=900'],
    ago: 'vor 1 Woche',
    likes: 52,
    productHandle: 'peptide-mascara-8ml',
    comments: [
      { id: 'c16', authorId: 'm-lena', text: 'Ja! Mascara morgens, Booster abends – das erkläre ich als „Tag- und Nacht-Routine". Läuft super.', ago: 'vor 6 Tagen' },
    ],
  },
];
