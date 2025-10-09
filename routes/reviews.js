import express from 'express';
import { advancedResults } from '../middleware/advancedResults.js';
import { Review } from '../models/Review.js';
import { authorizeRole, protect } from '../middleware/auth.js';
import {
  getReview,
  getReviews,
  createReview,
  updateReview,
  deleteReview,
} from '../controllers/reviews.js';

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(
    advancedResults(Review, { path: 'bootcamp', select: 'name description' }),
    getReviews
  ) // GET /api/v1/reviews
  .post(protect, authorizeRole('user', 'admin'), createReview); // POST /api/v1/bootcamps/:bootcampId/reviews

router
  .route('/:id')
  .get(getReview) // GET /api/v1/reviews/:id
  .put(protect, authorizeRole('user', 'admin'), updateReview) // PUT /api/v1/reviews/:id
  .delete(protect, deleteReview); // DELETE /api/v1/reviews/:id

export default router;
