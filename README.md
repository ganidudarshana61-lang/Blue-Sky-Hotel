# Hotel Blue Sky – Website

A static, dependency-free website (HTML5, CSS3, vanilla JavaScript) for Hotel Blue Sky, No. 240 Negombo Road, Kurunegala.

## Before you publish – 3 things to replace
1. **Photos.** The gallery uses the supplied hotel photos directly from `assets/`: `280629485.jpg` (exterior), `280629659.jpg` (reception / lobby), `2.jpg` (main entrance), `images (10).jpg` (banquet hall), and `4.jpg` (guest bedroom). Keep these filenames in sync with the gallery references in `index.html`.
2. **Logo.** The current logo image is `assets/Hotel logo.jpg`. Replace it with the hotel's approved logo if needed, updating the `src` in `index.html` if its filename changes.
3. **Domain.** Replace `YOUR-DOMAIN-HERE` in `index.html` (canonical link), `sitemap.xml` and `robots.txt` with the real domain. Optionally add `"url"` to the JSON-LD block in `index.html`.

## Run locally
- Simplest: double-click `index.html`.
- Or with a local server (recommended): in this folder run `python3 -m http.server 8000` and open http://localhost:8000

## Upload to hosting
1. Buy/confirm the domain and a hosting plan (cPanel shared hosting, Netlify, Cloudflare Pages, GitHub Pages, etc.).
2. **cPanel / FTP:** open File Manager (or connect with FileZilla), go to `public_html`, upload everything inside this folder (not the folder itself) so `index.html` sits directly in `public_html`.
3. **Netlify / Cloudflare Pages:** drag and drop the folder (or the ZIP) onto the dashboard.
4. Enable HTTPS (free SSL) and open the live site to check images, WhatsApp button and the form.
5. Submit `https://your-domain/sitemap.xml` in Google Search Console and claim/verify the Google Business Profile.

## Notes
- The booking form is an **enquiry** form: it opens WhatsApp (+94 37 222 4777) with a prefilled message. It does not confirm or reserve rooms.
- Room preference is left out of the form because no confirmed room categories were provided. Add a `<select>` once they are.
- The map uses Google's keyless embed of the hotel address. The "Get Directions" button uses the supplied Google Maps link.
- Fonts (Cormorant Garamond, Figtree) load from Google Fonts with system-font fallbacks.
- Files: `index.html`, `style.css`, `script.js`, `robots.txt`, `sitemap.xml`, `assets/`.
