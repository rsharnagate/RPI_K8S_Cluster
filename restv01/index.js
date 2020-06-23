const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const config = require('/sl/rest/config/config.json');

const app = express();

const PORT = config.REST_PORT || 5000;
const NODE_ENV = config.REST_ENV || 'development';

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


