# Perez Family Hub v0.1

A touch-friendly family calendar PWA prototype for an old iPad or wall touchscreen.

## Included now
- Weekly wall-calendar view
- MOM purple, DAD gray, MIGUEL yellow, FONSI blue, PRINCESS pink, FAMILY green
- Add/edit/delete events
- Person filters
- Today and Coming Next panels
- Events persist locally on the device
- PWA manifest for Add to Home Screen

## Run locally
Open index.html in a browser. For full PWA behavior, serve the folder through a web server.

## GitHub Pages
1. Create a GitHub repository.
2. Upload index.html, manifest.json, and README.md to the repository root.
3. In GitHub: Settings > Pages > Deploy from a branch > main / root.
4. Open the published URL on the iPad in Safari and use Add to Home Screen.

## Next build
Google Calendar OAuth/API sync should be added with a small backend or serverless function so credentials/tokens are handled safely. The intended architecture is Google Calendar as the shared calendar source of truth, with Family Hub providing the wall-display UI.
