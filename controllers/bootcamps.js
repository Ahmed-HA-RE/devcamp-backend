import mongoose from 'mongoose';
import { Bootcamp } from '../models/Bootcamp.js';
import { bootcampSchema, updatedBootcampSchema } from '../schema/bootcamp.js';

// @route              GET /api/v1/bootcamps
// @desc               Get all the bootcamps
// @access             Public
export async function getBootcamps(req, res, next) {
  try {
    const bootcamps = await Bootcamp.find();

    if (!bootcamps) {
      const err = new Error('No bootcamps found');
      err.status = 404;
      throw err;
    }

    res
      .status(200)
      .json({ success: true, count: bootcamps.length, data: bootcamps });
  } catch (error) {
    next(error);
  }
}

// @route              GET /api/v1/bootcamps/:id
// @desc               Get single bootcamp
// @access             Public
export async function getBootcamp(req, res, next) {
  try {
    const { id } = req.params;

    const bootcamp = await Bootcamp.findById(id);

    if (!bootcamp) {
      const err = new Error(`No bootcamp found with the id of ${id}`);
      err.status = 404;
      throw err;
    }

    res.status(200).json({ success: true, data: bootcamp });
  } catch (error) {
    next(error);
  }
}

// @route              POST /api/v1/bootcamps
// @desc               Create new bootcamp
// @access             Private
export async function createBootcamp(req, res, next) {
  try {
    const validatedData = bootcampSchema.parse(req.body);

    const newBootcamp = await Bootcamp.create(validatedData);

    res.status(201).json({ success: true, data: newBootcamp });
  } catch (error) {
    next(error);
  }
}

// @route              PUT /api/v1/bootcamps
// @desc               Update bootcamp
// @access             Private
export async function updateBootcamp(req, res, next) {
  try {
    const { id } = req.params;
    const validatedData = updatedBootcampSchema.parse(req.body);

    const bootcamp = await Bootcamp.findOneAndUpdate(
      { _id: id },
      validatedData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!bootcamp) {
      const err = new Error(`No bootcamp found`);
      err.status = 404;
      throw err;
    }

    return res.status(200).json({ success: true, data: bootcamp });
  } catch (error) {
    next(error);
  }
}

// @route              DELETE /api/v1/bootcamps
// @desc               Delete bootcamp
// @access             Private
export async function deleteBootcamp(req, res, next) {
  try {
    const { id } = req.params;

    const bootcamp = await Bootcamp.findOneAndDelete({ _id: id });

    if (!bootcamp) {
      const err = new Error(`No bootcamp found`);
      err.status = 404;
      throw err;
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
}
