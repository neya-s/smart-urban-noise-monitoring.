const Complaint = require('../models/Complaint');
const Hotspot = require('../models/Hotspot');

// @desc    Submit a new noise complaint
// @route   POST /api/complaints
// @access  Private (Citizen)
exports.createComplaint = async (req, res, next) => {
  try {
    const {
      title,
      category,
      description,
      location,
      incidentDate,
      incidentTime,
      evidenceImageUrl,
    } = req.body;

    if (!title || !category || !description || !incidentDate || !incidentTime) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, category, description, incident date, and time.',
      });
    }

    if (!location || !location.address) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid location address.',
      });
    }

    const complaint = await Complaint.create({
      citizen: req.user._id,
      title: title.trim(),
      category,
      description: description.trim(),
      location: {
        address: location.address.trim(),
        zone: location.zone ? location.zone.trim() : 'Anna Nagar',
        coordinates: location.coordinates || { lat: 13.085, lng: 80.2101 },
      },
      incidentDate,
      incidentTime,
      evidenceImageUrl: evidenceImageUrl ? evidenceImageUrl.trim() : '',
      status: 'Submitted',
    });

    // Optionally increment active complaints on matching hotspot
    if (location.zone) {
      await Hotspot.findOneAndUpdate(
        { name: new RegExp(location.zone, 'i') },
        { $inc: { activeComplaintsCount: 1 } }
      );
    }

    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully. Reference ID: ' + complaint._id,
      complaint,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get complaints submitted by the logged-in citizen
// @route   GET /api/complaints/my
// @access  Private (Citizen)
exports.getMyComplaints = async (req, res, next) => {
  try {
    const { status, category, search, page = 1, limit = 20 } = req.query;

    const query = { citizen: req.user._id };

    if (status && status !== 'all') {
      query.status = status;
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { 'location.address': { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [complaints, total] = await Promise.all([
      Complaint.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Complaint.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: complaints.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)) || 1,
      complaints,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single complaint details by ID
// @route   GET /api/complaints/:id
// @access  Private (Citizen can only access own; Staff can access any)
exports.getComplaintById = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('citizen', 'name email phone')
      .populate('statusHistory.updatedBy', 'name role department');

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint record not found.',
      });
    }

    // Role check: Citizen can only view their own complaint
    if (
      req.user.role === 'citizen' &&
      complaint.citizen._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Access forbidden: You can only view your own complaints.',
      });
    }

    res.status(200).json({
      success: true,
      complaint,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a complaint (Citizen can delete only if 'Submitted'; Staff can delete any)
// @route   DELETE /api/complaints/:id
// @access  Private
exports.deleteComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint record not found.',
      });
    }

    // Citizen authorization check
    if (req.user.role === 'citizen') {
      if (complaint.citizen.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: You can only delete complaints you submitted.',
        });
      }
      if (complaint.status !== 'Submitted') {
        return res.status(400).json({
          success: false,
          message: `Cannot delete complaint once it has been processed (Current status: ${complaint.status}). Please contact municipal staff.`,
        });
      }
    }

    await complaint.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Complaint has been successfully removed.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all complaints across citizens (Staff only)
// @route   GET /api/complaints
// @access  Private (Staff only)
exports.getAllComplaints = async (req, res, next) => {
  try {
    const { status, category, zone, search, page = 1, limit = 25 } = req.query;

    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    if (zone && zone !== 'all') {
      query['location.zone'] = { $regex: zone, $options: 'i' };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { 'location.address': { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [complaints, total] = await Promise.all([
      Complaint.find(query)
        .populate('citizen', 'name email phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Complaint.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: complaints.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)) || 1,
      complaints,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update complaint status & assign officer (Staff only)
// @route   PUT /api/complaints/:id/status
// @access  Private (Staff only)
exports.updateComplaintStatus = async (req, res, next) => {
  try {
    const { status, staffNotes, assignedOfficer, assignedTeam } = req.body;

    const validStatuses = [
      'Submitted',
      'Under Review',
      'Investigating',
      'Assigned',
      'Resolved',
      'Dismissed',
    ];

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint record not found.',
      });
    }

    const previousStatus = complaint.status;
    if (status) {
      complaint.status = status;
    }

    if (staffNotes !== undefined) {
      complaint.staffNotes = staffNotes.trim();
    }

    if (assignedOfficer !== undefined) {
      complaint.assignedOfficer = assignedOfficer.trim();
    }

    if (assignedTeam !== undefined) {
      complaint.assignedTeam = assignedTeam.trim();
    }

    // Append to status history
    complaint.statusHistory.push({
      status: status || previousStatus,
      timestamp: new Date(),
      updatedBy: req.user._id,
      note: staffNotes || `Status updated from ${previousStatus} to ${status || previousStatus} by staff ${req.user.name}.`,
    });

    await complaint.save();

    // Populate for clean response
    const populated = await Complaint.findById(complaint._id)
      .populate('citizen', 'name email phone')
      .populate('statusHistory.updatedBy', 'name role department');

    res.status(200).json({
      success: true,
      message: `Complaint #${complaint._id} updated to status: ${complaint.status}`,
      complaint: populated,
    });
  } catch (error) {
    next(error);
  }
};
