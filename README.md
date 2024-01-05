# Fitbit Data Export

## How to Run

1. Set up a Fitbit app on <https://dev.fitbit.com/apps>. Make sure it's of type `Personal`. Set the redirect url to `http://localhost:2323`.
2. Create _.env_ based on _.env.sample_
3. Run `yarn auth` and follow the instructions
    - If you're not running this on your localhost, you can run a redirect server on your localhost that redirects requests from localhost:2323 to [url-where-this-is-hosted]:2323
    - Alternatively, you can copy the code that you get after authenticating from the browser and paste it in the command line
4. Run `yarn save [YYYY-MM-DD]` (your data will be saved in _data/[YYYY-MM-DD]_)

## Visualization

To see a graph of the data, run `yarn visualize`
