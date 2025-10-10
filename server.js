import express from 'express';
import dotenv from 'dotenv';
import bootcampsRouter from './routes/bootcamps.js';
import coursesRouter from './routes/courses.js';
import authRouter from './routes/auth.js';
import userRouter from './routes/users.js';
import reviewsRouter from './routes/reviews.js';
import { connectDB } from './config/database.js';
import { logger } from './middleware/logger.js';
import path from 'path';
import { errorHandler } from './middleware/errorHandler.js';
import cookieParser from 'cookie-parser';
import ExpressMongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import { xss } from 'express-xss-sanitizer';
import limiter from './config/rateLimiter.js';
import hpp from 'hpp';
import cors from 'cors';

dotenv.config();

const app = express();
connectDB();

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('query parser', 'extended');
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet());
app.use(xss());
app.use(limiter);
app.use(hpp());
app.use(cors());

const PORT = process.env.PORT || 8000;

app.use(logger);

// bootcamps router
app.use('/api/v1/bootcamps', bootcampsRouter);

// courses router
app.use('/api/v1/courses', coursesRouter);

// auth router
app.use('/api/v1/auth', authRouter);

// reviews router
app.use('/api/v1/reviews', reviewsRouter);

// users router for admins only
app.use('/api/v1/users', userRouter);

// Sanitize data
app.use(ExpressMongoSanitize());

// Not Found middleware
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error middleware
app.use(errorHandler);

app.listen(PORT, () =>
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port:${PORT}`.yellow
      .bold
  )
);
