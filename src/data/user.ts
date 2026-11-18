// Demo-Account & Beispielbestellungen für den Prototyp (fiktive Daten)

export interface DemoOrder {
  id: string;
  dateISO: string;
  status: 'geliefert' | 'unterwegs';
  items: { productId: string; qty: number; price: number; variantName?: string }[];
  total: number;
}

export const demoUser = {
  name: 'Lena Meier',
  role: 'Lash Artist & Studio-Ownerin',
  studio: 'Lash Lounge Lena',
  city: 'Köln',
  since: 'März 2024',
  initials: 'LM',
  gradient: 'linear-gradient(135deg, #2E5BF0, #7A96F8)',
  bio: 'Natürliche Lashes & gesunde Wimpern – Korean-Lift-Fan seit Tag 1. 💙',
  rewardPoints: 480,
  rewardTier: 'Gold',
  nextTierAt: 520,
};

// Kursfortschritt beim ersten Start (Progress-IDs = Lektions-IDs aus courses.ts)
export const initialProgress: Record<string, boolean> = {
  're-m1-l1': true, 're-m1-l2': true, 're-m2-l1': true, 're-m2-l2': true, 're-m2-l3': true,
  're-m3-l1': true, 're-m3-l2': true,
  'kp-m1-l1': true, 'kp-m1-l2': true, 'kp-m1-l3': true,
};

export const enrolledCourseIds = ['reanimation', 'korean-powder-2'];
export const initiallyRegisteredEvents = ['ev-demo-masterclass'];

export const initialOrders: DemoOrder[] = [
  {
    id: 'GLX-10247',
    dateISO: '2026-10-18',
    status: 'geliefert',
    items: [
      { productId: 'wimpernserum-4ml', qty: 2, price: 52.0 },
      { productId: 'peptide-mascara-8ml', qty: 1, price: 38.95 },
    ],
    total: 142.95,
  },
  {
    id: 'GLX-10163',
    dateISO: '2026-08-30',
    status: 'geliefert',
    items: [
      { productId: 'pads-teddy', qty: 1, price: 18.99 },
      { productId: 'oko-balm-glue', qty: 1, price: 18.0 },
      { productId: 'noemi-lash-foam', qty: 1, price: 9.9 },
    ],
    total: 46.89,
  },
];

export interface Certificate {
  id: string;
  courseId: string;
  issuedISO: string;
  certId: string;
}

export const certificates: Certificate[] = [
  { id: 'cert-re', courseId: 'reanimation', issuedISO: '2026-09-12', certId: 'GLX-AC-2026-0912' },
];
