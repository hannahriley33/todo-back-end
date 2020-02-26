const app = express();
const PORT = process.env.PORT;
app.use(morgan('dev')); // http logging
app.use(cors()); // enable CORS request
const Client = pg.Client;
const client = new Client(process.env.DATABASE_URL);
client.connect();
require('dotenv').config();
// Application Dependencies
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const pg = require('pg');



