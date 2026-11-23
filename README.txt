LUX golf putting add-on (integration kit, NOT a complete LUX release)
Files: lux-putting.js, lux-putting.css, putting-demo.html
Open putting-demo.html to test the touch-friendly putting game.
To integrate with the current LUX golf engine:
1. Include the CSS and JS in index.html after existing golf assets.
2. In golf.js, when the ball FIRST lands on the green, call:
   LUXPutting.start({container: document.querySelector('#screen'),
     strokesBeforeGreen: currentHoleStrokes,
     onSink: ({putts,totalStrokes}) => {
       // Record totalStrokes in the existing scorecard.
       // Show hole result and advance to the next hole via existing functions.
     },
     onExit: () => { /* return to golf screen */ }
   });
3. Do not advance to next hole until onSink fires.
This package cannot automatically wire to your existing golf engine because the
latest golf.js and full current source are not available in this session.
This is a standalone playable putting mode, not a verified integrated update.
