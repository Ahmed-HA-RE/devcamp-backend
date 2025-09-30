import express from 'express';
import {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} from '../controllers/courses.js';
import { Course } from '../models/Course.js';
import { advancedResults } from '../middleware/advancedResults.js';
import protect from '../middleware/auth.js';

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(
    advancedResults(Course, { path: 'bootcamp', select: 'name description' }),
    getCourses
  ) // GET /api/v1/courses && GET /api/v1/bootcamps/:bootcampId/courses
  .post(protect, createCourse); // POST /api/v1/bootcamps/:bootcampId/courses

router
  .route('/:id')
  .get(getCourse) // GET /api/v1/courses/:id
  .put(protect, updateCourse) // PUT /api/v1/courses/:id
  .delete(protect, deleteCourse); // DELETE /api/v1/courses/:id

export default router;
