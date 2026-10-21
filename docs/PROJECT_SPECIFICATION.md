# Smart Urban Noise Monitoring System
## Comprehensive Project Specification

---

### 1. Project Overview & Objectives
The **Smart Urban Noise Monitoring System** is a full-stack civic governance platform designed for municipal noise pollution management in urban metropolitan areas (demonstrated in Chennai, Tamil Nadu).

The platform bridges the communication gap between citizens experiencing noise disturbances and municipal acoustic control authorities who investigate, dispatch inspection teams, and enforce city noise regulations.

#### Primary Objectives:
1. **Empower Citizens:** Provide a frictionless interface to report neighborhood acoustic nuisances (traffic, construction, loudspeakers, industrial generators) with precise locations, categories, timestamps, and evidence.
2. **Municipal Triage & Accountability:** Equip municipal acoustic officers with a dedicated staff portal to review complaint queues, assign field squads, update complaint states, and document remediation notes.
3. **Transparent Urban Acoustics Prototype:** Visualize complaint density, hotspot zones, and decibel limits across city sectors with clear communication of what is measured, what is illustrative demo data, and what remains unverified.

---

### 2. Product Character & Visual System
The system is built according to civic public-service design principles:
- **Trustworthy & Impartial:** Objective data presentation without alarmist visuals; strict transparency on sample data vs. verified field measurements.
- **Calm & Restrained Palette:**
  - Background: Warm off-white (`#F8F9FA`) and pure white cards (`#FFFFFF`).
  - Text: Deep charcoal / navy (`#0F172A`, `#1E293B`, `#64748B`).
  - Primary Action Teal: Restrained teal (`#0D9488`, `#0F766E`, `#14B8A6`).
  - Sidebar: Deep slate navy (`#0B131E`).
  - Status "Needs review / In progress": Amber (`#D97706`, `#FEF3C7`).
  - Status "Success / Resolved": Emerald green (`#059669`, `#DCFCE7`).
  - Status "Errors / Severe": Red sparingly (`#DC2626`, `#FEE2E2`).
- **Typography:** Inter sans-serif font family with strict hierarchical rhythm for eyebrow tags, page titles, card statistics, and data tables.
- **Accessibility:** Status badges never rely on color alone; every badge pairs an indicator dot and icon with an explicit, readable textual label (e.g., "Investigating", "Assigned", "Resolved").

---

### 3. Screen Inventory & Figma Reference Mapping

Based on the provided Figma design document, screens and components are mapped as follows:

