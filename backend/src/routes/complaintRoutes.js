const express = require('express');
const router = express.Router();
const {
  createComplaint,
  getMyComplaints,
  getComplaintById,
  deleteComplaint,
  getAllComplaints,
  updateComplaintStatus,
} = require('../controllers/complaintController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

// Citizen routes
router.post('/', verifyToken, createComplaint);
router.get('/my', verifyToken, getMyComplaints);

// Staff route to get all complaints
router.get('/', verifyToken, requireRole('staff'), getAllComplaints);

// Single complaint operations
router.get('/:id', verifyToken, getComplaintById);
router.delete('/:id', verifyToken, deleteComplaint);

// Staff status update
router.put('/:id/status', verifyToken, requireRole('staff'), updateComplaintStatus);

module.exports = router;
