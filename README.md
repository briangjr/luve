# Luxe Arcade — Phase 4 (v0.4)

**Upload all website files AND the `assets` folder** to the root of your existing GitHub repository. Keep the `assets` directory and its `.webp` files together. Netlify will automatically redeploy. No build command.

## New in Phase 4
- Uses the approved AI-generated concept artwork as decorative scene imagery for home, golf selection, casino, garage, bedroom and shop. The images contain some pre-rendered interface elements; the actual buttons remain separate live HTML controls.
- Dark marble-inspired neon-blue UI polish, card deal transitions, mobile-friendly responsive styling and a session-based loading/Tap to Play intro.
- Four additional blackjack seat labels for the visual table atmosphere. **These are not playing CPU opponents yet.** Blackjack remains the functional one-hand game with hit, stand and double; split is not implemented.
- Existing golf and lifestyle mechanics, save key `luxe-v01`, and progression are preserved.

## Known limitations
- Approved art is integrated as decorative image backgrounds, not yet sliced into individual interactive assets; embedded words/buttons in art may not exactly match the live controls.
- Golf is still simplified 2D canvas with prototype rules and ball animation.
- Blackjack is still single-player; five-seat CPU logic and dynamic camera are future refinements.
- Splash uses timed simulated progress, not actual asset-loading progress.
- No server backup. Progress lives in localStorage in the same browser and domain.
- Everything uses fictional in-game money only.

## Test
After Netlify deploys, hard refresh. Check all scenes, golf, blackjack, purchase, garage and saved money. If images are missing, verify the `assets` folder is at the site root.
