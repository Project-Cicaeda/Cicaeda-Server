export default () => ({
    jwt: {
        secret: process.env.JWT_SECRET, 
    },
    database: {
        connectionString: process.env.MONGODB_URL,
    }
});
//Added to pass the confidential info securely instead of staticly coding  