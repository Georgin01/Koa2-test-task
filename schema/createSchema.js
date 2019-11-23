const DB = require('../database/db');
const { dbConfig } = require('../config');

//SQL SCRIPTS for creating schema

//DROP, CREATE, USE DB
const dropDbScript = (db) => `DROP DATABASE IF EXISTS \`${db}\`;`;
const createDbScript = (db) => `CREATE DATABASE \`${db}\`;`;
const useDbScript = (db) => `USE \`${db}\`;`;

//DROP, CREATE TABLES
const dropAuthorsTblScript = 'DROP TABLE IF EXISTS `authors`';
const dropBooksTblScript = 'DROP TABLE IF EXISTS `books`';
const dropBooksDataTblScript = 'DROP TABLE IF EXISTS `books_data`';
const createAuthorsTblScript = 'CREATE TABLE `authors`' +
    '(' +
    '`id` INT NOT NULL AUTO_INCREMENT,' +
    '`author_name` VARCHAR(70),' +
    'PRIMARY KEY(`id`),' +
    'UNIQUE KEY(`author_name`)' +
    ');';
const createBooksTblScript = 'CREATE TABLE `books`' +
    '(' +
    '`id` INT NOT NULL AUTO_INCREMENT,' +
    '`title` NOT NULL VARCHAR(200),' +
    '`date` DATE,' +
    '`description` TEXT(1000),' +
    '`image` VARCHAR(300),' +
    'PRIMARY KEY(`id`)' +
    ');';
const createBooksDataTblScript = 'CREATE TABLE `books_data`' +
    '(' +
    '`book_id` INT NOT NULL,' +
    '`author_id` INT NOT NULL,' +
    'FOREIGN KEY(`book_id`) REFERENCES `books`(`book_id`),' +
    'FOREIGN KEY(`author_id`) REFERENCES `authors`(`author_id`),' +
    'UNIQUE(`book_id`, `author_id`)' +
    ');';

//Using SQL scripts
if(!module.parent){
    (async () => {
        const db = new DB(dbConfig);

        await db.query(dropDbScript(dbConfig.database));
        await db.query(createDbScript(dbConfig.database));
        await db.query(useDbScript(dbConfig.database));

        await db.query(dropAuthorsTblScript);
        await db.query(dropBooksTblScript);
        await db.query(dropBooksDataTblScript);
        await db.query(createAuthorsTblScript);
        await db.query(createBooksTblScript);
        await db.query(createBooksDataTblScript);

        db.close();
    })();
}

