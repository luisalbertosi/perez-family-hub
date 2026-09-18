# Perez Family Hub v0.7 — Clean Rewrite

This version is a clean modular rewrite rather than another patch to the v0.6 code.

Files:
- index.html — application shell
- styles.css — all visual styling
- app.js — boot, clock, navigation and app-wide synchronization
- google-calendar.js — Google Identity Services + Calendar API
- calendar.js — Week / Month / Schedule, filters and event CRUD
- chores.js — chore CRUD, completion and recurrence
- storage.js — browser token persistence
- manifest.json — installable web-app metadata

Preserved behavior:
- Existing Perez Family Google Calendar remains the data source.
- Existing OAuth Client ID and Perez Family Calendar ID.
- MOM purple, DAD gray, MIGUEL yellow, FONSI blue, PRINCESS pink, FAMILY green.
- Monday-first week.
- Week / Month / Schedule views.
- Today is excluded from Coming Next.
- Add/Edit/Delete Google Calendar events.
- Start time defaults End time to one hour later when changed.
- Add/Edit/Delete chores.
- Daily / Weekly / Monthly recurring chores advance to the next due date when checked.
- One-time chores can be marked Done.
- Prominent bottom navigation.
- Compact green Google Connected status.
- Meals and Lists remain placeholders for later builds.

Deployment:
Upload ALL seven application files plus manifest.json from this ZIP to the ROOT of the existing GitHub Pages repository, replacing the old files. Do not upload the containing folder.

Recommended v0.7 test order:
1. Page loads and says Family Hub v0.7.
2. Google shows Connected or reconnects successfully.
3. Add Event opens.
4. Create a test event and confirm it appears in Google Calendar.
5. Edit then delete the test event.
6. Add Chore opens.
7. Create a one-time test chore and mark it Done.
8. Create a weekly test chore and mark it complete; it should advance seven days.
9. Refresh the page and verify Google-backed data remains.
