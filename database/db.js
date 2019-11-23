const mysql = require('mysql');

class Connection {
    constructor(dbConfig) {
        //Сreate pool connection
        this.connection = mysql.createPool(dbConfig);

        this.connection.getConnection((err) => {
            if (err) {
                if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                    console.error('Database connection was closed.');
                }
                if (err.code === 'ER_CON_COUNT_ERROR') {
                    console.error('Database has too many connections.');
                }
                if (err.code === 'ECONNREFUSED') {
                    console.error('Database connection was refused.');
                }
            }else {
                console.log("Successfully connected to the database.");
            }
        });
    }

    //Close database
    close(){
        this.connection.end();
    }

    //Create a Sql Query
    query(sqlScript){
        return new Promise((res, rej) => {
            this.connection.query(sqlScript, (err, result) =>{
                if (err){
                    rej(err);
                } else res(result);
            });
        });
    }

    //Transactions
    transaction(queryArray){
        return new Promise((res, rej) => {
            const resultArray = [];
            this.connection.getConnection(async (err, connection) => {
                await this.asyncTransaction(connection, async () => {
                    const books = await this.asyncQuery(connection, queryArray[0]);
                    const authors = await this.asyncQuery(connection, queryArray[1]);
                    const books_data = await this.asyncQuery(connection, queryArray[2](books.insertId, authors.insertId), true);
                    resultArray.push({books_data});
                });
                res(resultArray);
            });
        });
    }

    asyncTransaction(connection, transactionEvent) {
        return new Promise((resolve, reject) => {
            connection.beginTransaction(async (err) => {
                if(err) reject(err);
                await transactionEvent();
                resolve();
            });
        });
    }

    asyncQuery(connection, query, needCommit = false) {
        return new Promise((resolve, reject) => {
            connection.query(query, (err, result) => {
                if (err) return connection.rollback(()=> {throw err});
                if (needCommit) {
                    connection.commit((err) => {
                        if (err) return connection.rollback(()=> {throw err});
                    });
                }
                resolve(result);
            });
        });
    }
}

module.exports = Connection;