LUXE ARCADE v0.5.1 — UNIFIED CASH BALANCE

Replace ONLY blackjack-v046.js in the repository root.
No other files need updating.

Blackjack now uses state.cash, the same dollar balance shown in the game's top header and used by Lifestyle/Shop.
Bets subtract dollars from cash immediately; wins, pushes and blackjack payouts return dollars to cash.
Splits and doubles charge the same cash account. The old state.chips field is left untouched for compatibility with old saves, but Blackjack no longer uses it.
The on-table chips are visual betting tokens representing dollars, not a separate currency.

IMPORTANT: Existing chips balance is not automatically transferred to cash to avoid unintentionally creating extra money.
Existing cash savings are preserved.
