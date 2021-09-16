const MYSQL_CONNECT = {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER_DB,
    password: process.env.MYSQL_PASS_DB,
}
const PG_CONNECT = {
    user: process.env.PG_USER_DB,
    host: process.env.PG_HOST,
    database: process.env.PG_DB,
    password: process.env.PG_PASS_DB,
    port: process.env.PG_PORT,
};


module.exports = { MYSQL_CONNECT, PG_CONNECT }