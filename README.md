# Perez Family Hub v0.3.1

Google Calendar persistence update.

- Keeps the current Google OAuth access token in this browser so a normal page refresh can reconnect automatically while the token is still valid.
- Automatically reloads the Perez Family calendar after refresh.
- Clears an expired/rejected token and asks for Google reconnection when needed.
- No Google client secret is included.

Important: Google access tokens are short-lived. v0.3.1 removes the unnecessary login after every refresh, but an expired Google session will still require Connect Google again.
