import { Course } from '../models/Course.js';
import asyncHandler from '../middleware/asyncHandler.js';

// @route              GET /api/v1/courses
// @route              GET /api/v1/bootcamp/:bootcampId/courses
// @desc               Get courses
// @access             Public
export const getCourses = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.bootcampId) {
    query = Course.find({ bootcamp: req.params.bootcampId });
  } else {
    query = Course.find().populate({
      path: 'bootcamp',
      select: 'name description',
    });
  }

  const courses = await query;

  if (!courses) {
    const err = new Error('No courses found');
    err.status = 404;
    throw err;
  }

  res.status(200).json({ success: true, count: courses.length, data: courses });
});
