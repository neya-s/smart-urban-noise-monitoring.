# Smart Urban Noise Monitoring System
## Repository & Faculty Review Checklist

This checklist confirms that the repository satisfies all technical, architectural, aesthetic, and governance criteria for review.

---

### 1. Repository Structure & Hygiene
- [x] Clear root layout with separated `frontend/`, `backend/`, and `docs/` directories.
- [x] Complete `.gitignore` excluding `node_modules/`, `.env`, build outputs, and logs.
- [x] Root `.env.example` and `backend/.env.example` with documented configuration placeholders.
- [x] Zero hard-coded secrets or credentials committed to source code.
- [x] Clean, semantic commit-ready code without unnecessary bloat.

---

### 2. Design System & Visual Fidelity (Figma Reference)
- [x] **Page 1 (Top) Welcome / Login:**
  - [x] Left dark teal/navy card with contour lines, display title *"Quieter streets start with being heard."*, subtitle, and badge *"Monitor. Report. Improve."*.
  - [x] Right warm off-white card with Mobile Number (+91 prefix), Email Address, Password, and teal action button *"CONTINUE ->"*.
  - [x] Quick autofill buttons for evaluation: *"Citizen Demo"* and *"Staff Demo"*.
  - [x] Link to switch between Citizen portal and Municipal Staff portal.
- [x] **Page 1 (Bottom) Citizen Overview:**
  - [x] Persistent desktop sidebar in dark slate navy with brand logo and *"CITIZEN PORTAL"* tag.
  - [x] Header with dynamic greeting (*"Good evening"*), subtitle, and city location badge (*"Chennai, Tamil Nadu"*).
  - [x] Three metric stat cards matching the Figma numbers:
    - [x] **03 ACTIVE** (Complaints in progress)
    - [x] **02 UNDER REVIEW** (Being evaluated today)
    - [x] **08 RESOLVED** (Complaints closed)
  - [x] Left table: *"My Recent Complaints"* with aligned columns, formatted dates, and readable status badges.
  - [x] Right widget: *"Noise Around You"* with mini Chennai schematic radar map, peak reading indicator, and *"Explore Map ->"* button.
- [x] **Page 2 (Top) Report Noise Pollution:**
  - [x] Header: *"CITIZEN / NEW REPORT"* - *"Report Noise Pollution"*.
  - [x] `01 Where is the noise happening?`: Location field, *"Use Current Location"* button, interactive schematic map picker.
  - [x] `02 What type of noise are you reporting?`: Category tiles with icons (Traffic, Construction, Loudspeaker, Industrial, Other), Title, Description, and photo evidence URL input.
  - [x] `03 When did it happen?`: Date and time inputs, informational callout (*"Your report matters"*), and *"SUBMIT COMPLAINT ->"* button.
- [x] **Page 2 (Bottom) Urban Noise Map:**
  - [x] Filter toolbar: All Zones, Noise Level, Date, and Layer toggles.
  - [x] Schematic SVG canvas map of Chennai zones (Anna Nagar, Kilpauk, Nungambakkam, T. Nagar, Adyar, Velachery, Besant Nagar) with pulsing radar rings and decibel labels.
  - [x] Right details card: *"SELECTED HOTSPOT"*, *"Anna Nagar"*, *"HIGH NOISE ZONE"*, *"82 dB"*, colored scale meter, active complaints count, peak hours, regulatory threshold comparison, and *"View Zone Analytics"* hourly trend modal.

---

### 3. Citizen & Municipal Staff Features
- [x] **Citizen Capabilities:**
  - [x] Public registration and JWT login.
  - [x] Overview dashboard displaying live counts and recent reports.
  - [x] Complaint submission with category, coordinates, address, date, time, and photo URL.
  - [x] My Complaints tracker with status history timeline.
  - [x] Safe deletion of complaints only when still in `Submitted` status, with confirmation dialog.
- [x] **Municipal Staff Capabilities:**
  - [x] Separate staff sign-in experience.
  - [x] Controlled staff provisioning (no public staff registration).
  - [x] Municipal operations overview with complaint source and zone distribution charts.
  - [x] Review queue with status updates (Submitted -> Under Review -> Investigating -> Assigned -> Resolved -> Dismissed).
  - [x] Field officer assignment and municipal resolution notes logging.

---

### 4. Backend API & Security Implementation
- [x] Express REST API with input validation and centralized error handling.
- [x] Passwords hashed using `bcryptjs` with 10 salt rounds.
- [x] JWT token generation and authentication middleware (`verifyToken`).
- [x] Role-based access control (`requireRole`) enforced on backend routes.
- [x] Automatic MongoDB In-Memory fallback for zero-config evaluation if local MongoDB service is not running.
- [x] Verified API endpoints with automated tests.

---

### 5. Documentation & Faculty Review Materials
- [x] `README.md` with setup, environment configuration, credentials, and verification steps.
- [x] `docs/PROJECT_SPECIFICATION.md` detailing objectives, visual system, screen mapping, and limitations.
- [x] `docs/API.md` documenting all endpoints, payloads, and responses.
- [x] `docs/ARCHITECTURE.md` with system diagrams, request flows, and security design.
- [x] `docs/postman_collection.json` containing ready-to-import Postman API collection.
