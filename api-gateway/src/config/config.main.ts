export default () => ({
    port: parseInt(process.env.PORT, 10) || 5050,
    jwt_options: {
        secret: process.env.SECRET,
        expire: process.env.EXPIRE,
    },
    redis: {
        port: parseInt(process.env.REDIS_PORT, 10) || 6379,
        host: process.env.REDIS_HOST,
    }
});
