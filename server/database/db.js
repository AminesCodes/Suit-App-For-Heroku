/*
Server Pg-Promise Connection | SUITAPP Web App
GROUP 1: Amine Bensalem, Douglas MacKrell, Savita Madray, Joseph P. Pasaoa
*/


const pgp = require('pg-promise')();
const db = pgp(process.env.DATABASE_URL);


module.exports = db;
