# Smart Urban Noise Monitoring System
## REST API Documentation

Base URL: `http://localhost:5000/api`

---

### Authentication Headers
For protected endpoints, include the JWT token returned during login/registration:
```http
Authorization: Bearer <your_jwt_token_here>
Content-Type: application/json
```

---

### 1. Authentication Endpoints

#### 1.1 Citizen Self-Registration
* **Method & Path:** `POST /auth/register`
* **Access:** Public (Always assigns `role: 'citizen'`)
* **Request Body:**
```json
{
  "name": "Neya Sundaram",
  "email": "neya@example.com",
  "phone": "+91 98765 43210",
  "password": "Password123!"
}
```
* **Success Response (`201 Created`):**
```json
{
  "success": true,
  "message": "Citizen account created successfully.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "6716a123bc456ef78901234a",
    "name": "Neya Sundaram",
    "email": "neya@example.com",
    "phone": "+91 98765 43210",
    "role": "citizen"
  }
}
```

#### 1.2 User Login (Citizen or Staff)
* **Method & Path:** `POST /auth/login`
* **Access:** Public
* **Request Body:**
```json
{
  "email": "citizen@urban.gov",
  "password": "Password123!",
  "portal": "citizen"
}
```
* **Success Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Welcome back, Neya Citizen!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "6716a123bc456ef78901234b",
    "name": "Neya Citizen",
    "email": "citizen@urban.gov",
    "phone": "+91 98765 43210",
    "role": "citizen"
  }
}
```

#### 1.3 Get Current User Profile
* **Method & Path:** `GET /auth/me`
* **Access:** Private (Authenticated Citizen or Staff)
* **Success Response (`200 OK`):**
```json
{
  "success": true,
  "user": {
    "id": "6716a123bc456ef78901234b",
    "name": "Neya Citizen",
    "email": "citizen@urban.gov",
    "phone": "+91 98765 43210",
    "role": "citizen",
    "createdAt": "2026-10-21T17:00:00.000Z"
  }
}
```

#### 1.4 Update User Profile
* **Method & Path:** `PUT /auth/profile`
* **Access:** Private
* **Request Body:**
```json
{
  "name": "Neya Sundaram Updated",
  "phone": "+91 99999 88888"
}
```

---

### 2. Complaints Endpoints

#### 2.1 File a Noise Complaint (Citizen)
* **Method & Path:** `POST /complaints`
* **Access:** Private (Citizen or Staff)
* **Request Body:**
```json
{
  "title": "Night Road Resurfacing Milling Noise",
  "category": "Construction",
  "description": "Continuous asphalt machinery and generator running after 11 PM near residential apartments.",
  "location": {
    "address": "2nd Avenue, Anna Nagar, Chennai",
    "zone": "Anna Nagar",
    "coordinates": {
      "lat": 13.085,
      "lng": 80.2101
    }
  },
  "incidentDate": "2026-10-21",
  "incidentTime": "23:30",
  "evidenceImageUrl": "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800"
}
```
* **Success Response (`201 Created`):**
```json
{
  "success": true,
  "message": "Complaint submitted successfully. Reference ID: 6716a500bc456ef78901235c",
  "complaint": {
    "_id": "6716a500bc456ef78901235c",
    "citizen": "6716a123bc456ef78901234b",
    "title": "Night Road Resurfacing Milling Noise",
    "category": "Construction",
    "description": "Continuous asphalt machinery and generator running after 11 PM near residential apartments.",
    "location": {
      "address": "2nd Avenue, Anna Nagar, Chennai",
      "zone": "Anna Nagar",
      "coordinates": { "lat": 13.085, "lng": 80.2101 }
    },
    "incidentDate": "2026-10-21",
    "incidentTime": "23:30",
    "status": "Submitted",
    "statusHistory": [
      {
        "status": "Submitted",
        "timestamp": "2026-10-21T17:40:00.000Z",
        "note": "Complaint filed by citizen."
      }
    ],
    "createdAt": "2026-10-21T17:40:00.000Z"
  }
}
```

#### 2.2 Get Logged-in Citizen's Complaints
* **Method & Path:** `GET /complaints/my?status=all&category=all&search=`
* **Access:** Private (Citizen)
* **Query Parameters:** `status` (optional), `category` (optional), `search` (optional), `page`, `limit`
* **Success Response (`200 OK`):**
```json
{
  "success": true,
  "count": 3,
  "total": 13,
  "page": 1,
  "totalPages": 1,
  "complaints": [
    {
      "_id": "6716a500bc456ef78901235c",
      "title": "Traffic Noise",
      "category": "Traffic",
      "location": { "address": "Anna Nagar, Chennai", "zone": "Anna Nagar" },
      "incidentDate": "2025-09-30",
      "status": "Investigating"
    }
  ]
}
```

#### 2.3 Get All Complaints Across Citizens (Municipal Staff Only)
* **Method & Path:** `GET /complaints?status=all&category=all&zone=all&search=`
* **Access:** Private (Staff only; enforced by `requireRole('staff')`)
* **Success Response (`200 OK`):** Returns array of complaints populated with citizen names and contact information.

#### 2.4 Get Single Complaint By ID
* **Method & Path:** `GET /complaints/:id`
* **Access:** Private (Citizen can only access their own; Staff can access any)

#### 2.5 Delete Complaint (Citizen Consequential Action)
* **Method & Path:** `DELETE /complaints/:id`
* **Access:** Private (Citizen can delete only if status is `Submitted`; Staff can delete any)
* **Success Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Complaint has been successfully removed."
}
```

