const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    development: {
        username: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE,
        host: process.env.HOST,
        port: process.env.DBPORT,
        dialect: 'postgres',
    },
};
