import { Review } from '../models/Review.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { Bootcamp } from '../models/Bootcamp.js';
import { reviewSchema, updateReviewSchema } from '../schema/reviewSchema.js';

// @route              GET /api/v1/reviews
// @route              GET /api/v1/bootcamp/:bootcampId/reviews
// @desc               Get reviews
// @access             Public
export const getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const reviews = await Review.find({ bootcamp: req.params.bootcampId });
    return res
      .status(200)
      .json({ success: true, count: reviews.length, data: reviews });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @route              GET /api/v1/reviews/:id
// @desc               Get single review
// @access             Public
export const getReview = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const review = await Review.findById(id).populate({
    path: 'bootcamp',
    select: 'name description',
  });

  if (!review) {
    const err = new Error('No review found');
    err.status = 404;
    throw err;
  }

  res.status(200).json({ success: true, data: review });
});

// @route              POST /api/v1/bootcamps/:bootcampId/reviews
// @desc               Create review for specific bootcamp
// @access             Private
export const createReview = asyncHandler(async (req, res, next) => {
  const { bootcampId } = req.params;

  const bootcamp = await Bootcamp.findById(bootcampId);

  if (!bootcamp) {
    const err = new Error('No bootcamp found');
    err.status = 404;
    throw err;
  }

  if (
    req.user._id.toString() === bootcamp.user.toString() &&
    req.user.role !== 'admin'
  ) {
    const err = new Error(
      'You do not have permission to add review for owened bootcamps'
    );
    err.status = 403;
    throw err;
  }

  const validatedData = reviewSchema.parse({
    ...req.body,
    bootcamp: bootcampId,
    user: req.user._id.toString(),
  });

  const newReview = await Review.create(validatedData);

  res.status(201).json({ success: true, data: newReview });
});

// @route              PUT /api/v1/reviews/:id
// @desc               Update review
// @access             Private
export const updateReview = asyncHandler(async (req, res, next) => {
  let review;

  if (!req.body) {
    const err = new Error(
      'Please provide the fields you want to update your review with'
    );
    err.status = 400;

    throw err;
  }

  const { id } = req.params;

  review = await Review.findById(id);

  if (!review) {
    const err = new Error('No review found');
    err.status = 404;
    throw err;
  }

  if (
    req.user._id.toString() !== review.user.toString() &&
    req.user.role !== 'admin'
  ) {
    const err = new Error('Not authorized to access this review');
    err.status = 403;
    throw err;
  }

  const validatedData = updateReviewSchema.parse(req.body);

  review = await Review.findByIdAndUpdate(id, validatedData, {
    runValidators: true,
    new: true,
  });

  res.status(200).json({ success: true, data: review });
});

// @route              DELETE /api/v1/reviews/:id
// @desc               Delete review
// @access             Private
export const deleteReview = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const review = await Review.findById(id);

  if (!review) {
    const err = new Error('No review found');
    err.status = 404;
    throw err;
  }

  if (
    req.user._id.toString() !== review.user.toString() &&
    req.user.role !== 'role'
  ) {
    const err = new Error('Not authorized to access this review');
    err.status = 403;
    throw err;
  }

  await review.deleteOne();

  res.status(200).json({ success: true });
});
