# Fitbit Data Export

## How to Run

1. Set up a Fitbit app on <https://dev.fitbit.com/apps>. Make sure it's of type `Personal`. Set the redirect url to `http://localhost:2323`.
2. Create _.env_ based on _.env.sample_
3. Run `yarn auth-server`
4. If you're not running this on your localhost, run a redirect server on your localhost that redirects requests from localhost:2323 to [url-where-this-is-hosted]:2323
5. Use the browser to go to <https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=[client-id]&redirect_uri=http://localhost:2323&scope=heartrate>
6. Authenticate
7. Run `yarn save [YYYY-MM-DD]` (your data will be saved in _data/[YYYY-MM-DD]_)
