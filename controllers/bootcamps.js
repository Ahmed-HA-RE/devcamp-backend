import { Bootcamp } from '../models/Bootcamp.js';
import { bootcampSchema, updatedBootcampSchema } from '../schema/bootcamp.js';
import asyncHandler from '../middleware/asyncHandler.js';

// @route              GET /api/v1/bootcamps
// @desc               Get all the bootcamps
// @access             Public
export const getBootcamps = asyncHandler(async (req, res, next) => {
  const bootcamps = await Bootcamp.find();

  if (!bootcamps) {
    const err = new Error('No bootcamps found');
    err.status = 404;
    throw err;
  }

  res
    .status(200)
    .json({ success: true, count: bootcamps.length, data: bootcamps });
});

// @route              GET /api/v1/bootcamps/:id
// @desc               Get single bootcamp
// @access             Public
export const getBootcamp = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const bootcamp = await Bootcamp.findById(id);

  if (!bootcamp) {
    const err = new Error(`No bootcamp found with the id of ${id}`);
    err.status = 404;
    throw err;
  }

  res.status(200).json({ success: true, data: bootcamp });
});

// @route              POST /api/v1/bootcamps
// @desc               Create new bootcamp
// @access             Private
export const createBootcamp = asyncHandler(async (req, res, next) => {
  const validatedData = bootcampSchema.parse(req.body);

  const newBootcamp = await Bootcamp.create(validatedData);

  res.status(201).json({ success: true, data: newBootcamp });
});

// @route              PUT /api/v1/bootcamps
// @desc               Update bootcamp
// @access             Private
export const updateBootcamp = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (!req.body) {
    const err = new Error(`Please include the fields you want to update`);
    err.status = 400;
    throw err;
  }

  const validatedData = updatedBootcampSchema.parse(req.body);

  const bootcamp = await Bootcamp.findOneAndUpdate({ _id: id }, validatedData, {
    new: true,
    runValidators: true,
  });

  if (!bootcamp) {
    const err = new Error(`No bootcamp found`);
    err.status = 404;
    throw err;
  }

  return res.status(200).json({ success: true, data: bootcamp });
});

// @route              DELETE /api/v1/bootcamps
// @desc               Delete bootcamp
// @access             Private
export const deleteBootcamp = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const bootcamp = await Bootcamp.findOneAndDelete({ _id: id });

  if (!bootcamp) {
    const err = new Error(`No bootcamp found`);
    err.status = 404;
    throw err;
  }

  return res.status(200).json({ success: true });
});