#### 2.6 Update Complaint Status (Staff Only)
* **Method & Path:** `PUT /complaints/:id/status`
* **Access:** Private (Staff only)
* **Request Body:**
```json
{
  "status": "Investigating",
  "assignedOfficer": "Officer Ramanathan",
  "assignedTeam": "Field Squad Zone 8",
  "staffNotes": "Field acoustic sensor deployed at intersection. Readings exceed daytime cutoff by 14 dB."
}
```
* **Success Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Complaint #6716a500bc456ef78901235c updated to status: Investigating",
  "complaint": {
    "_id": "6716a500bc456ef78901235c",
    "status": "Investigating",
    "assignedOfficer": "Officer Ramanathan",
    "assignedTeam": "Field Squad Zone 8",
    "staffNotes": "Field acoustic sensor deployed at intersection. Readings exceed daytime cutoff by 14 dB.",
    "statusHistory": [
      { "status": "Submitted", "timestamp": "2026-10-21T17:40:00Z" },
      { "status": "Investigating", "timestamp": "2026-10-21T17:45:00Z", "note": "Field acoustic sensor deployed..." }
    ]
  }
}
```

---

### 3. Hotspot Endpoints (Schematic Prototype Data)

#### 3.1 List All Noise Hotspots
* **Method & Path:** `GET /hotspots?category=all&zone=all`
* **Access:** Public or Authenticated
* **Success Response (`200 OK`):**
```json
{
  "success": true,
  "count": 7,
  "mode": "SAMPLE_DATA_DEMO",
  "disclaimer": "All readings and hotspot levels are illustrative schematic samples for demonstration.",
  "hotspots": [
    {
      "name": "Anna Nagar",
      "zoneId": "anna-nagar",
      "decibel": 82,
      "category": "High",
      "activeComplaintsCount": 34,
      "peakHours": "18:00 - 21:00",
      "dayLimitDb": 65,
      "nightLimitDb": 55,
      "primarySource": "Traffic & Construction",
      "coordinates": { "lat": 13.085, "lng": 80.2101 }
    }
  ]
}
```

---

### 4. Dashboard Statistics Endpoints

#### 4.1 Citizen Dashboard Summary
* **Method & Path:** `GET /stats/citizen-dashboard`
* **Access:** Private (Citizen)
* **Success Response (`200 OK`):**
```json
{
  "success": true,
  "stats": {
    "active": 3,
    "underReview": 2,
    "resolved": 8,
    "total": 13
  },
  "recentComplaints": [...],
  "featuredHotspot": { ... }
}
```

#### 4.2 Municipal Staff Dashboard Summary
* **Method & Path:** `GET /stats/staff-dashboard`
* **Access:** Private (Staff only)
* **Success Response (`200 OK`):**
```json
{
  "success": true,
  "metrics": {
    "total": 14,
    "submitted": 1,
    "underReview": 2,
    "investigating": 2,
    "assigned": 1,
    "resolved": 8,
    "dismissed": 0,
    "activeTotal": 6
  },
  "categoryBreakdown": [
    { "_id": "Traffic", "count": 5 },
    { "_id": "Construction", "count": 4 },
    { "_id": "Industrial", "count": 3 }
  ],
  "zoneBreakdown": [
    { "_id": "Anna Nagar", "count": 6 },
    { "_id": "T. Nagar", "count": 4 }
  ]
}
```
