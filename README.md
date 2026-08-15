# Adult Avatar Controller — UpSkillHero (Stage 3, bug-fix pass)

Live Rive demo + integration documentation for `Adult Avatar Controller`.

## This update — 3 confirmed fixes, no scope change

Same 14 State Machine inputs as before (verified byte-for-byte, nothing added/removed/renamed):

`hairVariants`, `hairColor`, `skinVariants`, `eyeColor`, `outfitColor` (Number) · `swordVisible`, `shieldVisible` (Boolean) · `swordCharge`, `shieldCharge` (Number) · `Blink`, `SwordGlint`, `ShieldGlint` (Trigger) · `isTalking`, `isCelebrating` (Boolean)

1. **Skin Color in Idle** — `skinVariants` now updates immediately in Idle, not only after entering `isTalking`. Verified through Idle → Talk → Idle.
2. **Shield Notch Color** — one charge notch was incorrectly inheriting `outfitColor`; fixed to be independent, matching the sword.
3. **Charge Fill UI** — reverted to the simple treatment the client asked to keep (solid filled units, white empty notches) rather than the more elaborate concept proposed earlier.

## Layout fix carried over from the previous revision

The panel used to be capped at `100vh` with its own internal scroll, which could hide controls below the fold. Now the whole page scrolls together and the canvas stays pinned via `position: sticky` while the control panel scrolls next to it — nothing is hidden regardless of viewport height.

## What's inside

- **Hero** — live `adult-avatar.riv` canvas, pill selectors for the 5 customization options, weapon toggles + charge sliders, effect buttons (also auto-firing on the documented cadence), isTalking / isCelebrating switches.
- **Docs** — Overview, a dedicated "This Update" section for the 3 fixes, customization/weapons/effects/states reference, JS / React Native examples, auto-effects pattern, best practices, checklist.

## Run it

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
