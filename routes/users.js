import express from 'express';
import {
  getUser,
  getUsers,
  createUser,
  deleteUser,
  updateUser,
} from '../controllers/users.js';
import { User } from '../models/User.js';
import { advancedResults } from '../middleware/advancedResults.js';
import { protect } from '../middleware/auth.js';
import { authorizeRole } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(authorizeRole('admin'));

router
  .route('/')
  .get(advancedResults(User), getUsers) // GET /api/v1/users
  .post(createUser); // POST /api/v1/users

router
  .route('/:id')
  .get(getUser) // GET /api/v1/users/:id
  .put(updateUser) // PUT /api/v1/users/:id
  .delete(deleteUser); // DELETE /api/v1/users/:id

export default router;
