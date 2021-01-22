const PgConnection = require('postgresql-easy');
const dbConfig = require('./x');
const pg = new PgConnection(dbConfig);

module.exports = pg;

