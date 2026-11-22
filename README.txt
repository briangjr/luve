LUX v0.6.4 FIRST-CLICK FIX

Replace premium.js and index.html at the root of your existing LUX project. Keep all other files, CSS, assets, and local save data.

Root cause: premium.js captured the OLD paid function as a callback when the home buttons were constructed. It must call paid() dynamically when tapped, after lux-v062.js overrides paid with the six-tile screen. Cache-bust premium.js and lux-v062.js references in index.html.

Expected: Home -> Get Paid opens the six rectangular tiles on the first tap. The bottom Get Paid navigation also opens that screen.

Syntax checked; no live iPhone testing.
