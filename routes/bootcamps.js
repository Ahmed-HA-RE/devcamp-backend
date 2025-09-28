import express from 'express';
import {
  createBootcamp,
  deleteBootcamp,
  getBootcamp,
  getBootcamps,
  updateBootcamp,
  getBootcampsInRadius,
  uploadPhoto,
} from '../controllers/bootcamps.js';
import coursesRoutes from './courses.js';
import multer from 'multer';
import { advancedResults } from '../middleware/advancedResults.js';
import { Bootcamp } from '../models/Bootcamp.js';

// Multer config
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const router = express.Router();

// Re-route to another resource routers
router.use('/:bootcampId/courses', coursesRoutes);

router
  .route('/')
  .get(
    advancedResults(Bootcamp, { path: 'courses', select: 'title description' }),
    getBootcamps
  ) // GET /api/v1/bootcamps
  .post(createBootcamp); // POST /api/v1/bootcamps

router
  .route('/:id')
  .get(getBootcamp) // GET /api/v1/bootcamps/:id
  .put(updateBootcamp) // PUT /api/v1/bootcamps
  .delete(deleteBootcamp); // DELETE /api/v1/bootcamps

router.route('/radius/:long/:lat/:distance').get(getBootcampsInRadius); //GET /api/v1/bootcamps/radius/:long/:lat/:distance

router.route('/:id/photo').put(upload.single('photo'), uploadPhoto);

export default router;
