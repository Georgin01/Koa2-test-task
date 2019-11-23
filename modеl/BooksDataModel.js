const DB = require('../database/db');
const { dbConfig } = require('../config');

const db = new DB(dbConfig);

const findBooksAuthors =  (fields, table) => `SELECT ${fields} FROM ${table}`;

const findBooksData = (fields, table) => `SELECT ${fields} FROM ${table}
                                    JOIN books ON books_data.book_id = books.id
                                    JOIN authors ON books_data.author_id = authors.id`;

const createBooksData = (insert) =>  {
    let queryArray = [];
    const booksFields = Object.keys(insert.books);
    const booksValues = Object.values(insert.books).map(item => `'${item}'`);
    const authorsFields = Object.keys(insert.authors);
    const authorsValues = Object.values(insert.authors);

    const firstQuery = `INSERT INTO books(${booksFields}) VALUES (${booksValues.join(", ")});`;
    const secondQuery = `INSERT INTO authors(${authorsFields}) VALUES ('${authorsValues}') ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id);`;
    const thirdQuery = (booksId, authorsId) => `INSERT INTO books_data(book_id, author_id) VALUES (${booksId}, ${authorsId});`;

    queryArray.push(firstQuery, secondQuery, thirdQuery);

    return queryArray;
};

const updateBooksData = (insert) => `UPDATE books_data 
                                    JOIN books ON books_data.book_id = books.id
                                    JOIN authors ON books_data.author_id = authors.id
                                    SET ${insert.updates}
                                    WHERE ${insert.conditions};`;

//here we combine all the tables, so we do not need to pass them as parameters
class BooksDataModel {

    static async find(field, table, context, queryFn){
        let query = queryFn(field, table);

        if (context.conditions){
            let conditionField = context.conditions;

            query += ` WHERE ${conditionField}`;
        }

        if (context.groupBy) query += ` GROUP BY ${context.groupBy}`;
        if (context.orderBy) query += ` ORDER BY  ${context.orderBy}`;

        let limit = (context.limit > 0) ? context.limit : 100;
        query += ` LIMIT ${limit}`;

        if (context.offset) query += ` OFFSET ${context.offset}`;

        try {
            return await db.query(query);
        }catch (e) {
            return e.message;
        }
    }

    static async findAuthors(context){

        let field = '';
        if (context.fields){field = context.fields;}
        else field = '*';

        return BooksDataModel.find(field, `authors`, context, findBooksAuthors);
    }

    static async findBooks(context){

        let field = '';
        if (context.fields){field = context.fields;}
        else field = '*';

        return BooksDataModel.find(field, `books`, context, findBooksAuthors);
    }

    static async findByField(context){

        let field = '';
        if (context.fields) {field = context.fields;}
        else field = 'title, date, description, image, author_name';

       return BooksDataModel.find(field, 'books_data', context, findBooksData);
    }

    static async create(context){
        const query = createBooksData(context);

        try {
            return await db.transaction(query);
        }catch (e) {
            return e;
        }
    }

    static async update(context){
        const query = updateBooksData(context);

        try {
            return await db.query(query);
        }catch (e) {
            return e;
        }
    }

}

module.exports = BooksDataModel;