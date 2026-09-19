# Perez Family Hub v0.11

Meals + Recipes upgrade:
- Weekly meal planner preserved
- Shared family recipe library
- Add/edit/delete recipes with ingredients, instructions, time, tags and source URL
- Best-effort recipe URL import using standard Recipe JSON-LD when the source site permits browser access
- Pick a saved recipe while scheduling a meal
- Quick meal choices: Leftovers, Eating Out, Takeout
- Add all saved-recipe ingredients from the visible week to the shared Grocery list
- Recipe and list records remain hidden from the normal calendar
- Persistent list/recipe retrieval independent of their original creation date

Recipe URL import is best-effort because many recipe websites block cross-origin browser fetching. When blocked, Family Hub keeps the URL and opens the recipe editor for manual completion.
