morgan = require('morgan')
const fs = require('fs');
const path = require('path');

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' });

morgan (toLog = (tokens, req, res) => {
    return [
        `Time of request: ${new Date()}`,
        `HTTP method: ${tokens.method(req, res)}`,
        `Target path: ${tokens.url(req, res)}`,
        `Body: ${JSON.stringify(req.body, null, 2)}`,
        '---'
    ].join('\n');
});

const logger = morgan(toLog, { stream: accessLogStream });

module.exports = logger;
