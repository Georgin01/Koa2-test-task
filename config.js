const dbConfig = {
    host: "localhost",
    database: "books_tt",
    port: 3306,
    user: "root",
    password: ""
};

const appConfig = {
    port: process.env.HTTP_PORT || 3000
};

module.exports = {
    dbConfig,
    appConfig
};