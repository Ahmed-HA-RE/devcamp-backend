import { Bootcamp } from '../models/Bootcamp.js';
import { bootcampSchema, updatedBootcampSchema } from '../schema/bootcamp.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { uploadPhotoToCloudinary } from '../config/cloudinary.js';

// @route              GET /api/v1/bootcamps
// @desc               Get all the bootcamps
// @access             Public
export const getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
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

  // Publisher should only publish one bootcamp with the associated id
  const publishedBootcamp = await Bootcamp.findOne({ user: req.user._id });

  if (publishedBootcamp && req.user.role === 'publisher') {
    const err = new Error(
      `The user with the email of ${req.user.email} has already published an bootcamp`
    );
    err.status = 403;
    throw err;
  }

  const newBootcamp = await Bootcamp.create({
    ...validatedData,
    user: req.user.id,
  });

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

  let bootcamp = await Bootcamp.findById(id);

  if (!bootcamp) {
    const err = new Error(`No bootcamp found`);
    err.status = 404;
    throw err;
  }

  if (
    req.user._id.toString() !== bootcamp.user.toString() &&
    req.user.role !== 'admin'
  ) {
    const err = new Error(
      `Not Authorized to update the bootcamp as the publisher with the email ${req.user.email} dosen't have the ownership.`
    );
    err.status = 403;
    throw err;
  }

  bootcamp = await Bootcamp.findByIdAndUpdate(id, validatedData, {
    new: true,
    runValidators: true,
  });

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

  if (
    req.user._id.toString() !== bootcamp.user.toString() &&
    req.user.role !== 'admin'
  ) {
    const err = new Error(
      `Not Authorized to update the bootcamp as the publisher with the email ${req.user.email} dosen't have the ownership.`
    );
    err.status = 403;
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

// @route              PUT /api/v1/bootcamps/:id/photo
// @desc               Update bootcamp to upload photo
// @access             Private
export const uploadPhoto = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (!req.body) {
    const err = new Error('Please add a photo');
    err.status = 400;
    throw err;
  }

  if (!req.file.mimetype.startsWith('image')) {
    const err = new Error('Please upload a file images extension');
    err.status = 400;
    throw err;
  }
  const photo = await uploadPhotoToCloudinary(req.file);

  let bootcamp = await Bootcamp.findById(id);

  if (!bootcamp) {
    const err = new Error(`No bootcamp found`);
    err.status = 404;
    throw err;
  }

  if (
    req.user._id.toString() !== bootcamp.user.toString() &&
    req.user.role !== 'admin'
  ) {
    const err = new Error(
      `Not Authorized to update the bootcamp as the publisher with the email ${req.user.email} dosen't have the ownership.`
    );
    err.status = 403;
    throw err;
  }

  bootcamp = await Bootcamp.findByIdAndUpdate(
    id,
    { photo: photo.secure_url },
    { new: true }
  );

  res.status(200).json({ success: true, file: photo.display_name });
});
