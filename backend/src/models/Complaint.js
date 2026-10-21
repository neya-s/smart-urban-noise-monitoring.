const mongoose = require('mongoose');

const statusHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
      enum: ['Submitted', 'Under Review', 'Investigating', 'Assigned', 'Resolved', 'Dismissed'],
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    note: {
      type: String,
      default: '',
    },
  },
  { _id: false }
);

const complaintSchema = new mongoose.Schema(
  {
    citizen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Complaint must belong to a registered citizen'],
    },
    title: {
      type: String,
      required: [true, 'Please provide a descriptive title'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    category: {
      type: String,
      required: [true, 'Please select a noise category'],
      enum: {
        values: ['Traffic', 'Construction', 'Loudspeaker', 'Industrial', 'Other'],
        message: '{VALUE} is not a valid noise category',
      },
    },
    description: {
      type: String,
      required: [true, 'Please describe the noise concern in detail'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    location: {
      address: {
        type: String,
        required: [true, 'Please provide the incident location address'],
        trim: true,
      },
      zone: {
        type: String,
        default: 'Anna Nagar',
        trim: true,
      },
      coordinates: {
        lat: { type: Number, default: 13.085 },
        lng: { type: Number, default: 80.2101 },
      },
    },
    incidentDate: {
      type: String,
      required: [true, 'Please provide the date of the incident (YYYY-MM-DD)'],
    },
    incidentTime: {
      type: String,
      required: [true, 'Please provide the approximate time of the incident'],
    },
    evidenceImageUrl: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['Submitted', 'Under Review', 'Investigating', 'Assigned', 'Resolved', 'Dismissed'],
      default: 'Submitted',
    },
    statusHistory: [statusHistorySchema],
    staffNotes: {
      type: String,
      trim: true,
      default: '',
    },
    assignedOfficer: {
      type: String,
      trim: true,
      default: '',
    },
    assignedTeam: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Middleware to push initial status to history upon creation
complaintSchema.pre('save', function (next) {
  if (this.isNew && (!this.statusHistory || this.statusHistory.length === 0)) {
    this.statusHistory = [
      {
        status: this.status,
        timestamp: new Date(),
        note: 'Complaint filed by citizen.',
      },
    ];
  }
  next();
});

module.exports = mongoose.model('Complaint', complaintSchema);
