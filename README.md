# GLAMLOOX App – Interaktiver Concept-Prototyp

**Öffentliche Demo:** siehe Deployment-Ausgabe *(Interactive Concept Demo, Vercel)*

Hochwertiger, vollständig klickbarer Mobile-App-Prototyp für **GLAMLOOX®** –
Shop, Academy & Community in einer iOS-App.React + TypeScript + Vite + Tailwind CSS + Lucide Icons.

## Bereiche

| Bereich | Funktionen |
|---|---|
| **Home** | Hero-Bereich mit Branding, Bestseller, Kategorien, Academy-Empfehlung, Live-Trainings, Community-Highlight, personalisierte Empfehlungen |
| **Shop** | 33 echte Produkte (Namen/Preise/Bilder von glamloox.net), Suche, Kategorie- & Markenfilter, Sortierung, Produktdetail mit Galerie/Varianten/Menge, Favoriten, Warenkorb, Demo-Checkout |
| **Academy** | 4 reale Kurse (u. a. Korean Lash Lift Powder 2.0), Module & Lektionen, interaktiver Demo-Videoplayer (Zeitraffer), PDF- & Quiz-Lektionen, Fortschritt, Meine Kurse, Zertifikat, 4 Live-Events mit Anmeldung |
| **Community** | 12 Demo-Beiträge (Ergebnisse/Fragen/Tipps), Vorher-Nachher, Likes, Kommentare, Speichern, Beitrag erstellen, Mitgliederprofile |
| **Profil** | Bestellungen mit Tracking, Favoriten, Kurse, Zertifikate, Live-Anmeldungen, Rewards, Einstellungen inkl. Demo-Reset |

## Technologie

- React 19 · TypeScript · Vite · Tailwind CSS 4 · react-router (Hash) · lucide-react
- Context-Store mit **LocalStorage-Persistenz** (`glamloox-demo-v1`)
- Mobile-first (390 px), Desktop: zentrierte iPhone-Präsentation
- Kein Backend, keine Zahlungen, keine echten Bestellungen

## Entwicklung

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # dist/
npm run preview
```

## Datenquellen & Kennzeichnung

- **Produkte:** Namen, Preise & Originalbilder via Shopify-Produkt-API von [glamloox.net](https://glamloox.net) (Stand: Nov. 2026, im Code verifiziert)
- **Academy:** reale Kursnamen/Preise; Module, Lektionen & Beschreibungen sind kuratierte Demo-Inhalte
- **Community-Beiträge, Termine, Bestellungen, Reward-Punkte:** Beispieldaten – im Prototyp entsprechend gekennzeichnet
- Es werden keine Kundenbewertungen erfunden; keine echten Transaktionen

## Deployment (Vercel)

```bash
vercel deploy --prod
```

© Konzept-Prototyp im Auftrag von GLAMLOOX – alle Markenrechte liegen bei GLAMLOOX.
