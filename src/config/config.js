const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    development: {
        username: process.env.USER,
        password:
            process.env.MODE === 'PRODUCTION'
                ? process.env.PASSWORD_REMOTE
                : process.env.PASSWORD,
        database: process.env.DATABASE,
        host:
            process.env.MODE === 'PRODUCTION'
                ? process.env.HOST_REMOTE
                : process.env.HOST,
        port: process.env.DBPORT,
        dialect: 'postgres',
    },
};
