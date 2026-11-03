# Dekha — দেখা. Your people, in Dhaka.

A prototype re-imagining of a Tinder-style dating flow, built **for a Bangladeshi user** and named **Dekha** (দেখা — "to meet / see"). It is a static, browser-first app: no backend, no build step, just HTML/CSS/JS that runs anywhere.

## The lens

Dekha is not a clone of Tinder. It is built around what a Bangladeshi (especially Bangladeshi women) user told us matters most:

- **local first** — people near you, Dhaka and beyond, not global swiping
- **bilingual** — Bangla and English, from day one
- **privacy first** — on-device evidence, strict safety, transparent reporting
- **family & cultural sensitivity** — tagged locations, clear intentions, no pressure

## What you get

- `index.html` — the app shell (splash → onboard → discover → match → chat → settings)
- `app.js` — state + flows: swipe/decks, matching, chat, profiles, save-profile
- `brag_dekha.mp4` — a short demo video of the flow (the "Dekha video" deliverable)

## Run it

No build, no server required — just open `index.html` in a browser.

To serve locally:
```
cd dekha
python -m http.server 8765
# open http://127.0.0.1:8765/index.html
```

The prototype was verified by exercising the full flow in a real Chromium:
- splash → onboard → start swiping → discover
- like / super-like / nope → match → chat → message → bot reply
- edit your own profile (name / phone / location / goal / distance / verification)
- privacy & safety settings

## The flow in one breath

1. **Splash** → "দেখা" tagline and a Get started tap.
2. **Onboard** — three bilingual streaks (local, bilingual, privacy).
3. **Discover** — swipe cards, like/super-like/nope, summary leaderboard.
4. **Match** — super-like signals "I've met this person" → match view → Chat.
5. **Chat** — bot-prefilled conversation; your Bengali message gets an English reply (bilingual, not a translation bot).
6. **Your profile** (topbar) — set your own name, phone, location, goal, distance, verification before showing up.
7. **Settings** — privacy, safety, reporting, block & reset.

## Notes

- It is a **prototype**: all images are Unsplash placeholders, all chat is scripted, and "matches" are single-device simulations. Extension points: real identity/verification, backend persistence, push/notification, and a real intent ranking.
- Security posture note: no secrets are stored; demo credentials/phone numbers are placeholder data.
