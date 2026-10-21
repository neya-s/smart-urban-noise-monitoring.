const express = require('express');
const router = express.Router();
const {
  getHotspots,
  getHotspotById,
} = require('../controllers/hotspotController');

router.get('/', getHotspots);
router.get('/:id', getHotspotById);

module.exports = router;
