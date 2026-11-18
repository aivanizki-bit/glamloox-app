// Kuratiert aus glamloox.net (Shopify-Produkt-API) – Produktnamen & Preise verifiziert (Stand: Nov. 2026)
// Alle Produktbilder sind Original-CDN-Bilder von glamloox.net
export type CategoryId = 'lash-lifting' | 'brow' | 'pflege' | 'zubehoer';

export interface ProductVariant { id: string; name: string; price?: number }
export interface Product {
  id: string; handle: string; title: string; shortTitle: string; vendor: string;
  price: number; category: CategoryId; badge: string | null; blurb: string;
  variants: ProductVariant[]; images: string[];
}

export const categories: { id: CategoryId | 'alle'; label: string }[] = [
  { id: 'alle', label: 'Alle' },
  { id: 'lash-lifting', label: 'Lash Lifting' },
  { id: 'brow', label: 'Brow & Farbe' },
  { id: 'pflege', label: 'Pflege' },
  { id: 'zubehoer', label: 'Zubehör' },
];

export const products: Product[] = [
  {"id":"oko-undereye-pads","handle":"undereye-pads-oko","title":"Undereye Pads von OkO Lash&Brow®","shortTitle":"OkO Undereye Pads","vendor":"OkO Lash&Brow®","price":12.99,"category":"zubehoer","badge":null,"blurb":"Undereye Pads von OkO Lash&Brow – schützen die empfindliche Haut beim Lifting.","variants":[{"id":"v1","name":"Pink"},{"id":"v2","name":"Black"}],"images":["https://cdn.shopify.com/s/files/1/0639/5812/2716/files/OkO_undereye_Pads_pink.png?width=800","https://cdn.shopify.com/s/files/1/0639/5812/2716/files/OkO_undereye_Pads_black.png?width=800"]},
  {
    "id": "lash-booster",
    "handle": "wimpernserum-4ml",
    "title": "Wimpernserum ohne Hormone LASH BOOSTER – 4ml",
    "shortTitle": "LASH BOOSTER Serum",
    "vendor": "GLAMLOOX®",
    "price": 52,
    "category": "pflege",
    "badge": "Bestseller",
    "blurb": "Wimpernserum ohne Hormone – für sichtbar längere, dichtere Wimpern. Vegan & tierversuchsfrei.",
    "variants": [],
    "images": [
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/Wimpernserum_ohne_Hormone.jpg?width=800",
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/1_18e5380a-3394-47b4-84b3-17acbfb5660e.png?width=800",
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/2_3fabb661-2a4a-4054-9059-5717ef806771.png?width=800",
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/3_390ccc4b-731f-493e-8c0a-a34bbdd53c1d.png?width=800"
    ]
  },
  {
    "id": "brow-booster",
    "handle": "brow-booster",
    "title": "Augenbrauenserum ohne Hormone - BROW BOOSTER – 4ML",
    "shortTitle": "BROW BOOSTER Serum",
    "vendor": "GLAMLOOX®",
    "price": 52,
    "category": "pflege",
    "badge": "Bestseller",
    "blurb": "Augenbrauenserum ohne Hormone – definierte, vollere Brauen in der täglichen Pflegeroutine.",
    "variants": [],
    "images": [
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/41F85A66-B45E-466A-84EB-75C63B167478_0cc02220-532e-4160-8e76-0457d9347852.jpg?width=800",
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/4.png?width=800",
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/5.png?width=800",
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/6.png?width=800"
    ]
  },
  {
    "id": "booster-set",
    "handle": "set-lash-brow-boosters",
    "title": "Wimpern- & Augenbrauenserum Set – Ohne Hormone & Prostaglandin - SET LASH&BROW BOOSTERS",
    "shortTitle": "Lash & Brow Booster Set",
    "vendor": "GLAMLOOX®",
    "price": 89,
    "category": "pflege",
    "badge": "Set-Vorteil",
    "blurb": "Das Pflegeduo: Lash Booster + Brow Booster ohne Hormone – im Set günstiger.",
    "variants": [],
    "images": [
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/E51662F7-9DD6-4476-AABF-66D1FA463A7E.jpg?width=800",
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/Set1.jpg?width=800",
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/Set2.jpg?width=800",
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/Set3.jpg?width=800"
    ]
  },
  {
    "id": "beauty-organizer",
    "handle": "glamloox-bag",
    "title": "Beauty Organizer - GLAMLOOX® Lash Lifting Kosmetiktasche groß",
    "shortTitle": "Beauty Organizer",
    "vendor": "GLAMLOOX®",
    "price": 119,
    "category": "zubehoer",
    "badge": "GLAMLOOX®",
    "blurb": "Große Lash-Lifting-Kosmetiktasche – dein mobiler Arbeitsplatz, perfekt sortiert.",
    "variants": [],
    "images": [
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/glam1236_1.jpg?width=800",
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/1.1.png?width=800",
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/3.3_8a9e952a-f012-453f-a9c7-29de6bff37a9.png?width=800",
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/2.2.png?width=800"
    ]
  },
  {
    "id": "peptide-mascara",
    "handle": "peptide-mascara-8ml",
    "title": "Wimpern Pflege Mascara mit Widelash™ – Für längere, dichtere & kräftigere Wimpern - PEPTIDE MASCARA",
    "shortTitle": "PEPTIDE MASCARA",
    "vendor": "GLAMLOOX®",
    "price": 38.95,
    "category": "pflege",
    "badge": "Neu",
    "blurb": "Pflege-Mascara mit Widelash™-Peptiden für längere, dichtere & kräftigere Wimpern.",
    "variants": [],
    "images": [
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/mascara_peptide.jpg?width=800",
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/peptide_mascara.png?width=800",
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/2-2_c335fef2-1ace-4f7a-93ce-60b36420d229.png?width=800",
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/1-2_23760740-407f-41ca-b328-ecbf475e0041.png?width=800"
    ]
  },
  {
    "id": "elan-try-me",
    "handle": "professionelles-liftingset-try-me-von-elan",
    "title": "Professionelles Liftingset \"Try Me\" von ÉLAN",
    "shortTitle": "ÉLAN „Try Me“ Liftingset",
    "vendor": "ÉLAN®",
    "price": 109.11,
    "category": "lash-lifting",
    "badge": "Profi-Set",
    "blurb": "Professionelles Lash-Lifting-Set von ÉLAN – alles drin für den perfekten Lift.",
    "variants": [],
    "images": [
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/ELAN_Try_Me_Bundle.jpg?width=800"
    ]
  },
  {
    "id": "elan-lotionen-set",
    "handle": "set-fur-wimpernlifting-von-elan®-lash-lifting-lotionen",
    "title": "Set für Wimpernlifting von ÉLAN® - Lash Lifting Lotionen",
    "shortTitle": "ÉLAN Lotionen-Set",
    "vendor": "ÉLAN®",
    "price": 52.99,
    "category": "lash-lifting",
    "badge": null,
    "blurb": "Lash-Lifting-Lotionen von ÉLAN im praktischen Set.",
    "variants": [],
    "images": [
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/46_dadfdf18-4680-49f2-b253-97e75249b498.jpg?width=800"
    ]
  },
  {
    "id": "zola-silver-set",
    "handle": "lifting-lotionen-silver-set-von-zola",
    "title": "Brow Lifting & Lash Lifting Set Silver von ZOLA",
    "shortTitle": "ZOLA Silver Lifting-Set",
    "vendor": "Zola",
    "price": 79.99,
    "category": "lash-lifting",
    "badge": null,
    "blurb": "Brow- & Lash-Lifting Set Silver: Lifting Gel, Volume Fixer & Keratin Serum.",
    "variants": [],
    "images": [
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/ZOLA_Silver_Lotionen_Set_Lifting.jpg?width=800",
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/ZOLA_Silver_Lotionen_Set_Lifting1.jpg?width=800",
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/ZOLA_Silver_Lifting_Gel.jpg?width=800"
    ]
  },
  {
    "id": "maxymova-bella",
    "handle": "cysteamine-lifting-lotionen-set-bella-von-maxymova",
    "title": "Cysteamine Lifting Lotionen Set BELLA von MAXYMOVA",
    "shortTitle": "MAXYMOVA BELLA Set",
    "vendor": "MAXYMOVA®",
    "price": 63.49,
    "category": "lash-lifting",
    "badge": null,
    "blurb": "Cysteamine-Lifting-Lotionen Set BELLA – schonende Formel von MAXYMOVA.",
    "variants": [],
    "images": [
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/Maxymova_Bella_Cysteamie_Tube_Kit.jpg?width=800",
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/MAxymova_Bella2.jpg?width=800",
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/MAxymova_BellaFix2.jpg?width=800"
    ]
  },
  {
    "id": "lash-oasis-set",
    "handle": "lotionen-set-fur-wimpernlifting-the-lash-oasis",
    "title": "Lotionen Set für Korean Lash Lifting - The Lash Oasis",
    "shortTitle": "Lash Oasis Lotionen-Set",
    "vendor": "The Lash Oasis",
    "price": 45.71,
    "category": "lash-lifting",
    "badge": "Korean Style",
    "blurb": "Lotionen-Set für Korean Lash Lifting von The Lash Oasis.",
    "variants": [],
    "images": [
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/the_lash_oasis_kit_set.png?width=800",
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/The_Lash_Oasis_Sachets.jpg?width=800",
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/The_Lash_Oasis_Sachets1.jpg?width=800"
    ]
  },
  {
    "id": "oko-turbo-unlock",
    "handle": "lifting-lotion-turbo-unlock-step-1-10ml-oko-lash-brow®",
    "title": "Lifting Lotion TURBO UNLOCK Step 1 10ml - OKO Lash&Brow®",
    "shortTitle": "OkO TURBO UNLOCK · Step 1",
    "vendor": "OkO Lash&Brow®",
    "price": 22.5,
    "category": "lash-lifting",
    "badge": null,
    "blurb": "Lifting Lotion Step 1 – öffnet die Haarstruktur sanft für die neue Form.",
    "variants": [],
    "images": [
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/OkO_Turbo_Lotion_Unlock.png?width=800",
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/OkO_Turbo_Lotion_Unlock1.png?width=800",
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/OkO_Turbo_Lotion_Unlock2.png?width=800"
    ]
  },
  {
    "id": "oko-turbo-lock",
    "handle": "lifting-lotion-turbo-lock-step-2-10ml-oko-lash-brow®",
    "title": "Lifting Lotion TURBO LOCK Step 2 10ml - OKO Lash&Brow®",
    "shortTitle": "OkO TURBO LOCK · Step 2",
    "vendor": "OkO Lash&Brow®",
    "price": 22.5,
    "category": "lash-lifting",
    "badge": null,
    "blurb": "Lifting Lotion Step 2 – fixiert die neue Wimpernform dauerhaft.",
    "variants": [],
    "images": [
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/OkO_Turbo_Lotion_lock.png?width=800",
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/OkO_Turbo_Lotion_lock1.png?width=800",
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/OkO_Turbo_Lotion_lock2.png?width=800"
    ]
  },
  {
    "id": "oko-turbo-glow",
    "handle": "lifting-lotion-turbo-glow-step-3-10ml-oko-lash-brow®",
    "title": "Lifting Lotion TURBO GLOW Step 3 10ml - OKO Lash&Brow®",
    "shortTitle": "OkO TURBO GLOW · Step 3",
    "vendor": "OkO Lash&Brow®",
    "price": 22.5,
    "category": "lash-lifting",
    "badge": null,
    "blurb": "Lifting Lotion Step 3 – Keratin-Pflege für Glow und Geschmeidigkeit.",
    "variants": [],
    "images": [
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/OkO_Turbo_Lotion_glow.png?width=800",
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/OkO_Turbo_Lotion_glow1.png?width=800",
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/OkO_Turbo_Lotion_glow2.png?width=800"
    ]
  },
  {
    "id": "pads-fusion",
    "handle": "silikonpads-fusion-6-paar-korean-lashlifting-maxymova®",
    "title": "Silikonpads FUSION 6 Paar - Korean Lashlifting - MAXYMOVA®",
    "shortTitle": "MAXYMOVA Pads FUSION",
    "vendor": "MAXYMOVA®",
    "price": 18.99,
    "category": "lash-lifting",
    "badge": "Korean Style",
    "blurb": "Selbsthaftende Silikonpads FUSION für Korean Lashlifting – 6 Paar.",
    "variants": [],
    "images": [
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/Maxymova_Fusion_Silikonpads.png?width=800",
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/Maxymova_Fusion_Silikonpads1.png?width=800",
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/Maxymova_Silikonpads_Uebersicht.png?width=800"
    ]
  },
  {
    "id": "pads-teddy",
    "handle": "silikonpads-teddy-5-paar-ultra-sticky-maxymova®",
    "title": "Silikonpads TEDDY 5 Paar - Ultra Sticky - MAXYMOVA®",
    "shortTitle": "MAXYMOVA Pads TEDDY",
    "vendor": "MAXYMOVA®",
    "price": 18.99,
    "category": "lash-lifting",
    "badge": null,
    "blurb": "Ultra Sticky Silikonpads TEDDY – 5 Paar, ideal für feine Wimpern.",
    "variants": [],
    "images": [
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/Maxymova_Silikonpads_Teddy.png?width=800",
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/Maxymova_Silikonpads_Teddy1.png?width=800",
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/Maxymova_Silikonpads_Uebersicht.png?width=800"
    ]
  },
  {
    "id": "v1",
    "handle": "koreanische-silikonpads-topkini-cu-curl",
    "title": "Koreanische Silikonpads Topkini CU - Curl von A.DAN",
    "shortTitle": "A.DAN Topkini Pads",
    "vendor": "A.DAN",
    "price": 65.35,
    "category": "lash-lifting",
    "badge": "Korean Style",
    "blurb": "Koreanische Silikonpads Topkini CU-Curl von A.DAN – in zwei Größen-Sets.",
    "variants": [
      {
        "id": "v1",
        "name": "Set Gr. 1–4"
      },
      {
        "id": "v2",
        "name": "Size Up Gr. 5–7",
        "price": 53.5
      }
    ],
    "images": [
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/Koreanische_Pads_Adan_Topkini.jpg?width=800",
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/Adan_Topkini_Pads1.jpg?width=800",
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/Adan_Topkini_Pads2.jpg?width=800"
    ]
  },
  {
    "id": "pads-m-curl",
    "handle": "silikonpads-fur-wimpernlifting-m-curl-fuchsia-von-lami-lashes®",
    "title": "Silikonpads für Wimpernlifting M Curl Fuchsia von LAMI LASHES®",
    "shortTitle": "LAMI LASHES Pads M Curl",
    "vendor": "LAMI LASHES®",
    "price": 24.9,
    "category": "lash-lifting",
    "badge": null,
    "blurb": "Silikonpads M Curl Fuchsia für Wimpernlifting von LAMI LASHES.",
    "variants": [],
    "images": [
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/Lami_Lashes_M_Curl_fuchsia2.jpg?width=800",
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/Lami_Lashes_M_Curl_fuchsia.jpg?width=800",
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/Lami_Lashes_M_Curl_fuchsia1.jpg?width=800"
    ]
  },
  {
    "id": "oko-balm-glue",
    "handle": "oko-lash-brow-lash-lami-balm",
    "title": "Lash Lami Balm Glue - OkO Lash&Brow®",
    "shortTitle": "OkO Lami Balm Glue",
    "vendor": "OkO Lash&Brow®",
    "price": 18,
    "category": "lash-lifting",
    "badge": null,
    "blurb": "Balm-Glue für Lash Lifting – kleberfreies Fixieren der Wimpern.",
    "variants": [],
    "images": [
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/2-9.png?width=800",
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/IMG_5131.jpg?width=800"
    ]
  },
  {
    "id": "zola-jelly-glue",
    "handle": "wimpernlifting-kleber-jelly-lami-glue-7-ml-zola-x-happy-lash",
    "title": "Wimpernlifting Kleber JELLY LAMI GLUE 7 ml – ZOLA x Happy Lash",
    "shortTitle": "ZOLA JELLY LAMI GLUE",
    "vendor": "Zola",
    "price": 18.99,
    "category": "lash-lifting",
    "badge": null,
    "blurb": "Wimpernlifting-Kleber JELLY LAMI GLUE 7 ml – ZOLA x Happy Lash.",
    "variants": [],
    "images": [
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/Zola_Jelly_Lami_Glue.jpg?width=800",
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/Zola_Jelly_Lami_Glue3.jpg?width=800",
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/Zola_Jelly_Lami_Glue1.jpg?width=800"
    ]
  },
  {
    "id": "lamitta-neo-glue",
    "handle": "neo-glue-kleber-fur-lash-lifting-praziser-wimpernkleber-von-lamitta®-7-g",
    "title": "Neo Glue Hybrid-Kleber für Lash Lifting - Präziser Wimpernkleber von Lamitta® 7 g",
    "shortTitle": "LAMITTA Neo Glue",
    "vendor": "LAMITTA®",
    "price": 28.99,
    "category": "lash-lifting",
    "badge": null,
    "blurb": "Hybrid-Kleber für Lash Lifting – präzise Fixierung ohne Klebereste.",
    "variants": [],
    "images": [
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/LAMITTA_NEO.jpg?width=800",
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/LAMITTA_NEO1.jpg?width=800"
    ]
  },
  {
    "id": "noemi-lash-foam",
    "handle": "pink-lash-foam-reinigungsschaum-fur-wimpern-augenbrauen-von-noemi®",
    "title": "Pink Lash Foam – Reinigungsschaum für Wimpern & Augenbrauen von Noemi®",
    "shortTitle": "Noemi Pink Lash Foam",
    "vendor": "Noemi®",
    "price": 9.9,
    "category": "zubehoer",
    "badge": null,
    "blurb": "Sanfter Reinigungsschaum für Wimpern & Augenbrauen von Noemi.",
    "variants": [],
    "images": [
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/Lash_Foam_pink_Noemi.jpg?width=800"
    ]
  },
  {
    "id": "zola-brauenfarbe-03",
    "handle": "augenbrauenfarbe-in-03-brown-von-zola-15ml-tube",
    "title": "Augenbrauenfarbe in #03 Brown von ZOLA - 15ml Tube",
    "shortTitle": "ZOLA Brauenfarbe #03",
    "vendor": "Zola",
    "price": 12.9,
    "category": "brow",
    "badge": null,
    "blurb": "Augenbrauenfarbe #03 Brown – 15 ml Tube von ZOLA.",
    "variants": [],
    "images": [
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/Zola_Augenbrauenfarbe_03_Brown.png?width=800",
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/Zola_Tint-Sachet_Set1.jpg?width=800"
    ]
  },
  {
    "id": "elan-brow-tint-09",
    "handle": "deep-brow-tint-2-0-09-coffee-20-ml-elan",
    "title": "Deep Brow Tint 2.0 09 Coffee 20 ml - ÉLAN",
    "shortTitle": "ÉLAN Deep Brow Tint 09",
    "vendor": "ÉLAN®",
    "price": 16.99,
    "category": "brow",
    "badge": null,
    "blurb": "Deep Brow Tint 2.0 in 09 Coffee – 20 ml von ÉLAN.",
    "variants": [],
    "images": [
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/ELAN_Augenbrauenfarbe_Deep_Brow_Tint_09_Coffee.png?width=800",
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/ELAN_Augenbrauenfarbe_Deep_Brow_Tint_09_Coffee1.png?width=800",
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/ELAN_Augenbrauenfarbe_Deep_Brow_Tint_09_Coffee2.png?width=800"
    ]
  },
  {
    "id": "bronsun-nude-black",
    "handle": "nude-range-black-1-cremefarbe-fur-augenbrauen-wimpern-naturliche-farbergebnisse-von-bronsun®",
    "title": "NUDE RANGE Black #1 Cremefarbe für Augenbrauen & Wimpern  | Natürliche Farbergebnisse von BRONSUN®",
    "shortTitle": "BRONSUN NUDE #1 Black",
    "vendor": "BRONSUN®",
    "price": 19.99,
    "category": "brow",
    "badge": null,
    "blurb": "NUDE RANGE Cremefarbe Black #1 für Augenbrauen & Wimpern.",
    "variants": [],
    "images": [
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/BRONSUN_NUDE_Black.jpg?width=800",
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/BRONSUN_NUDE_Black1.jpg?width=800",
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/BRONSUN_NUDE_Range.jpg?width=800"
    ]
  },
  {
    "id": "zola-brow-glue-gel",
    "handle": "extra-strong-augenbrauengel-brow-glue-gel-zola-x-maks-bilokonskyi",
    "title": "Extra Strong Augenbrauengel BROW GLUE GEL – ZOLA x Maks Bilokonskyi",
    "shortTitle": "ZOLA BROW GLUE GEL",
    "vendor": "Zola",
    "price": 24.9,
    "category": "brow",
    "badge": "Neu",
    "blurb": "Extra Strong Augenbrauengel für perfektes Brow Styling.",
    "variants": [],
    "images": [
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/Eyebrow_Fixing_Gel_Maks_Bilokonskyi_Zola.jpg?width=800",
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/Eyebrow_Fixing_Gel_Maks_Bilokonskyi_Zola1.jpg?width=800",
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/Eyebrow_Fixing_Gel_Maks_Bilokonskyi_Zola2.jpg?width=800"
    ]
  },
  {
    "id": "elan-velvet-liner",
    "handle": "elan-velvet-liner-flussiger-brow-eye-liner-15-g",
    "title": "ÉLAN Velvet Liner – Flüssiger Brow & Eye Liner, 15 g",
    "shortTitle": "ÉLAN Velvet Liner",
    "vendor": "ÉLAN®",
    "price": 23.99,
    "category": "brow",
    "badge": null,
    "blurb": "Flüssiger Brow & Eye Liner Velvet – 15 g von ÉLAN.",
    "variants": [],
    "images": [
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/ELAN_Liquid_Brow_Eye_Liner_Velvet.png?width=800",
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/ELAN_Liquid_Brow_Eye_Liner_Velvet5.png?width=800",
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/ELAN_Liquid_Brow_Eye_Liner_Velvet1.png?width=800"
    ]
  },
  {
    "id": "elan-wachserwarmer",
    "handle": "wechselwarmer-set-inkl-schulung-von-elan",
    "title": "Wachserwärmer Set inkl. Schulung von ÉLAN",
    "shortTitle": "ÉLAN Wachserwärmer-Set",
    "vendor": "ÉLAN®",
    "price": 119,
    "category": "brow",
    "badge": "Inkl. Schulung",
    "blurb": "Wachserwärmer-Set inkl. Schulung von ÉLAN – Einstieg ins Brow Waxing.",
    "variants": [],
    "images": [
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/ELAN_WachsSet_Schulung.png?width=800"
    ]
  },
  {
    "id": "zola-brow-wax",
    "handle": "augenbrauen-styling-wachs-brow-wax-von-zola",
    "title": "Augenbrauen Styling Wachs Brow Wax von ZOLA",
    "shortTitle": "ZOLA Brow Wax",
    "vendor": "Zola",
    "price": 11.99,
    "category": "brow",
    "badge": null,
    "blurb": "Styling-Wachs für definierte Augenbrauen von ZOLA.",
    "variants": [],
    "images": [
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/ZOLA_Augenbrauen_Styling_Wax_15gr.jpg?width=800",
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/ZOLA_Augenbrauen_Styling_Wax_30gr.jpg?width=800",
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/ZOLA_Augenbrauen_Styling_Wax.jpg?width=800"
    ]
  },
  {
    "id": "noemi-dual-timer",
    "handle": "dual-timer-2in1-digitaler-timer-fur-beauty-behandlungen-von-noemi®",
    "title": "Dual Timer 2in1 – Digitaler Timer für Beauty-Behandlungen von Noemi®",
    "shortTitle": "Noemi Dual Timer 2in1",
    "vendor": "Noemi®",
    "price": 18.9,
    "category": "zubehoer",
    "badge": null,
    "blurb": "Digitaler Dual-Timer für parallele Einwirkzeiten bei Behandlungen.",
    "variants": [],
    "images": [
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/Dual_Timer_Noemi.jpg?width=800"
    ]
  },
  {
    "id": "adan-mischpalette",
    "handle": "selbsthaftende-mischpalette-fur-den-handrucken",
    "title": "Selbsthaftende Mischpalette für den Handrücken von A.DAN",
    "shortTitle": "A.DAN Mischpalette",
    "vendor": "A.DAN",
    "price": 15.9,
    "category": "zubehoer",
    "badge": null,
    "blurb": "Selbsthaftende Mischpalette für den Handrücken von A.DAN.",
    "variants": [],
    "images": [
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/Selbsthaftende_Mischpalette_Adan4.jpg?width=800",
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/Selbsthaftende_Mischpalette_Adan3.jpg?width=800",
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/Selbsthaftende_Mischpalette_Adan1.jpg?width=800"
    ]
  },
  {
    "id": "zola-pinzette-gold",
    "handle": "pinzette-fur-augenbrauen-mit-schrager-spitze-zola",
    "title": "Pinzette für Augenbrauen mit schräger Spitze in gold - ZOLA",
    "shortTitle": "ZOLA Pinzette Gold",
    "vendor": "OkO Lash&Brow®",
    "price": 19.9,
    "category": "zubehoer",
    "badge": null,
    "blurb": "Pinzette mit schräger Spitze in Gold – präzises Zupfen.",
    "variants": [],
    "images": [
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/ZOLA_Pinzette_Gold_angled.png?width=800",
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/ZOLA_Pinzette_Gold_angled1.png?width=800"
    ]
  },
  {
    "id": "glamloox-haarband",
    "handle": "haarband-aus-mikrofaser-von-glamloox®",
    "title": "Haarband aus Mikrofaser von GLAMLOOX®",
    "shortTitle": "GLAMLOOX Haarband",
    "vendor": "GLAMLOOX®",
    "price": 5.9,
    "category": "zubehoer",
    "badge": null,
    "blurb": "Haarband aus weicher Mikrofaser von GLAMLOOX®.",
    "variants": [],
    "images": [
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/Haarband_Glamloox1.png?width=800",
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/Haarband_Glamloox.png?width=800",
      "https://cdn.shopify.com/s/files/1/0639/5812/2716/files/Haarband_Glamloox2.png?width=800"
    ]
  }
];
