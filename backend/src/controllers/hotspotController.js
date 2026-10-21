const Hotspot = require('../models/Hotspot');
const Complaint = require('../models/Complaint');

// @desc    Get all urban noise hotspots (Schematic sample data)
// @route   GET /api/hotspots
// @access  Public or Authenticated
exports.getHotspots = async (req, res, next) => {
  try {
    const { category, zone } = req.query;
    const query = {};

    if (category && category !== 'all') {
      query.category = category;
    }

    if (zone && zone !== 'all') {
      query.zoneId = zone;
    }

    const hotspots = await Hotspot.find(query).sort({ decibel: -1 });

    res.status(200).json({
      success: true,
      count: hotspots.length,
      mode: 'SAMPLE_DATA_DEMO',
      disclaimer: 'All readings and hotspot levels are illustrative schematic samples for demonstration.',
      hotspots,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single hotspot details & analytics
// @route   GET /api/hotspots/:id
// @access  Public or Authenticated
exports.getHotspotById = async (req, res, next) => {
  try {
    const hotspot = await Hotspot.findById(req.params.id);

    if (!hotspot) {
      return res.status(404).json({
        success: false,
        message: 'Hotspot zone not found.',
      });
    }

    // Also count actual complaints submitted in this zone
    const realComplaintCount = await Complaint.countDocuments({
      'location.zone': new RegExp(hotspot.name, 'i'),
      status: { $in: ['Submitted', 'Under Review', 'Investigating', 'Assigned'] },
    });

    res.status(200).json({
      success: true,
      hotspot: {
        ...hotspot.toObject(),
        liveReportedCount: realComplaintCount,
      },
      mode: 'SAMPLE_DATA_DEMO',
    });
  } catch (error) {
    next(error);
  }
};
