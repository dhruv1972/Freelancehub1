# FreelanceHub

A freelancing platform where clients can find freelancers for their projects.

## About

This is my capstone project for HTTP 5310. FreelanceHub connects freelancers with clients - users can sign up, post projects, submit proposals, message each other, and manage their work.

## Progress Tracker

| Week | Dates | Tasks | Status |
|------|-------|-------|--------|
| Week 1 | Jan 15-22 | Project setup, React + Vite + TypeScript, Login/Register pages, Homepage, GitHub setup | ✅ Done |
| Week 2 | Jan 23-29 | Backend setup (Node.js + Express + MongoDB), User profiles, Create Project page, Search page | ✅ Done |
| Week 3 | Jan 30 - Feb 5 | Proposal system, Messaging, File upload, My Projects dashboard, Usability testing | ✅ Done |
| Week 4 | Feb 6-12 | Time tracking, Stripe payments, Reviews system, Admin dashboard | ✅ Done |
| Week 5 | Feb 13-19 | Notifications, advanced search, testing, UI polish | ✅ Done |
| Week 6 | Feb 20-26 | UI redesign, responsive design, testing | ✅ Done |
| Week 7 | Feb 27 - Mar 5 | Final polish, UAT, go-live, presentation | ✅ Done |

**Total Hours Logged:** 219.0 / 219 hours

## Tech Stack

**Frontend:** React, TypeScript, Vite, Tailwind CSS, React Router

**Backend:** Node.js, Express, MongoDB, Mongoose

**Other:** Stripe (payments), JWT (auth), Multer (file uploads)

## How to Run

**Frontend:**
```
cd client
npm install
npm run dev
```

**Backend:**
```
cd server
npm install
npm run dev
```

Frontend runs on http://localhost:5173
Backend runs on http://localhost:4000

## Features

- User registration and login (freelancer/client)
- User profile management
- Project posting and browsing with search filters
- Proposal submission and management
- Messaging between users (with file sharing)
- Time tracking with start/stop timer and history
- Payment processing (Stripe test mode) with notifications
- Review and rating system (client ↔ freelancer feedback)
- Admin dashboard (user/project management)
- Notifications center (proposals, messages, payments, invitations)
- Search freelancers by skills/experience/location
- Saved jobs for freelancers
- Client invitations to specific freelancers

## Project Structure

```
FreelanceHub/
├── client/          # React frontend
│   └── src/
│       ├── components/
│       └── pages/
├── server/          # Express backend
│   └── src/
│       ├── models/
│       └── routes/
└── docs/            # Documentation
```
