import express from 'express';
import {
  getAllUsers,
  toggleUserStatus,
  updateUserRole,
  deleteUser,
} from '../controllers/userController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, adminOnly);

router.get('/', getAllUsers);
router.patch('/:id/toggle-status', toggleUserStatus);
router.patch('/:id/role', updateUserRole);
router.delete('/:id', deleteUser);

export default router;
