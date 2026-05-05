// Convex auth config reads the Google Client ID from deployment env vars
// (set via `convex env set AUTH_GOOGLE_ID ...`). Keeps the ID out of the
// public repo. The Client Secret (AUTH_GOOGLE_SECRET) is also set on the
// deployment and stays encrypted — only used if we later switch to a
// server-side OAuth code-exchange flow.

export default {
  providers: [
    {
      domain: "https://accounts.google.com",
      applicationID: process.env.AUTH_GOOGLE_ID,
    },
  ],
};
