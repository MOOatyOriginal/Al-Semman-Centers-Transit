# Al-Semman Centers — Transit Page

Official QR transit page for Al-Semman Centers.

## Live page
https://mooatyoriginal.github.io/Al-Semman-Centers-Transit/

## Project files
- `index.html` — page structure and content.
- `style.css` — visual system, responsive layout, and intro animations.
- `script.js` — intro sequence, audio playback, working-hours panel, and sharing.
- `04 - ASSETS/` — local images, icons, logo artwork, fonts, and intro audio.
- `.github/workflows/static.yml` — GitHub Pages deployment workflow.

## Local preview
Open `index.html` in a browser, or serve the repository root with a local static server. Keep the relative asset paths unchanged.

## Deployment
Push changes to `main` or run the **Deploy static content to Pages** workflow manually from GitHub Actions.

## Maintenance notes
- Keep the IDs used by `script.js` in sync with `index.html`.
- Check every local `src` and `href` against the files in `04 - ASSETS/`.
- Do not remove logo layers, font files, or media assets unless their usage has been verified.
- Test the intro on both touch and mouse devices after changing its timing or stacking rules.
