const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const routes = require('./routes');

const app = express();
mongoose.connect('mongodb://laaksonen:bloodlessrevolver8@ds055485.mlab.com:55485/initialdb');

// App setup
app.use(morgan('combined'));
app.use(bodyParser.json({ type: '*/*' }));
routes(app);

// Server setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log('Server listening on:', port);
