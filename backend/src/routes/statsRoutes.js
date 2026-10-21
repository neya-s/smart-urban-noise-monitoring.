const express = require('express');
const router = express.Router();
const {
  getCitizenDashboardStats,
  getStaffDashboardStats,
} = require('../controllers/statsController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

router.get('/citizen-dashboard', verifyToken, getCitizenDashboardStats);
router.get('/staff-dashboard', verifyToken, requireRole('staff'), getStaffDashboardStats);

module.exports = router;
