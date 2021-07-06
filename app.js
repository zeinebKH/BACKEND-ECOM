const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// import routes
const productsRoute = require('./routes/products');
const ordersRoute = require('./routes/orders');

app.use(bodyParser.json());

// use routes
app.use('/api/products', productsRoute);
app.use('/api/orders', ordersRoute);



app.use(cors({
    origin: "*",
    methods: ['GET','POST','PATH','DELETE','PUT'],
    allowedHeaders: 'Content-type, Authorization, Origin, X-Requested-with, Accept',
    preflightContinue: false,
    optionsSuccessStatus: 204
}))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



module.exports = app



