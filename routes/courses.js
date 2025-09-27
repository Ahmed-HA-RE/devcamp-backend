import express from 'express';
import {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} from '../controllers/courses.js';

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(getCourses) // GET /api/v1/courses && GET /api/v1/bootcamps/:bootcampId/courses
  .post(createCourse); // POST /api/v1/bootcamps/:bootcampId/courses

router
  .route('/:id')
  .get(getCourse) // GET /api/v1/courses/:id
  .put(updateCourse) // PUT /api/v1/courses/:id
  .delete(deleteCourse); // DELETE /api/v1/courses/:id

export default router;
