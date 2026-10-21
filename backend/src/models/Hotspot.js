const mongoose = require('mongoose');

const hourlyReadingSchema = new mongoose.Schema(
  {
    hour: { type: String, required: true }, // e.g. "06:00", "09:00", etc.
    decibel: { type: Number, required: true },
  },
  { _id: false }
);

const hotspotSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    zoneId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    decibel: {
      type: Number,
      required: true,
      default: 65,
    },
    category: {
      type: String,
      enum: ['Low', 'Moderate', 'High'],
      default: 'Moderate',
    },
    activeComplaintsCount: {
      type: Number,
      default: 0,
    },
    peakHours: {
      type: String,
      default: '18:00 - 21:00',
    },
    dayLimitDb: {
      type: Number,
      default: 65,
    },
    nightLimitDb: {
      type: Number,
      default: 55,
    },
    primarySource: {
      type: String,
      default: 'Traffic & Commercial Activities',
    },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    isSampleData: {
      type: Boolean,
      default: true,
    },
    disclaimer: {
      type: String,
      default: 'Illustrative schematic reading for demo and simulation purposes.',
    },
    hourlyReadings: [hourlyReadingSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Hotspot', hotspotSchema);
