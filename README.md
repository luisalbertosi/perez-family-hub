# Perez Family Hub v0.12.2

Firestore migration release:
- Calendar events remain in Google Calendar.
- Chores remain in Google Calendar so chore indicators continue to work.
- Meals, Recipes, and Lists now save in Cloud Firestore instead of creating Google Calendar events.
- Existing v0.11 meal/list/recipe storage events can be migrated on first sync. The app asks before copying them to Firestore and removing only those tagged storage records from Google Calendar.
- New recipes default Prep + cook time to 30 minutes.
- Firebase Authentication reuses the existing Google access token, so there is no second family login flow when the Google connection is active.

Firebase project: perez-family-hub-509018
Firestore rules must allow authenticated users to read/write.
