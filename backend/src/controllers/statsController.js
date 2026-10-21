const Complaint = require('../models/Complaint');
const Hotspot = require('../models/Hotspot');

// @desc    Get dashboard summary statistics for logged-in citizen
// @route   GET /api/stats/citizen-dashboard
// @access  Private (Citizen)
exports.getCitizenDashboardStats = async (req, res, next) => {
  try {
    const citizenId = req.user._id;

    // Active complaints (Submitted, Investigating, Assigned)
    const activeCount = await Complaint.countDocuments({
      citizen: citizenId,
      status: { $in: ['Submitted', 'Investigating', 'Assigned'] },
    });

    // Under review complaints
    const underReviewCount = await Complaint.countDocuments({
      citizen: citizenId,
      status: 'Under Review',
    });

    // Resolved / Closed complaints
    const resolvedCount = await Complaint.countDocuments({
      citizen: citizenId,
      status: { $in: ['Resolved', 'Dismissed'] },
    });

    // Total complaints
    const totalCount = await Complaint.countDocuments({ citizen: citizenId });

    // Recent 5 complaints for the overview table
    const recentComplaints = await Complaint.find({ citizen: citizenId })
      .sort({ createdAt: -1 })
      .limit(5);

    // Nearby noise preview (Anna Nagar or highest decibel hotspot)
    const featuredHotspot = await Hotspot.findOne().sort({ decibel: -1 });

    res.status(200).json({
      success: true,
      stats: {
        active: activeCount,
        underReview: underReviewCount,
        resolved: resolvedCount,
        total: totalCount,
      },
      recentComplaints,
      featuredHotspot,
      mode: 'SAMPLE_DATA_DEMO',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get municipal staff dashboard overview metrics
// @route   GET /api/stats/staff-dashboard
// @access  Private (Staff only)
exports.getStaffDashboardStats = async (req, res, next) => {
  try {
    const [
      total,
      submitted,
      underReview,
      investigating,
      assigned,
      resolved,
      dismissed,
    ] = await Promise.all([
      Complaint.countDocuments(),
      Complaint.countDocuments({ status: 'Submitted' }),
      Complaint.countDocuments({ status: 'Under Review' }),
      Complaint.countDocuments({ status: 'Investigating' }),
      Complaint.countDocuments({ status: 'Assigned' }),
      Complaint.countDocuments({ status: 'Resolved' }),
      Complaint.countDocuments({ status: 'Dismissed' }),
    ]);

    // Group by category
    const categoryBreakdown = await Complaint.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Group by zone
    const zoneBreakdown = await Complaint.aggregate([
      { $group: { _id: '$location.zone', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      success: true,
      metrics: {
        total,
        submitted,
        underReview,
        investigating,
        assigned,
        resolved,
        dismissed,
        activeTotal: submitted + underReview + investigating + assigned,
      },
      categoryBreakdown,
      zoneBreakdown,
    });
  } catch (error) {
    next(error);
  }
};
