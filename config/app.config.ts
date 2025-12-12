// server base url
export const URL =
  process.env.NEXT_PUBLIC_API_ENDPOINT || "http://127.0.0.1:4000";
// app config
export const AppConfig = () => ({
  app: {
    // server endpoint
    url: URL,
    name: "Ollivu",
    slogan: "Ollivu",
    meta: {
      description: "Ollivu",
      keywords: "Ollivu",
    },

    // api endpoint
    apiUrl: `${URL}/api`,
  },
});
