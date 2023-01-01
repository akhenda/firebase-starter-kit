import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import noCache from 'nocache';

import { camelcase, removeEmptyProperties } from './middleware';

// https://itnext.io/running-express-js-on-firebase-cloud-functions-a20b536c6aec
// https://stackoverflow.com/a/57451612/5400873
// https://codeburst.io/express-js-on-cloud-functions-for-firebase-f76b5506179
export default () => {
  const app = express();

  app.use(helmet());
  app.use(noCache());
  app.use(cors<cors.CorsRequest>({ origin: true }));
  app.use(morgan('dev'));
  app.use(compression());
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(camelcase());
  app.use(removeEmptyProperties());

  // To parse URL encoded data
  // https://www.freecodecamp.org/news/express-explained-with-examples-installation-routing-middleware-and-more/
  app.use(bodyParser.urlencoded({ extended: false }));

  /**
   * Used in development
   */
  if (process.env.NODE_ENV === 'development') {
    // app.use(errorhandler());
  }

  return app;
};
