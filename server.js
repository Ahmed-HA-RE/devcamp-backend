import express from 'express';
import dotenv from 'dotenv';
import bootcampsRouter from './routes/bootcamps.js';
import { connectDB } from './config/database.js';
import { logger } from './middleware/logger.js';

dotenv.config();

const app = express();
connectDB();

const PORT = process.env.PORT || 8000;

app.use(logger);

// bootcamps router
app.use('/api/v1/bootcamps', bootcampsRouter);

app.listen(PORT, () =>
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port:${PORT}`.yellow
      .bold
  )
);
