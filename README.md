# Perez Family Hub v0.6.3

Clean rebuild from the last known-good v0.5.2 base.

- Restores the original working Add Chore / Edit Chore event wiring.
- No delegated or duplicate chore click handlers.
- Adds recurring completion directly inside the original toggleChore function:
  Daily +1 day, Weekly +7 days, Monthly +1 month.
- One-time chores mark Done normally.
- Larger, more visible bottom navigation is CSS-only and does not alter navigation logic.
