const fs = require('fs');
const path = require('path');

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' });

const requestLogger = (req, res, next) => {
    const log = [
        `time: ${new Date()}`,
        `HTTP request method: ${req.method}`,
        `request target path: ${req.path}`,
        `request body: ${JSON.stringify(req.body, null, 2)}`,
        '-------'
    ].join('\n');

    accessLogStream.write(log + '\n');
    next();
}

module.exports = requestLogger;
