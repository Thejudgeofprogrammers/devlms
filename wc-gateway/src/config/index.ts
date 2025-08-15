export default () => ({
    port: parseInt(process.env.PORT, 10) || 4001,
    giga: {
        url: process.env.GIGA_URL,
        model: process.env.GIGA_MODEL,
        auth_key: process.env.AUTH_KEY,
        max_token: process.env.MAX_TOKEN,
        scope: process.env.SCOPE,
        client_secret: process.env.GIGA_CLIENT_SECRET,
        client_id: process.env.GIGA_CLIENT_ID
    }
});
