const Router = require('koa-router');
const bookData = require('../controllers/booksDataController');

const router = new Router();

//GET books BY FIELD ROUTER
router.get('/find_books', bookData.findBooks);

//GET authors BY FIELD ROUTER
router.get('/find_authors', bookData.findAuthors);

//GET books_data BY FIELD ROUTER
router.get('/find_books_data', bookData.findBooksData);

//POST QUERY TO CREATE NEW DATA
router.post('/add_data', bookData.create);

//PUT QUERY TO UPDATE NEW DATA
router.put('/update_data', bookData.update);

module.exports = router;