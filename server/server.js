const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongo = require('./bin/init-mongo');
const logger = require('./bin/logger');
let routes = require('./routes/index');
let port = process.env.PORT || 3000;
let app = express();

logger.connect();
mongo.start();

app.set('views', path.join(__dirname));
app.set('view engine', 'jade');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use('/app', express.static(path.resolve(__dirname, 'app')));
app.use('/libs', express.static(path.resolve(__dirname, 'libs')));
app.use('/images', express.static(path.resolve(__dirname, 'app/images')));

app.use('/', routes);

let server = app.listen(port, function () {
    let host = server.address().address;
    let port = server.address().port;
    console.log('This express app is listening on port:' + port);
});

//*.SocketServer(app, server);