| Figma Screen / Section | Frontend Route | Purpose & Implemented Components | Inferred / Extended Behavior |
| :--- | :--- | :--- | :--- |
| **Welcome / Login Screen** *(Figma Page 1 Top)* | `/login` | Split-screen hero layout: dark teal left hero panel with "Quieter streets start with being heard", right card with mobile, email, and password inputs. | Added quick evaluation buttons ("Fill Demo Citizen" / "Fill Demo Staff") and toggle for Municipal Staff Portal sign-in. |
| **Citizen Registration** *(Inferred from "Enter details to continue")* | `/register` | Public self-registration form (Full name, email, mobile number, password). | Public self-registration strictly enforces `role: 'citizen'`. Staff accounts cannot be self-registered publicly. |
| **Citizen Overview Dashboard** *(Figma Page 1 Bottom)* | `/overview` | Top header ("Good evening"), 3 stat cards ("ACTIVE 03", "UNDER REVIEW 02", "RESOLVED 08"), "My Recent Complaints" table with status badges, and "Noise Around You" preview widget. | Dynamic greeting (morning/afternoon/evening), click-to-view complaint detail modal, click-to-explore map button. |
| **Report Noise Pollution** *(Figma Page 2 Top)* | `/report` | Multi-step reporting card: `01 Where is the noise happening?` (location input + current location button + map picker), `02 What type of noise are you reporting?` (Traffic, Construction, Loudspeaker, Industrial, Other tiles + title + description + optional photo URL), `03 When did it happen?` (date and time inputs + info note + cancel & submit buttons). | Interactive map picker syncs coordinates and address. Instant photo evidence URL preview with error handling. |
| **Urban Noise Map** *(Figma Page 2 Bottom)* | `/map` | Filter toolbar (All Zones, Noise Level, Date, Layer), Schematic SVG canvas map of Chennai zones (Anna Nagar, Kilpauk, Nungambakkam, T. Nagar, Adyar, Velachery, Besant Nagar) with pulsing radar nodes and decibels, Right details card ("SELECTED HOTSPOT", "82 dB", colored meter scale, threshold status, active count, peak hours, primary source). | "View Zone Analytics" button triggers a modal displaying a 24-hour hourly decibel histogram curve with prescribed day/night limit markers. |
| **My Complaints Tracker** *(Inferred from sidebar "My Complaints")* | `/my-complaints` | Full tracking dashboard of all citizen-submitted reports with status filter, category filter, search bar, and deletion modal for submitted reports. | Citizen can inspect status timeline progression. Consequential delete action requires confirmation dialog and is blocked once staff begins review. |
| **Municipal Staff Overview** *(Inferred from Staff Portal spec)* | `/staff/overview` | Municipal dispatch metrics: Total reports, Pending triage, Active investigation, Resolved cases, plus Source distribution and Zone distribution meters. | Restricted to authenticated users with `role: 'staff'`. |
| **Staff Complaints Review** *(Inferred from Staff Portal spec)* | `/staff/complaints` | Municipal triage queue with search, zone, category, and status filters. Staff review modal to update status, assign officer, assign division squad, and enter resolution notes. | Updates are appended to the complaint's immutable status history audit log. |
| **Account Settings** *(Inferred from sidebar "Settings")* | `/settings` | Profile management (name, phone update) and system prototype notice documenting illustrative sample data. | Allows citizen/staff to modify contact phone used for field verification. |

---

### 4. Complaint Lifecycle & Role Boundaries

```
[Citizen Submits Report] -> Status: "Submitted"
          │
          ▼
[Staff Initial Screening] -> Status: "Under Review"
          │
          ▼
[Field Investigation] -> Status: "Investigating"
          │
          ▼
[Officer & Squad Assigned] -> Status: "Assigned"
          │
          ├──> [Mitigation Complete / Notice Issued] -> Status: "Resolved"
          │
          └──> [Non-Violation / Duplicate Report] -> Status: "Dismissed"
```

#### Access Control Rules:
1. **Citizen Privileges:**
   - Can submit new complaints (`POST /api/complaints`).
   - Can view only their own complaints (`GET /api/complaints/my`).
   - Can delete their complaint **only while in `Submitted` status** (`DELETE /api/complaints/:id`).
   - Cannot view complaints submitted by other citizens.
   - Cannot access staff triage or update complaint statuses.
2. **Staff Privileges:**
   - Controlled provisioning: Staff accounts are created through system administration or seed data; no public staff registration.
   - Can review all citizen complaints across all wards (`GET /api/complaints`).
   - Can transition complaint states and record official municipal action notes (`PUT /api/complaints/:id/status`).
   - Backend routes enforce role authorization using JWT authentication middleware and `requireRole('staff')`.

---

### 5. Evidence & Image Handling Specification
- **Method Implemented:** Public Image URL storage (`evidenceImageUrl`).
- **Rationale & Clarity:** Users can attach an image URL pointing to photographic evidence (e.g., photo of construction equipment, diesel generator, sound amplifier, or site permit board). The frontend displays an instant image preview with graceful fallback handling if the image link fails.
- **Data Integrity:** URLs are validated and sanitized. The project does not claim AWS S3 or cloud bucket integration, maintaining honest prototype documentation.

---

### 6. Prototype Boundaries & Illustrative Data Claims
- **Sample Data Transparency:** All decibel values, sensor readings, and noise contour maps are explicitly labeled as **"SAMPLE DATA"** and **"DEMO MODE"**.
- **No False Claims:** Readings are not claimed to be live IoT hardware feeds, machine-learning sound predictions, or certified legal sound meters.
- **Schematic Map:** The Chennai map is presented as an architectural schematic prototype illustrating zone-level acoustic monitoring.
