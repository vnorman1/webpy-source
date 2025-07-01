# Webpy :: [V.N.] – Online Photo to WebP Converter

Gyors, ingyenes és biztonságos online fotó konvertáló WebP formátumba. Készítette: **vnorman1**

## Főbb jellemzők
- **Drag & Drop** feltöltés
- Több kép egyidejű konvertálása
- Minőségvesztés nélküli átalakítás
- Letisztult, mobilbarát felület
- Teljesen kliensoldali működés (a képek nem kerülnek szerverre)
- PWA támogatás (telepíthető alkalmazás)

## Elérhető itt
[https://vnorman1.github.io/webpy/](https://vnorman1.github.io/webpy/)

## Fájlstruktúra

- `App.tsx` – Fő alkalmazáskomponens
- `index.tsx` – Belépési pont, React renderelés
- `components/` – Újrafelhasználható React komponensek (pl. Header, Footer, UploadPanel, stb.)
- `services/imageProcessor.ts` – Képfeldolgozó logika (konvertálás, tömörítés)
- `constants/presets.ts` – Előre definiált beállítások
- `public/` – Statikus fájlok (favicon, manifest, ogimage, robots.txt, sitemap.xml)
- `global.css`, `custom-animations.css`, stb. – Stíluslapok
- `vite.config.ts` – Vite konfiguráció
- `tsconfig.json` – TypeScript beállítások
- `package.json` – Függőségek, scriptek

## Telepítés és futtatás

1. Függőségek telepítése:
   ```sh
   npm install
   ```
2. Fejlesztői szerver indítása:
   ```sh
   npm run dev
   ```
3. Build készítése:
   ```sh
   npm run build
   ```
4. Statikus build a `dist/` mappában.

## SEO & PWA
- SEO optimalizált meta tagek, canonical URL, Open Graph, Twitter, JSON-LD
- `manifest.webmanifest` és PWA támogatás
- `sitemap.xml` és `robots.txt` a keresőrobotok számára

---

**Készítette:** vnorman1

Ha hibát találsz vagy javaslatod van, nyiss egy issue-t vagy küldj pull requestet!
