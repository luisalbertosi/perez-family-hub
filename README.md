# Perez Family Hub v0.6

## Chores upgrade
- Keeps the existing Google Calendar-backed chores system.
- Adds a completion-history store on the device for recent completed chores.
- Adds recurrence progression helpers for Daily, Weekly and Monthly chores.
- When the existing chore toggle is available globally, completing a recurring chore advances it to its next due date and resets it to open.
- Adds improved chore-card styling and completed-state presentation.
- One-time chores remain completed rather than generating another occurrence.
- Existing Calendar design, Monday-first week, family colors/badges, compact Google connection status and one-hour event duration default remain intact.

### Important architecture note
Chores are still represented as specially tagged events in the private Perez Family Google Calendar in this version. A future database-backed architecture can move chores, meals and lists out of Calendar if desired.
