import express from 'express';
import { getCourses } from '../controllers/courses.js';

const router = express.Router({ mergeParams: true });

router.route('/').get(getCourses); // GET /api/v1/courses && GET /api/v1//bootcamp/:bootcampId/courses

export default router;
