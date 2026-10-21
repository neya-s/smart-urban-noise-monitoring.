const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Complaint = require('../models/Complaint');
const Hotspot = require('../models/Hotspot');

const seedDemoData = async () => {
  try {
    console.log('[Seed] Clearing existing demo data...');
    await Promise.all([
      User.deleteMany({}),
      Complaint.deleteMany({}),
      Hotspot.deleteMany({}),
    ]);

    console.log('[Seed] Creating demo users...');
    // Create citizen user
    const citizenUser = await User.create({
      name: 'Neya Citizen',
      email: 'citizen@urban.gov',
      phone: '+91 98765 43210',
      password: 'Password123!',
      role: 'citizen',
    });

    // Create another sample citizen
    const citizenUser2 = await User.create({
      name: 'Karthik Raja',
      email: 'karthik@example.com',
      phone: '+91 91234 56789',
      password: 'Password123!',
      role: 'citizen',
    });

    // Create staff user
    const staffUser = await User.create({
      name: 'Officer Ramanathan',
      email: 'staff@urban.gov',
      phone: '+91 98401 23456',
      password: 'StaffPassword123!',
      role: 'staff',
      department: 'Greater Chennai Corporation - Acoustic Control Wing',
      staffId: 'GCC-NOISE-042',
    });

    // Create secondary staff user
    const supervisorUser = await User.create({
      name: 'Priya Sundaram',
      email: 'supervisor@urban.gov',
      phone: '+91 98402 34567',
      password: 'StaffPassword123!',
      role: 'staff',
      department: 'Municipal Acoustics Enforcement Cell',
      staffId: 'GCC-NOISE-009',
    });

    console.log('[Seed] Creating Chennai noise hotspots...');
    const hotspots = [
      {
        name: 'Anna Nagar',
        zoneId: 'anna-nagar',
        decibel: 82,
        category: 'High',
        activeComplaintsCount: 34,
        peakHours: '18:00 - 21:00',
        dayLimitDb: 65,
        nightLimitDb: 55,
        primarySource: 'Traffic & Construction',
        coordinates: { lat: 13.085, lng: 80.2101 },
        isSampleData: true,
        disclaimer: 'Illustrative schematic reading for demo and simulation purposes.',
        hourlyReadings: [
          { hour: '06:00', decibel: 58 },
          { hour: '08:00', decibel: 74 },
          { hour: '10:00', decibel: 79 },
          { hour: '12:00', decibel: 75 },
          { hour: '14:00', decibel: 73 },
          { hour: '16:00', decibel: 77 },
          { hour: '18:00', decibel: 82 },
          { hour: '20:00', decibel: 81 },
          { hour: '22:00', decibel: 68 },
        ],
      },
      {
        name: 'T. Nagar',
        zoneId: 't-nagar',
        decibel: 78,
        category: 'High',
        activeComplaintsCount: 28,
        peakHours: '17:00 - 22:00',
        dayLimitDb: 65,
        nightLimitDb: 55,
        primarySource: 'Commercial & Shopping Crowd',
        coordinates: { lat: 13.0418, lng: 80.2341 },
        isSampleData: true,
        disclaimer: 'Illustrative schematic reading for demo and simulation purposes.',
        hourlyReadings: [
          { hour: '06:00', decibel: 55 },
          { hour: '08:00', decibel: 70 },
          { hour: '10:00', decibel: 75 },
          { hour: '12:00', decibel: 76 },
          { hour: '14:00', decibel: 74 },
          { hour: '16:00', decibel: 76 },
          { hour: '18:00', decibel: 78 },
          { hour: '20:00', decibel: 77 },
          { hour: '22:00', decibel: 66 },
        ],
      },
      {
        name: 'Kilpauk',
        zoneId: 'kilpauk',
        decibel: 74,
        category: 'High',
        activeComplaintsCount: 19,
        peakHours: '08:00 - 11:00',
        dayLimitDb: 65,
        nightLimitDb: 55,
        primarySource: 'Transit Corridor & Hospital Perimeter',
        coordinates: { lat: 13.0784, lng: 80.2412 },
        isSampleData: true,
        disclaimer: 'Illustrative schematic reading for demo and simulation purposes.',
        hourlyReadings: [
          { hour: '06:00', decibel: 54 },
          { hour: '08:00', decibel: 74 },
          { hour: '10:00', decibel: 73 },
          { hour: '12:00', decibel: 68 },
          { hour: '14:00', decibel: 67 },
          { hour: '16:00', decibel: 70 },
          { hour: '18:00', decibel: 72 },
          { hour: '20:00', decibel: 69 },
          { hour: '22:00', decibel: 62 },
        ],
      },
      {
        name: 'Nungambakkam',
        zoneId: 'nungambakkam',
        decibel: 71,
        category: 'High',
        activeComplaintsCount: 15,
        peakHours: '19:00 - 23:00',
        dayLimitDb: 65,
        nightLimitDb: 55,
        primarySource: 'Night Eateries & Commercial Hub',
        coordinates: { lat: 13.0569, lng: 80.2425 },
        isSampleData: true,
        disclaimer: 'Illustrative schematic reading for demo and simulation purposes.',
        hourlyReadings: [
          { hour: '06:00', decibel: 50 },
          { hour: '08:00', decibel: 65 },
          { hour: '10:00', decibel: 68 },
          { hour: '12:00', decibel: 69 },
          { hour: '14:00', decibel: 66 },
          { hour: '16:00', decibel: 68 },
          { hour: '18:00', decibel: 70 },
          { hour: '20:00', decibel: 71 },
          { hour: '22:00', decibel: 65 },
        ],
      },
      {
        name: 'Velachery',
        zoneId: 'velachery',
        decibel: 68,
        category: 'Moderate',
        activeComplaintsCount: 12,
        peakHours: '18:30 - 21:30',
        dayLimitDb: 65,
        nightLimitDb: 55,
        primarySource: 'Flyover Junction & Retail Plaza',
        coordinates: { lat: 12.9815, lng: 80.218 },
        isSampleData: true,
        disclaimer: 'Illustrative schematic reading for demo and simulation purposes.',
        hourlyReadings: [
          { hour: '06:00', decibel: 52 },
          { hour: '08:00', decibel: 64 },
          { hour: '10:00', decibel: 66 },
          { hour: '12:00', decibel: 65 },
          { hour: '14:00', decibel: 63 },
          { hour: '16:00', decibel: 65 },
          { hour: '18:00', decibel: 68 },
          { hour: '20:00', decibel: 67 },
          { hour: '22:00', decibel: 59 },
        ],
      },
      {
        name: 'Adyar',
        zoneId: 'adyar',
        decibel: 59,
        category: 'Moderate',
        activeComplaintsCount: 6,
        peakHours: '09:00 - 11:00',
        dayLimitDb: 65,
        nightLimitDb: 55,
        primarySource: 'Residential Arterial Traffic',
        coordinates: { lat: 13.0012, lng: 80.2565 },
        isSampleData: true,
        disclaimer: 'Illustrative schematic reading for demo and simulation purposes.',
        hourlyReadings: [
          { hour: '06:00', decibel: 48 },
          { hour: '08:00', decibel: 57 },
          { hour: '10:00', decibel: 59 },
          { hour: '12:00', decibel: 56 },
          { hour: '14:00', decibel: 54 },
          { hour: '16:00', decibel: 56 },
          { hour: '18:00', decibel: 58 },
          { hour: '20:00', decibel: 57 },
          { hour: '22:00', decibel: 50 },
        ],
      },
      {
        name: 'Besant Nagar',
        zoneId: 'besant-nagar',
        decibel: 52,
        category: 'Low',
        activeComplaintsCount: 3,
        peakHours: '17:00 - 19:00',
        dayLimitDb: 55,
        nightLimitDb: 45,
        primarySource: 'Coastal Promenade & Recreational',
        coordinates: { lat: 12.9982, lng: 80.2665 },
        isSampleData: true,
        disclaimer: 'Illustrative schematic reading for demo and simulation purposes.',
        hourlyReadings: [
          { hour: '06:00', decibel: 42 },
          { hour: '08:00', decibel: 48 },
          { hour: '10:00', decibel: 50 },
          { hour: '12:00', decibel: 49 },
          { hour: '14:00', decibel: 47 },
          { hour: '16:00', decibel: 50 },
          { hour: '18:00', decibel: 52 },
          { hour: '20:00', decibel: 51 },
          { hour: '22:00', decibel: 45 },
        ],
      },
    ];

    await Hotspot.insertMany(hotspots);

    console.log('[Seed] Creating demo complaints matching Figma specification...');
    // We want citizenUser to have:
    // 3 ACTIVE (Submitted / Investigating / Assigned)
    // 2 UNDER REVIEW
    // 8 RESOLVED
    // Total = 13
    const demoComplaints = [
      // Top 3 matching screenshot exactly:
      {
        citizen: citizenUser._id,
        title: 'Traffic Noise',
        category: 'Traffic',
        description: 'Continuous horn blowing and stationary bus engine revving at the main signal during peak commute.',
        location: {
          address: 'Anna Nagar, Chennai',
          zone: 'Anna Nagar',
          coordinates: { lat: 13.085, lng: 80.2101 },
        },
        incidentDate: '2025-09-30',
        incidentTime: '08:30 PM',
        evidenceImageUrl: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=800',
        status: 'Investigating', // 1st active
        assignedOfficer: 'Officer Ramanathan',
        assignedTeam: 'Field Squad Zone 8',
        staffNotes: 'Sound level sensor deployed at 2nd Avenue intersection. Recorded intermittent bursts exceeding 85dB.',
        statusHistory: [
          { status: 'Submitted', timestamp: new Date('2025-09-30T20:35:00Z'), note: 'Citizen filed report' },
          { status: 'Under Review', timestamp: new Date('2025-10-01T09:15:00Z'), note: 'Screened by triage officer' },
          { status: 'Investigating', timestamp: new Date('2025-10-01T14:30:00Z'), note: 'Assigned to acoustic inspection team' },
        ],
      },
      {
        citizen: citizenUser._id,
        title: 'Construction',
        category: 'Construction',
        description: 'Commercial complex excavation and heavy pneumatic hammer drilling operating beyond permissible night cutoff.',
        location: {
          address: 'T. Nagar, Chennai',
          zone: 'T. Nagar',
          coordinates: { lat: 13.0418, lng: 80.2341 },
        },
        incidentDate: '2025-09-29',
        incidentTime: '11:15 PM',
        evidenceImageUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800',
        status: 'Assigned', // 2nd active
        assignedOfficer: 'Officer Priya Sundaram',
        assignedTeam: 'Night Vigilance Wing',
        staffNotes: 'Show cause notice drafted for the site contractor for operating heavy machinery past 22:00 hrs.',
        statusHistory: [
          { status: 'Submitted', timestamp: new Date('2025-09-29T23:20:00Z'), note: 'Citizen filed report' },
          { status: 'Under Review', timestamp: new Date('2025-09-30T08:30:00Z'), note: 'Validated with zoning department' },
          { status: 'Assigned', timestamp: new Date('2025-09-30T11:00:00Z'), note: 'Assigned to Officer Priya Sundaram' },
        ],
      },
      {
        citizen: citizenUser._id,
        title: 'Loudspeaker',
        category: 'Loudspeaker',
        description: 'Unauthorized public address speaker system used without sound limiter during evening religious procession.',
        location: {
          address: 'Velachery, Chennai',
          zone: 'Velachery',
          coordinates: { lat: 12.9815, lng: 80.218 },
        },
        incidentDate: '2025-09-27',
        incidentTime: '07:45 PM',
        evidenceImageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
        status: 'Resolved', // 1st resolved
        assignedOfficer: 'Officer Ramanathan',
        staffNotes: 'Community organizers met with municipal staff and re-oriented speakers downward, keeping sound below 60dB.',
        statusHistory: [
          { status: 'Submitted', timestamp: new Date('2025-09-27T19:50:00Z'), note: 'Citizen filed report' },
          { status: 'Under Review', timestamp: new Date('2025-09-27T20:10:00Z'), note: 'Immediate dispatch' },
          { status: 'Investigating', timestamp: new Date('2025-09-27T20:30:00Z'), note: 'Officer visited site' },
          { status: 'Resolved', timestamp: new Date('2025-09-27T21:40:00Z'), note: 'Sound limit compliance verified' },
        ],
      },

      // Additional Active complaint (to make total ACTIVE = 3)
      {
        citizen: citizenUser._id,
        title: 'Industrial DG Set Noise',
        category: 'Industrial',
        description: 'Unenclosed diesel generator operating at commercial printing press rattling adjacent residential window frames.',
        location: {
          address: 'Kilpauk, Chennai',
          zone: 'Kilpauk',
          coordinates: { lat: 13.0784, lng: 80.2412 },
        },
        incidentDate: '2025-09-28',
        incidentTime: '03:30 PM',
        evidenceImageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800',
        status: 'Submitted', // 3rd active
        statusHistory: [
          { status: 'Submitted', timestamp: new Date('2025-09-28T15:40:00Z'), note: 'Complaint filed' },
        ],
      },

      // 2 UNDER REVIEW complaints
      {
        citizen: citizenUser._id,
        title: 'Late Night Rooftop Bar Music',
        category: 'Other',
        description: 'Subwoofer bass frequencies reverberating across residential apartments until 1:30 AM.',
        location: {
          address: 'Nungambakkam High Road, Chennai',
          zone: 'Nungambakkam',
          coordinates: { lat: 13.0569, lng: 80.2425 },
        },
        incidentDate: '2025-09-29',
        incidentTime: '01:15 AM',
        status: 'Under Review', // 1st under review
        staffNotes: 'Cross-verifying license terms and decibel curfew with Chennai Corporation commercial licensing division.',
        statusHistory: [
          { status: 'Submitted', timestamp: new Date('2025-09-29T01:30:00Z'), note: 'Filed via web portal' },
          { status: 'Under Review', timestamp: new Date('2025-09-29T10:00:00Z'), note: 'In review by acoustic supervisor' },
        ],
      },
      {
        citizen: citizenUser._id,
        title: 'Heavy Vehicle Engine Braking',
        category: 'Traffic',
        description: 'Interstate commercial trucks using compression exhaust engine brakes on residential approach road.',
        location: {
          address: 'Anna Nagar West, Chennai',
          zone: 'Anna Nagar',
          coordinates: { lat: 13.088, lng: 80.205 },
        },
        incidentDate: '2025-09-26',
        incidentTime: '05:45 AM',
        status: 'Under Review', // 2nd under review
        staffNotes: 'Traffic police coordinator notified to verify heavy truck detour timing compliance.',
        statusHistory: [
          { status: 'Submitted', timestamp: new Date('2025-09-26T06:00:00Z'), note: 'Filed by citizen' },
          { status: 'Under Review', timestamp: new Date('2025-09-26T11:00:00Z'), note: 'Under technical review' },
        ],
      },

      // 7 more RESOLVED complaints (total 8 resolved, matching Figma's "08 RESOLVED" card!)
      {
        citizen: citizenUser._id,
        title: 'Supermarket Chiller Unit Hum',
        category: 'Industrial',
        description: 'Vibrating rooftop cooling tower on grocery store making low-frequency hum throughout the night.',
        location: {
          address: 'Adyar, Chennai',
          zone: 'Adyar',
          coordinates: { lat: 13.0012, lng: 80.2565 },
        },
        incidentDate: '2025-09-20',
        incidentTime: '10:00 PM',
        status: 'Resolved',
        staffNotes: 'Store manager installed rubber anti-vibration damping pads and acoustic baffle. Verified 48 dB.',
        statusHistory: [
          { status: 'Submitted', timestamp: new Date('2025-09-20T22:30:00Z'), note: 'Filed' },
          { status: 'Under Review', timestamp: new Date('2025-09-21T09:00:00Z'), note: 'Reviewed' },
          { status: 'Resolved', timestamp: new Date('2025-09-23T16:00:00Z'), note: 'Damping pads installed' },
        ],
      },
      {
        citizen: citizenUser._id,
        title: 'Road Surface Milling Noise',
        category: 'Construction',
        description: 'Asphalt milling machine operating without advance notice to residents.',
        location: {
          address: 'Kilpauk Garden Road, Chennai',
          zone: 'Kilpauk',
          coordinates: { lat: 13.08, lng: 80.239 },
        },
        incidentDate: '2025-09-18',
        incidentTime: '02:00 PM',
        status: 'Resolved',
        staffNotes: 'Road resurfacing works concluded and sound levels restored to baseline.',
      },
      {
        citizen: citizenUser._id,
        title: 'Wedding Hall Fireworks and Music',
        category: 'Other',
        description: 'High-decibel firecrackers burst after 10 PM near quiet residential quarters.',
        location: {
          address: 'T. Nagar, Chennai',
          zone: 'T. Nagar',
          coordinates: { lat: 13.039, lng: 80.231 },
        },
        incidentDate: '2025-09-15',
        incidentTime: '10:30 PM',
        status: 'Resolved',
        staffNotes: 'Hall management issued advisory regarding city noise regulation adherence.',
      },
      {
        citizen: citizenUser._id,
        title: 'Defective Street Drainage Grating Clatter',
        category: 'Traffic',
        description: 'Loose metal storm water drain cover rattling loudly every time buses and cars drive over it.',
        location: {
          address: 'Anna Nagar Roundabout, Chennai',
          zone: 'Anna Nagar',
          coordinates: { lat: 13.084, lng: 80.211 },
        },
        incidentDate: '2025-09-12',
        incidentTime: '08:00 AM',
        status: 'Resolved',
        staffNotes: 'Highways maintenance crew welded and anchored the storm drain frame securely.',
      },
      {
        citizen: citizenUser._id,
        title: 'Air Horn Usage by Private Buses',
        category: 'Traffic',
        description: 'Intercity omni buses using multi-tone air pressure horns along 100 Feet Road.',
        location: {
          address: 'Velachery Main Road, Chennai',
          zone: 'Velachery',
          coordinates: { lat: 12.984, lng: 80.219 },
        },
        incidentDate: '2025-09-10',
        incidentTime: '07:15 PM',
        status: 'Resolved',
        staffNotes: 'Regional Transport Office conducted joint drive confiscating 14 illegal pressure horns.',
      },
      {
        citizen: citizenUser._id,
        title: 'Auto Workshop Metal Grinding',
        category: 'Industrial',
        description: 'Outdoor dent removal and grinding work carried out on public pavement.',
        location: {
          address: 'Nungambakkam, Chennai',
          zone: 'Nungambakkam',
          coordinates: { lat: 13.058, lng: 80.241 },
        },
        incidentDate: '2025-09-05',
        incidentTime: '11:30 AM',
        status: 'Resolved',
        staffNotes: 'Workshop owner shifted grinding inside soundproofed bay following municipal notice.',
      },
      {
        citizen: citizenUser._id,
        title: 'Advertising Loudspeakers on Mobile Vans',
        category: 'Loudspeaker',
        description: 'Mobile promotional van playing repetitive recorded messages with megaphone.',
        location: {
          address: 'Besant Nagar, Chennai',
          zone: 'Besant Nagar',
          coordinates: { lat: 12.998, lng: 80.266 },
        },
        incidentDate: '2025-08-28',
        incidentTime: '04:00 PM',
        status: 'Resolved',
        staffNotes: 'Mobile megaphone permit expired; van instructed to discontinue broadcast.',
      },

      // Additional complaint by another citizen to verify multi-user isolation
      {
        citizen: citizenUser2._id,
        title: 'Night Concrete Pouring at Metro Station',
        category: 'Construction',
        description: 'Continuous concrete mixer trucks and floodlight generators idling near residential apartments.',
        location: {
          address: 'Adyar Bridge Road, Chennai',
          zone: 'Adyar',
          coordinates: { lat: 13.003, lng: 80.258 },
        },
        incidentDate: '2025-10-02',
        incidentTime: '02:00 AM',
        status: 'Investigating',
        assignedOfficer: 'Officer Ramanathan',
      },
    ];

    await Complaint.create(demoComplaints);

    console.log('[Seed] Demo data successfully seeded!');
    console.log('----------------------------------------------------');
    console.log('DEMO CITIZEN CREDENTIALS:');
    console.log('  Email:    citizen@urban.gov');
    console.log('  Password: Password123!');
    console.log('');
    console.log('DEMO STAFF CREDENTIALS:');
    console.log('  Email:    staff@urban.gov');
    console.log('  Password: StaffPassword123!');
    console.log('----------------------------------------------------');

    return { citizenUser, staffUser };
  } catch (err) {
    console.error('[Seed] Error seeding demo data:', err);
    throw err;
  }
};

// Allow running standalone: `node src/utils/seedData.js`
if (require.main === module) {
  require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
  const { connectDB, disconnectDB } = require('../config/db');

  connectDB()
    .then(async () => {
      await seedDemoData();
      await disconnectDB();
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = { seedDemoData };
