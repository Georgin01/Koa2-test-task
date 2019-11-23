const Koa = require('koa');
const bodyParser = require('koa-body');
const { appConfig } = require('./config.js');

const app = new Koa();

const routes = require('./routes/BooksDataRouter');

app.use(bodyParser());
app.use(routes.routes());
app.use(routes.allowedMethods());

app.listen(appConfig.port, () => {
    console.log(`Server Started on port: ${appConfig.port}!`);
});