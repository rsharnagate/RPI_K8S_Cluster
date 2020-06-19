const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const path = require('path');

const app = express();

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

app.set('port', PORT);
app.set('env', NODE_ENV);

app.use(logger('tiny'));
app.use(bodyParser.json());

//app.use('/', require(path.join(__dirname, 'routes')));

var category = require('./routes/category');
app.use('/v1/categories', category);

app.use((req, res, next) => {
    const err = new Error(`${req.method} ${req.url} not found`);
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500);
    res.json({
        error: {
            message: err.message
        }
    });
});

app.listen(PORT, () => {
    console.log(
        `Server started on port ${app.get('port')} | Environment : ${app.get('env')}`);
});


