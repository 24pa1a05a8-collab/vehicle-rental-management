import express from 'express';
import {
  getVehicles,
  getVehicleById,
  checkVehicleAvailability,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  toggleVehicleAvailability,
} from '../controllers/vehicleController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getVehicles)
  .post(protect, adminOnly, createVehicle);

router.get('/:id/check-availability', checkVehicleAvailability);

router.route('/:id')
  .get(getVehicleById)
  .put(protect, adminOnly, updateVehicle)
  .delete(protect, adminOnly, deleteVehicle);

router.patch('/:id/toggle-availability', protect, adminOnly, toggleVehicleAvailability);

export default router;
