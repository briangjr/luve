LUXE ARCADE BLACKJACK v0.5.0 — FIX FOR BETTING / CHIP ANIMATIONS
Upload to GitHub root, replacing ONLY:
- blackjack-v046.js
- blackjack-v046.css

Keep index.html and assets/casino-table.webp unchanged.

Updates:
- Chip taps and five hand betting have explicit feedback messages
- Shows a clear insufficient-chips warning instead of silently ignoring a bet
- Chip flight now uses visible poker-chip tokens on top of the screen
- Improved touch targets and selection highlights
- No changes to blackjack rules or your save data

After Netlify deploys, hard refresh the browser to clear the old JavaScript:
iPhone Safari: close tab and reopen; desktop: Ctrl+Shift+R.
