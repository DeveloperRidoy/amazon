const express = require('express');
const app = express();
const dotenv = require('dotenv');
const connectDb = require('./mongodb/connectDb');
const AppError = require('./api/v1/controllers/appError');
const morgan = require('morgan');
const error = require('./api/v1/middleware/error');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');

// environmental variables
dotenv.config({ path: `${__dirname}/.env.local` });

// trust proxy 
app.enable('trust proxy');

// cors
app.use(cors({origin:process.env.NEXT_PUBLIC_WEBSITE, credentials: true}))

// preflight request 
app.options('*', cors())

// show api requests info
app.use(morgan('combined'))

// connnect to dataabase
connectDb();

// compress response
app.use(compression());
 
// body parser, cookie parser, urlencoding
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// routes
app.use('/api/v1/menus', require(`${__dirname}/api/v1/routes/menus`));
app.use('/api/v1/users', require(`${__dirname}/api/v1/routes/users`));
app.use('/api/v1/products', require(`${__dirname}/api/v1/routes/products`));
app.use('/api/v1/categories', require(`${__dirname}/api/v1/routes/categories`));
app.use('/api/v1/countries', require(`${__dirname}/api/v1/routes/countries`));
app.use('/api/v1/colors', require(`${__dirname}/api/v1/routes/colors`));

// 404 response
app.all('*', (req, res, next) => next(new AppError(404, 'Resource not found')));

// error handling middleware
app.use(error);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));

// close server on unhandled rejection
process.on('unhandledRejection', (err) => { 
  console.log(err);
  console.log('unhandled rejection, φ(゜▽゜*)♪, shutting down server...');
  server.close(() => process.exit(1))
})

// handling uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log(err);
  console.log("uncaught exception, φ(゜▽゜*)♪, shutting down server...");
  server.close(() => process.exit(1)); 
});


// handling SIGTERM
process.on('SIGTERM', () => {
  console.log('SIGTERM received. 👏 Shutting down gracefully.');
  server.close(() => console.log('💥Process terminated'));
  // sigterm already stops the program..so no need to call process.exit.
})