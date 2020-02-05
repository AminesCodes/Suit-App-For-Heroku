/*
Server Pg-Promise Connection | SUITAPP Web App
GROUP 1: Amine Bensalem, Douglas MacKrell, Savita Madray, Joseph P. Pasaoa
*/


const pgp = require('pg-promise')();
const connectString = process.env.DATABASE_URL;
const db = pgp(connectString);


module.exports = db;
