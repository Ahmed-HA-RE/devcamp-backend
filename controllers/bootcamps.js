import { Bootcamp } from '../models/Bootcamp.js';

// @route              GET /api/v1/bootcamps
// @desc               Get all the bootcamps
// @access             Public
export async function getBootcamps(req, res, next) {
  try {
    const bootcamps = await Bootcamp.find();
    res
      .status(200)
      .json({ success: true, count: bootcamps.length, data: bootcamps });
  } catch (error) {
    res.status(400).json({ success: false });
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
      return res.status(404).json({ success: false });
    }

    res.status(200).json({ success: true, data: bootcamp });
  } catch (error) {
    res.status(400).json({ success: false });
  }
}

// @route              POST /api/v1/bootcamps
// @desc               Create new bootcamp
// @access             Private
export async function createBootcamp(req, res, next) {
  try {
    const newBootcamp = await Bootcamp.create(req.body);
    res.status(201).json({ success: true, data: newBootcamp });
  } catch (error) {
    res.status(400).json({ success: false });
  }
}

// @route              PUT /api/v1/bootcamps
// @desc               Update bootcamp
// @access             Private
export async function updateBootcamp(req, res, next) {
  try {
    const { id } = req.params;

    const bootcamp = await Bootcamp.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
      runValidators: true,
    });

    if (!bootcamp) {
      return res.status(404).json({ success: false });
    }

    return res.status(200).json({ success: true, data: bootcamp });
  } catch (error) {
    console.log(error);
    res.status(404).json({ success: false });
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
      return res.status(404).json({ success: false });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(404).json({ success: false });
  }
}
