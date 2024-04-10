import dotenv from 'dotenv';

dotenv.config();

export default {
    connectionLimit : 1000, //important
    connectTimeout  : 60 * 60 * 1000,
    acquireTimeout  : 60 * 60 * 1000,
    timeout         : 60 * 60 * 1000,
    host: process.env.MYSQLCONNSTR_host,
    user: process.env.MYSQLCONNSTR_user,
    password: process.env.MYSQLCONNSTR_password,
    database: process.env.MYSQLCONNSTR_database,
    port: 3306,
    ssl: true,
    multipleStatements: true
};