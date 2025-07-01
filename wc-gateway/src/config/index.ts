export default () => ({
    port: parseInt(process.env.PORT, 10) || 5050,
    giga: {
        url: process.env.GIGA_URL,
        model: process.env.GIGA_MODEL,
        token: process.env.GIGA_TOKEN,
        api: process.env.GIGA_API,
        temperature: process.env.TEMP,
    }
});
