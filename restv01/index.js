const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');

const app = express();

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'dev';

app.use(logger('tiny'));
app.use(bodyParser.json());

app.use('/v1/categories', require('./routes/category'));
app.use('/v1/channels', require('./routes/channel'));
app.use('/v1/commands', require('./routes/command'));
app.use('/v1/publish', require('./routes/publish'));

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
        `Server started on port ${PORT} | Environment : ${NODE_ENV}`);
});


