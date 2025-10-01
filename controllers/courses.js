import { Course } from '../models/Course.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { Bootcamp } from '../models/Bootcamp.js';
import { courseSchema, updateCourseSchema } from '../schema/courseSchema.js';

// @route              GET /api/v1/courses
// @route              GET /api/v1/bootcamp/:bootcampId/courses
// @desc               Get courses
// @access             Public
export const getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const courses = await Course.find({ bootcamp: req.params.bootcampId });
    return res.status(200).json({ success: true, data: courses });
  } else {
    res.status(200).json(res.advancedResults);
  }
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
  if (
    bootcamp.user.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    const err = new Error(
      `User with the email of ${req.user.email} dosen't have the ownership for this bootcamp`
    );
    err.status = 403;
    throw err;
  }

  const validatedData = courseSchema.parse(req.body);

  const newCourse = await Course.create({
    ...validatedData,
    user: req.user._id,
  });

  res.status(201).json({ success: true, data: newCourse });
});

// @route              PUT /api/v1/courses/:id
// @desc               Update course
// @access             Private
export const updateCourse = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  console.log(req.user);

  let course = await Course.findById(id);
  console.log(course);

  if (!course) {
    const err = new Error('No course found');
    err.status = 404;
    throw err;
  }

  if (!req.body) {
    const err = new Error('All fields must be provided');
    err.status = 400;
    throw err;
  }

  if (
    course.user.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    const err = new Error(
      `User with the email of ${req.user.email} dosen't have the ownership for this course`
    );
    err.status = 403;
    throw err;
  }

  const validatedData = updateCourseSchema.parse(req.body);

  course = await Course.findByIdAndUpdate(id, validatedData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: course });
});

// @route              DELETE /api/v1/courses/:id
// @desc               Delete course
// @access             Private
export const deleteCourse = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const course = await Course.findById(id);
  if (!course) {
    const err = new Error('No course found');
    err.status = 404;
    throw err;
  }

  if (
    course.user.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    const err = new Error(
      `User with the email of ${req.user.email} dosen't have the ownership for this course`
    );
    err.status = 403;
    throw err;
  }

  await course.deleteOne({ _id: id });

  res.status(200).json({ success: true });
});
