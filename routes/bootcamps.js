import express from 'express';
import {
  createBootcamp,
  deleteBootcamp,
  getBootcamp,
  getBootcamps,
  updateBootcamp,
  getBootcampsInRadius,
} from '../controllers/bootcamps.js';
import coursesRoutes from './courses.js';

const router = express.Router();

// Re-route to another resource routers
router.use('/:bootcampId/courses', coursesRoutes);

router
  .route('/')
  .get(getBootcamps) // GET /api/v1/bootcamps
  .post(createBootcamp); // POST /api/v1/bootcamps

router
  .route('/:id')
  .get(getBootcamp) // GET /api/v1/bootcamps/:id
  .put(updateBootcamp) // PUT /api/v1/bootcamps
  .delete(deleteBootcamp); // DELETE /api/v1/bootcamps

router.route('/radius/:long/:lat/:distance').get(getBootcampsInRadius); //GET /api/v1/bootcamps/radius/:long/:lat/:distance

export default router;
