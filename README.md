# Luxe Arcade v0.4.3 — Premium Interface Update

A drop-in update built on v0.4.2. The main home screen has been redesigned with CSS-rendered luxury centerpiece, polished black-glass action buttons, improved typography, lighting, spacing, and responsive iPhone sizing. Other game screens inherit the improved button and panel styling. All home action buttons are actual clickable HTML controls (not image overlays).

## Install
Upload the *contents* of this ZIP to the root of the same GitHub repo, including `assets/`, `premium.css` and `premium.js`. Replace existing files of the same name. Netlify redeploys after commit. Do not delete the existing assets directory.

## Technical notes
Preserves the `luxe-v01` localStorage key, gameplay scripts and functionality. No image mockups are used for the new home hero, avoiding misaligned baked-in labels. The other screens retain their v0.4.2 art. Not yet validated on a physical iPhone; test all screens and game controls.
