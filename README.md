# Smart Urban Noise Monitoring System
### A Trustworthy Public-Service Platform for Civic Acoustic Governance

[![Node.js Version](https://img.shields.io/badge/Node.js-v18%2B-brightgreen.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5-purple.svg)](https://vitejs.dev/)
[![Express](https://img.shields.io/badge/Express-4.x-lightgrey.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-emerald.svg)](https://mongoosejs.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-teal.svg)](LICENSE)

---

## 1. Project Overview
The **Smart Urban Noise Monitoring System** is a full-stack web application designed for municipal noise pollution management, acoustic compliance tracking, and civic grievance resolution. Built with design fidelity referencing municipal acoustic monitoring systems (demonstrated with realistic Chennai metropolitan zones), it connects citizens affected by urban sound disturbances with municipal authorities who review, investigate, and enforce acoustic regulations.

The interface adheres closely to the visual language, typography, color harmony, and component layouts of the reference Figma design:
- **Calm, Civic Character:** Warm off-white backgrounds, deep navy/charcoal typography, restrained teal for primary actions, amber for items needing review, and emerald green for resolved complaints.
- **Strict Role-Based Authorization:** Citizens submit and track their own grievances; municipal officers triage, dispatch field teams, and update case statuses.
- **Transparent Data Claims:** All map decibel readings, hotspot levels, and predictive curves are explicitly labeled as **"Sample Data" / "Demo Mode"** rather than claimed to be live telemetry.

---

## 2. Key Features

### Citizen Portal
- **Registration & Authentication:** Secure registration and JWT session management. Public self-registration strictly enforces `role: 'citizen'`.
- **Overview Dashboard:** Exact replica of the Figma overview with:
  - 3 metric stat cards (**03 ACTIVE**, **02 UNDER REVIEW**, **08 RESOLVED**).
  - **My Recent Complaints** table with status badges and quick details modal.
  - **Noise Around You** schematic radar map preview with peak decibel indicators.
- **Report Noise Pollution Form:**
  - `01 Where is the noise happening?`: Location field, *"Use Current Location"* button, and interactive map picker.
  - `02 What type of noise are you reporting?`: Category tiles with icons (*Traffic, Construction, Loudspeaker, Industrial, Other*), title, description, and optional photo evidence URL with live preview.
  - `03 When did it happen?`: Date and time inputs with civic informational note and submission actions.
- **Complaint Tracking:** Full history table with filters, search, and a status timeline. Citizens can safely delete their reports only while in `Submitted` status (protected by a confirmation dialog).
- **Urban Noise Map:** Interactive Chennai schematic map featuring hotspots (Anna Nagar, T. Nagar, Kilpauk, Nungambakkam, Adyar, Velachery, Besant Nagar) with pulsing radar nodes, sound level filters, and a selected hotspot card displaying real-time decibel meters and 24-hour hourly trend analytics.

### Municipal Staff Portal
- **Dedicated Staff Login:** Accessible via *"Municipal Staff? Staff Login ->"* on the sign-in page. Controlled provisioning prevents public staff creation.
- **Operations Dashboard:** Aggregated metrics (Total reports, Pending triage, Active investigation, Resolved cases) with noise source and ward distribution bars.
- **Triage & Status Review Queue:** Municipal officers can update complaint statuses (*Submitted -> Under Review -> Investigating -> Assigned -> Resolved -> Dismissed*), assign specific field officers and squads, and log official inspection notes into the complaint's immutable audit history.

---

## 3. Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, React Router v6, Tailwind CSS, Lucide React |
| **Backend** | Node.js, Express.js, CORS, Morgan |
| **Database** | MongoDB with Mongoose ODM (includes automatic zero-config In-Memory MongoDB fallback for instant grading) |
| **Authentication** | JSON Web Tokens (`jsonwebtoken`), Password Hashing (`bcryptjs` 10 rounds) |
| **API Style** | RESTful JSON API with structured error handling |

---

## 4. Project File Tree

```
fsd/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # MongoDB connection & zero-config memory fallback
│   │   ├── controllers/
│   │   │   ├── authController.js     # Register, login, me, profile updates
│   │   │   ├── complaintController.js# Citizen CRUD & staff status updates
│   │   │   ├── hotspotController.js  # Chennai zones & schematic readings
│   │   │   └── statsController.js    # Citizen & staff dashboard aggregation
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js     # JWT verification & role authorization (RBAC)
│   │   │   └── errorHandler.js       # Centralized error handler
│   │   ├── models/
│   │   │   ├── User.js               # Citizen & staff user schemas with bcrypt
│   │   │   ├── Complaint.js          # Complaint schema with status history
│   │   │   └── Hotspot.js            # Urban zone acoustic readings schema
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── complaintRoutes.js
│   │   │   ├── hotspotRoutes.js
│   │   │   └── statsRoutes.js
│   │   ├── utils/
│   │   │   └── seedData.js           # Demo data matching Figma specifications
│   │   └── server.js                 # Express server bootstrap
│   ├── .env.example                  # Backend environment template
│   ├── package.json
│   └── README.md
├── frontend/
│   ├── public/
│   │   └── favicon.svg               # Teal soundwave favicon
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── ConfirmDialog.jsx # Consequential action confirmation modal
│   │   │   │   ├── LoadingSpinner.jsx
│   │   │   │   ├── Modal.jsx         # Accessible modal dialog
│   │   │   │   └── StatusBadge.jsx   # Accessible badge pairing color with text
│   │   │   ├── complaints/
│   │   │   │   ├── ComplaintDetailModal.jsx # Full detail view & timeline
│   │   │   │   └── ComplaintTable.jsx       # Responsive table & mobile cards
│   │   │   ├── layout/
│   │   │   │   ├── Header.jsx        # Breadcrumb, title, and location badge
│   │   │   │   ├── Layout.jsx        # Persistent sidebar layout
│   │   │   │   └── Sidebar.jsx       # Dark slate sidebar matching Figma
│   │   │   └── map/
│   │   │       ├── HotspotDetailsCard.jsx   # 82dB readout, meter, analytics
│   │   │       └── UrbanNoiseMapCanvas.jsx  # Interactive SVG schematic map
│   │   ├── context/
│   │   │   ├── AuthContext.jsx       # Auth session & role state
│   │   │   └── ToastContext.jsx      # Non-blocking notification toasts
│   │   ├── pages/
│   │   │   ├── CitizenOverviewPage.jsx # Figma Page 1 Bottom replica
│   │   │   ├── LoginPage.jsx           # Figma Page 1 Top replica
│   │   │   ├── MyComplaintsPage.jsx    # Complaint list with filters
│   │   │   ├── NoiseMapPage.jsx        # Figma Page 2 Bottom replica
│   │   │   ├── RegisterPage.jsx        # Citizen registration form
│   │   │   ├── ReportNoisePage.jsx     # Figma Page 2 Top replica
│   │   │   ├── SettingsPage.jsx        # User contact & prototype info
│   │   │   ├── StaffComplaintsPage.jsx # Municipal review & triage queue
│   │   │   └── StaffOverviewPage.jsx   # Municipal operations overview
│   │   ├── services/
│   │   │   └── api.js                # Standardized fetch API client
│   │   ├── App.jsx                   # Route definition & role guards
│   │   ├── index.css                 # Tailwind directives & custom animations
│   │   └── main.jsx                  # React DOM mount point
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js                # Vite dev server with /api proxy
├── docs/
│   ├── API.md                        # Full REST API documentation
│   ├── ARCHITECTURE.md               # Technical architecture & Mermaid diagrams
│   ├── GITHUB_CHECKLIST.md           # Review and faculty checklist
│   ├── PROJECT_SPECIFICATION.md      # Detailed screen inventory & design notes
│   └── postman_collection.json       # Ready-to-import Postman collection
├── .env.example                      # Root environment template
├── .gitignore                        # Git ignore patterns
└── README.md                         # Project documentation
```

---

## 5. Prerequisites
Before setting up the project, ensure you have:
- **Node.js:** v18.0.0 or higher (`node -v`)
- **npm:** v9.0.0 or higher (`npm -v`)
- **MongoDB:** *(Optional)* Local MongoDB service running or MongoDB Atlas connection string. If MongoDB is not installed locally, the backend **automatically switches to an In-Memory MongoDB instance** so you can run and evaluate the system instantly with zero configuration!

---

## 6. Setup & Run Instructions

To run the project locally, open **two separate terminal windows**.

### Terminal 1: Backend API Server
```powershell
# 1. Navigate to backend directory
cd backend

# 2. Install backend dependencies (if not already installed)
npm install

# 3. Create .env file (pre-configured template provided)
Copy-Item .env.example .env

# 4. Start the backend server
npm start
```
*The backend server will run on **http://localhost:5000** and will automatically seed the initial demo data.*

---

### Terminal 2: Frontend Web Client
```powershell
# 1. Navigate to frontend directory
cd frontend

# 2. Install frontend dependencies (if not already installed)
npm install

# 3. Start the Vite development server
npm run dev
```
*The frontend application will be accessible at **http://localhost:5173**.*

---

## 7. Demo Accounts & Evaluation Credentials

For seamless evaluation, pre-seeded accounts matching the Figma design are ready to use. On the login screen (`/login`), click the **"Citizen Demo"** or **"Staff Demo"** button to automatically fill the credentials:

| Role | Email Address | Password | Portal Mode |
| :--- | :--- | :--- | :--- |
| **Citizen Account** | `citizen@urban.gov` | `Password123!` | Citizen Portal (`/overview`) |
| **Municipal Staff** | `staff@urban.gov` | `StaffPassword123!` | Municipal Staff Portal (`/staff/overview`) |

> [!NOTE]
> Public self-registration (`/register`) is open for citizens and will strictly create citizen accounts. Staff accounts can only be created via system administration or seed scripts.

---

## 8. Environment Variables Configuration

### Backend (`backend/.env`)
| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `PORT` | `5000` | Port on which the Express server listens |
| `NODE_ENV` | `development` | Server runtime environment |
| `MONGODB_URI` | `mongodb://127.0.0.1:27017/smart_urban_noise` | Primary MongoDB connection URI (falls back to In-Memory if unreachable) |
| `JWT_SECRET` | `super_secret_jwt_key_change_in_production_998822` | Secret key used to sign and verify JWT authentication tokens |
| `JWT_EXPIRES_IN`| `7d` | Lifespan of issued JWT tokens |
| `CORS_ORIGIN` | `http://localhost:5173` | Allowed origin for Cross-Origin Resource Sharing |

### Frontend (`frontend/.env` or Vite Proxy)
| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | `/api` | Base URL for API calls (proxied by Vite to port 5000) |

---

## 9. API Testing with Postman
A complete, pre-configured Postman collection is included in [`docs/postman_collection.json`](docs/postman_collection.json).

### How to test:
1. Open **Postman**.
2. Click **Import** &rarr; Select `docs/postman_collection.json`.
3. Run the **Auth - Citizen Login** request. The test script will automatically save your JWT token.
4. Run the **Citizen - Submit Complaint** request.
5. Run the **Auth - Staff Login** request, followed by **Staff - Update Complaint Status** to verify the full complaint lifecycle.

---

## 10. Evidence & Claims Transparency
- **Sample Data Notice:** All decibel values (e.g. 82 dB in Anna Nagar), peak hours, and acoustic heatmap contours are illustrative schematic prototype data.
- **Honest Prototype Scope:** No claims are made that this application connects to live hardware IoT sound level meters or runs proprietary machine-learning acoustic models.
- **Evidence Images:** Citizen photo evidence is supported via public Image URLs with instant preview and error-handling fallbacks.

---

## 11. Verification Commands
To verify the complete project locally, run:

```powershell
# 1. Verify frontend production build
cd frontend
npm run build

# 2. Verify backend API and database connection
cd ../backend
node src/server.js
```

---

## 12. License
This project is open-source and released under the [MIT License](LICENSE).
