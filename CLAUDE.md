# Project Yew Website

Static HTML/CSS/JS website for Project Yew — a Queensland-based business that connects brands, charities, and venues to run charity-linked advertising campaigns inside high-traffic venue restrooms.

## Stack

- Pure HTML, CSS, JavaScript — no framework, no build step
- Hosted on Railway, deployed via GitHub (`master` branch)
- Local dev: `python server.py` → http://localhost:8080

## Pages

| File | URL | Audience |
|------|-----|----------|
| `index.html` | `/` | Homepage — all three audiences |
| `brands.html` | `/brands` | Companies / sponsors |
| `charities.html` | `/charities` | Charities / nonprofits |
| `venues.html` | `/venues` | Venue operators |
| `contact.html` | `/contact` | Contact form |

## Key files

- `styles.css` — all styles, single file
- `script.js` — scroll reveal, stagger animations, contact form, yew tree grow animation
- `server.py` — custom Python HTTP server that strips `.html` from URLs and uses `$PORT` env var for Railway
- `Procfile` — tells Railway to run `python server.py`

## Local development

```bash
python server.py
```

Serves at http://localhost:8080 with clean URLs (no `.html` extension).

## Deploy

Push to `master` — Railway auto-deploys.

## Design decisions

- Colour palette: off-white (`#f3f2ef`), sage green (`#5e675d`), near-black (`#11171c`)
- Inner page heroes and how-sections use dark backgrounds for visual contrast
- Labels are pill-style with subtle borders
- Cards have sage green top-border accents and shadows
- Yew tree SVG is procedurally generated on every page load (random branches/leaves) and grows as the user scrolls
- Copy is written in outcome-first, Hormozi-style — short, specific, no vague language

## Contact details

- Email: admin@projectyew.com
- Location: Queensland, Australia
- Response time: 24 hours
