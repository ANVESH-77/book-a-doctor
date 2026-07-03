# 🩺 Book a Doctor

A full-stack healthcare appointment booking platform built with the MERN stack
(MongoDB, Express, React, Node.js). Patients can browse doctors, book
appointments, upload medical documents, and receive notifications. Doctors
can manage their appointments, and admins can approve doctors and monitor
platform activity.

## Features

- **Authentication** — JWT-based signup/login for patients, doctors, and admins
- **Doctor Browsing** — search and filter doctors by name/specialization
- **Appointment Scheduling** — patients book appointments; doctors confirm,
  decline, or complete them
- **Secure Document Uploads** — patients attach files (PDF/images/docs) to
  their appointments
- **Notifications** — in-app notifications for appointment status changes
- **Admin Panel** — approve doctors, manage users, view platform stats

## Tech Stack

- **Frontend:** React.js, React Router, Axios, CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Auth:** JSON Web Tokens (JWT), bcrypt for password hashing
- **File Uploads:** Multer

## Project Structure

```
book-a-doctor/
├── backend/
│   ├── config/          # DB connection
│   ├── models/          # Mongoose schemas (User, Doctor, Appointment, Notification)
│   ├── middleware/       # Auth guard, role guard, file upload
│   ├── routes/           # REST API routes
│   ├── uploads/           # Uploaded documents (created at runtime)
│   ├── server.js
│   └── .env.example
└── frontend/
    ├── public/
    ├── src/
    │   ├── api/           # Axios instance
    │   ├── context/       # Auth context/provider
    │   ├── components/    # Navbar, PrivateRoute
    │   ├── pages/          # Home, Login, Register, DoctorList, DoctorDetail,
    │   │                    PatientDashboard, DoctorDashboard, AdminDashboard,
    │   │                    Notifications
    │   └── styles/
    └── .env.example
```

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB running locally, or a MongoDB Atlas connection string

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# edit .env with your MongoDB URI and JWT secret
npm run dev
```

The API will run at `http://localhost:5000`.

### 2. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm start
```

The app will run at `http://localhost:3000`.

### 3. Create Accounts

- Register as a **patient** to browse and book doctors.
- Register as a **doctor** to get a doctor profile (needs admin approval
  before appearing in search results).
- To create an **admin**, register a user normally, then manually update
  their `role` field to `"admin"` in MongoDB (e.g. via `mongosh` or
  MongoDB Compass), since there's no public admin signup for security.

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user (patient/doctor) |
| POST | `/api/auth/login` | Login and receive a JWT |
| GET | `/api/auth/me` | Get current logged-in user |
| GET | `/api/doctors` | Browse/search approved doctors |
| GET | `/api/doctors/:id` | Get a doctor's profile |
| PUT | `/api/doctors/profile/update` | Doctor updates own profile |
| PUT | `/api/doctors/:id/approve` | Admin approves a doctor |
| POST | `/api/appointments` | Patient books an appointment |
| GET | `/api/appointments/my` | Patient views own appointments |
| GET | `/api/appointments/doctor` | Doctor views their appointments |
| PUT | `/api/appointments/:id/status` | Doctor updates appointment status |
| POST | `/api/appointments/:id/documents` | Patient uploads a document |
| DELETE | `/api/appointments/:id` | Patient cancels an appointment |
| GET | `/api/notifications` | Get current user's notifications |
| PUT | `/api/notifications/:id/read` | Mark a notification as read |
| GET | `/api/admin/users` | Admin lists all users |
| GET | `/api/admin/appointments` | Admin lists all appointments |
| GET | `/api/admin/stats` | Admin dashboard stats |

## Demo & GitHub Links

_Add your live demo URL and GitHub repository link here before submitting
for review:_

- **Demo:** _[add link]_
- **GitHub Repo:** _[add link]_

## License

MIT
