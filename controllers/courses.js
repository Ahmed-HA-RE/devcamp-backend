import { Course } from '../models/Course.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { Bootcamp } from '../models/Bootcamp.js';
import { courseSchema } from '../schema/courseSchema.js';

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

// @route              GET /api/v1/courses/:id
// @desc               Get single course
// @access             Public
export const getCourse = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const course = await Course.findById(id).populate({
    path: 'bootcamp',
    select: 'name description',
  });

  if (!course) {
    const err = new Error('No course found');
    err.status = 404;
    throw err;
  }

  res.status(200).json({ success: true, data: course });
});

// @route              POST /api/v1/bootcamps/:bootcampId/courses
// @desc               Create course
// @access             Private
export const createCourse = asyncHandler(async (req, res, next) => {
  const bootcampId = req.params.bootcampId;
  req.body.bootcamp = bootcampId;

  const bootcamp = await Bootcamp.findById(bootcampId);

  if (!bootcamp) {
    const err = new Error('No bootcamp found');
    err.status = 404;
    throw err;
  }

  const validatedData = courseSchema.parse(req.body);

  const newCourse = await Course.create(validatedData);

  res.status(201).json({ success: true, data: newCourse });
});
