const mysql = require('mysql');
const MySQLEvents = require('@rodrigogs/mysql-events');
const { Pool } = require('pg')
require('dotenv').config();
const { PG_CONNECT, MYSQL_CONNECT } = require("./connection");

const pool = new Pool(PG_CONNECT)

const program = async () => {
    const connection = mysql.createConnection(MYSQL_CONNECT);

    const instance = new MySQLEvents(connection, {
        startAtEnd: true,
        excludedSchemas: {
            mysql: true,
        },
    });

    await instance.start();

    instance.addTrigger({
        name: 'TRIGGER_NODE_FIREBIRD',
        expression: 'teste.automacao',
        statement: MySQLEvents.STATEMENTS.ALL,
        onEvent: (event) => { // You will receive the events here
            console.log(event);
            console.log(event.affectedRows);
            const { Id, valor, litros, precio, tempo, bico, data, numerador, identificador, registro, unidade, divisor } = event.affectedRows[0].after;

            const insertQuery = 'INSERT INTO tabela_teste(id,valor,total) VALUES($1, $2, $3) RETURNING id';
            const values = [Id, valor, litros];

            pool
                .connect()
                .then(client => {
                    return client
                        .query(insertQuery, values)
                        .then(res => {
                            client.release()
                            console.log(res.rows[0])
                        })
                        .catch(err => {
                            client.release()
                            console.log(err.stack)
                        })
                });



        },
    });

    instance.on(MySQLEvents.EVENTS.CONNECTION_ERROR, console.error);
    instance.on(MySQLEvents.EVENTS.ZONGJI_ERROR, console.error);
};


program()
    .then(() => console.log('Waiting for database events...'))
    .catch(console.error);

