const express = require('express');
const next = require('next');
const dotenv = require('dotenv');
const connectDb = require('./mongodb/connectDb');
const AppError = require('./api/v1/controllers/appError');
const error = require('./api/v1/middleware/error');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const morgan = require('morgan');

// environmental variables
dotenv.config({ path: `${__dirname}/.env.local` });

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare()
  .then(() => {
    const server = express();

    // show api requests info in development mode
    if(dev) server.use(morgan("combined"));

    // connnect to dataabase
    connectDb();

    // compress response
    server.use(compression());

    // body parser, cookie parser, urlencoding
    server.use(express.json());
    server.use(cookieParser());
    server.use(express.urlencoded({ extended: true, limit: "10kb" }));

    // routes
    const routes = [
      "menus",
      "users",
      "products",
      "categories",
      "countries",
      "colors",
    ];

    // handle api requests
    routes.forEach((route) =>
      server.use(
        `/api/v1/${route}`,
        require(`${__dirname}/api/v1/routes/${route}`)
      )
    );
    server.use(
      "/api/v1/create-checkout-session",
      require(`${__dirname}/api/v1/routes/checkout`)
    );

    // 404 response for api
    server.all(/^\/api/, (req, res, next) =>
      next(new AppError(404, "Resource not found"))
    );

    // handle nextJs requests
    server.get("*", (req, res) => handle(req, res));

    // error handling middleware
    server.use(error);

    // define port
    const PORT = process.env.PORT || 3000;

    // start server
    server.listen(PORT, (err) => {
      if (err) throw err;
      console.log(`Server running on PORT ${PORT}`);
    });
  })
  .catch(err => {
    console.log('shutting down server on error')
    console.log(err);
    process.exit(1);
  })
