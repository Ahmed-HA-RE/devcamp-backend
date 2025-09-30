import express from 'express';
import dotenv from 'dotenv';
import bootcampsRouter from './routes/bootcamps.js';
import coursesRouter from './routes/courses.js';
import authRouter from './routes/auth.js';
import { connectDB } from './config/database.js';
import { logger } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('query parser', 'extended');
app.use(cookieParser());

const PORT = process.env.PORT || 8000;

app.use(logger);

// bootcamps router
app.use('/api/v1/bootcamps', bootcampsRouter);

// courses router
app.use('/api/v1/courses', coursesRouter);

// auth router
app.use('/api/v1/auth', authRouter);

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
