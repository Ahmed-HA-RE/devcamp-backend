import { Bootcamp } from '../models/Bootcamp.js';
import { bootcampSchema, updatedBootcampSchema } from '../schema/bootcamp.js';
import asyncHandler from '../middleware/asyncHandler.js';

// @route              GET /api/v1/bootcamps
// @desc               Get all the bootcamps
// @access             Public
export const getBootcamps = asyncHandler(async (req, res, next) => {
  let query;

  const reqQuery = { ...req.query };

  const removeFields = ['select', 'sort', 'page', 'limit'];

  removeFields.forEach((field) => delete reqQuery[field]);

  let queryStr = JSON.stringify(reqQuery);

  queryStr = JSON.parse(
    queryStr.replace(/\b(gt|gte|lt|lte|in|eq)\b/g, (match) => `$${match}`)
  );

  query = Bootcamp.find(queryStr).populate({
    path: 'courses',
    select: 'title weeks',
  });

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Bootcamp.countDocuments();

  query = query.limit(limit).skip(startIndex);

  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  if (req.query.sort) {
    const fields = req.query.sort.split(',').join(' ');
    query = query.sort(fields);
  } else {
    query = query.sort({ createdAt: -1 });
  }

  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  const bootcamps = await query;

  if (!bootcamps) {
    const err = new Error('No bootcamps found');
    err.status = 404;
    throw err;
  }

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    pagination,
    data: bootcamps,
  });
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

  res.status(200).json({ success: true, data: bootcamp });
});

// @route              DELETE /api/v1/bootcamps
// @desc               Delete bootcamp
// @access             Private
export const deleteBootcamp = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const bootcamp = await Bootcamp.findById(id);

  if (!bootcamp) {
    const err = new Error(`No bootcamp found`);
    err.status = 404;
    throw err;
  }

  await bootcamp.deleteOne();

  res.status(200).json({ success: true });
});

// @route              GET /api/v1/bootcamps/radius/:long/:lat/:distance
// @desc               Get bootcamps within a radius
// @access             Private
export const getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { long, lat, distance } = req.params;

  const radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[long, lat], radius] } },
  });

  res
    .status(200)
    .json({ success: true, count: bootcamps.length, data: bootcamps });
});
