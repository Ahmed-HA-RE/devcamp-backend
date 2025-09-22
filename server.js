import express from 'express';
import dotenv from 'dotenv';
import bootcampsRoute from './routes/bootcamps.js';
import { logger } from './middleware/logger.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(logger);
app.use('/api/v1/bootcamps', bootcampsRoute);

app.listen(PORT, () =>
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port:${PORT}`
  )
);
