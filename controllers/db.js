import mysql from 'mysql';
import mysqlConfig from '../config/db.config.js';

export default new mysql.createPool(mysqlConfig);