import express from 'express';
import {
  createBootcamp,
  deleteBootcamp,
  getBootcamp,
  getBootcamps,
  updateBootcamp,
} from '../controllers/bootcamps.js';

const router = express.Router();

router
  .route('/')
  .get(getBootcamps) // GET /api/v1/bootcamps
  .post(createBootcamp); // POST /api/v1/bootcamps

router
  .route('/:id')
  .get(getBootcamp) // GET /api/v1/bootcamps/:id
  .put(updateBootcamp) // PUT /api/v1/bootcamps
  .delete(deleteBootcamp); // DELETE /api/v1/bootcamps

export default router;
