# Perez Family Hub v0.7.2

Chore recurrence reliability rewrite.

What changed:
- Rewrote chores.js rather than patching the prior toggle function.
- A completion snapshots the exact clicked Google event ID before any async work.
- Only that exact event URL is PATCHed.
- Other chores are never looped over, recalculated, or updated during completion.
- Prevents double-clicks while a chore update is in progress.
- App-wide sync now performs one Google Calendar list fetch and gives the same result to Calendar and Chores.
- Preserves v0.7.1 layout, Add Event, Add Chore, family colors, Monday-first week, and prominent bottom navigation.

Test:
1. Note both chore dates.
2. Click only Fonsi's chore once.
3. Fonsi's weekly chore should move exactly 7 days.
4. Miguel's date must remain unchanged.
