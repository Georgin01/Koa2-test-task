const Model = require('../modеl/BooksDataModel');
const { BadRequestError } = require('../handlers/error_handling');

//Base method to use in findBooks, findAuthors, findBooksData
async function find(ctx, queryFn){
    const context = {};

    context.fields = ctx.query.fields;
    context.conditions = ctx.query.conditions;
    context.limit = parseInt(ctx.query.limit, 10);
    context.offset = parseInt(ctx.query.offset, 10);
    context.groupBy = ctx.query.groupBy;
    context.orderBy = ctx.query.orderBy;

    try {
        const rows = await queryFn(context);
        ctx.body = rows;
    }catch (e) {
        ctx.body = e.message;
    }

}

async function findBooks(ctx){
    return find(ctx, Model.findBooks);
}

async function findAuthors(ctx){
    return find(ctx, Model.findAuthors);
}

async function findBooksData(ctx) {
    return find(ctx, Model.findByField);
}

async function create(ctx){
    const context = {};

    context.books = ctx.request.body.books;
    context.authors = ctx.request.body.authors;

    if (!context.authors || !context.books.title){
        throw new BadRequestError('Required fields are blank!');
    }

    try {
       const rows = await Model.create(context);
       ctx.body = rows;
       if (rows.affectedRows !== 0) ctx.body = "Row was affected!";
       else ctx.body = "Error! Row was not affected";
    }catch (e) {
        ctx.body = e.message;
    }
}

async function update(ctx){
    const context = {};

    context.updates = ctx.query.updates;
    context.conditions = ctx.query.conditions;

    if (!context.conditions || !context.updates){
        throw new BadRequestError('Fields are required!');
    }

    try {
        const rows = await Model.update(context);
        ctx.body = rows;
    }catch (e) {
        ctx.body = e.message;
    }
}

module.exports = {
    findBooks,
    findAuthors,
    findBooksData,
    create,
    update
};
