# HTTP 5310 Capstone Project Requirements Document

## FreelanceHub - Freelance Marketplace Platform

**Student Name:** Dhruv Chavda  
**Project Type:** Freelance Service Marketplace  
**Date:** [Current Date]

---

## 1. Introduction and Rationale

### 1.1 Purpose
FreelanceHub is a comprehensive full-stack web application designed to connect clients seeking freelance services with skilled freelancers looking for work opportunities. The platform enables clients to post projects, freelancers to discover and apply for jobs, and facilitates seamless collaboration through proposals, messaging, and secure payment processing.

### 1.2 Target Audience
- **Freelancers:** Professionals seeking project opportunities and managing their freelance work
- **Clients:** Businesses and individuals looking to hire freelancers for their projects
- **Administrators:** Platform managers overseeing user accounts and project listings

### 1.3 Goals and Objectives
- Provide a user-friendly marketplace platform for freelance services
- Enable secure project collaboration between clients and freelancers
- Facilitate secure payment processing through Stripe integration
- Build a professional, accessible, and responsive web application
- Demonstrate full-stack development capabilities using modern technologies

### 1.4 Expected Outcomes
- A fully functional freelance marketplace with core features implemented
- Secure authentication and authorization system
- Integrated payment processing system
- Real-time communication and project management capabilities
- Admin dashboard for platform oversight

---

## 2. Content Evaluation

### 2.1 Navigation Structure

**Main Navigation (All Users):**
- Home
- Search Projects (Freelancers)
- Find Freelancers (Clients)
- Messages
- Notifications
- Profile/Settings

**User-Specific Navigation:**
- **Freelancers:** My Profile, My Proposals, My Projects
- **Clients:** Post Project, My Projects
- **Admin:** Dashboard (Users & Projects Management)

**Authentication:**
- Sign In / Sign Up (modal)
- User Dropdown Menu (when logged in)
- Logout

### 2.2 Layout and Wireframes

**Homepage Layout:**
```
[Logo]  Navigation Bar  [Sign In/Sign Up]
------------------------------------------------
Hero Section: "Find Your Perfect Match"
[Get Started as Freelancer] [Hire Talent]

How It Works Section
Featured Projects Section
Footer: About | Contact | Privacy | Terms
```

**Dashboard Layout:**
```
[Header with Navigation]
[Sidebar: Menu Items]
[Main Content Area: Dynamic Content]
[Footer]
```

**Project Detail Page:**
```
[Project Title & Details]
[Client Information]
[Proposals List] (for clients)
[Submit Proposal Form] (for freelancers)
[Time Tracking] (for freelancers)
[Payment Section] (for clients)
[Reviews Section]
```

### 2.3 Content Descriptions and Sources

**Content Types:**

1. **User-Generated Content:**
   - User profiles (bio, skills, experience, location)
   - Project descriptions and requirements
   - Proposals (cover letters, budgets, timelines)
   - Messages and file attachments
   - Reviews and ratings

2. **System-Generated Content:**
   - Notifications (proposal updates, messages, project status)
   - Time tracking entries
   - Payment records
   - Admin dashboard statistics

3. **Static Content:**
   - Homepage hero text and call-to-action buttons
   - How It Works section
   - Footer links and information
   - Error messages and validation text

**Content Sources:**
- All content is user-generated or system-generated
- No external content APIs required
- Placeholder images/icons from free icon libraries (Font Awesome, Material Icons)
- Sample data created via seed scripts for testing

### 2.4 Content-Types (Real-World Entities)

**Main Content-Types:**

1. **User** (freelancer/client/admin)
   - Attributes: email, password, firstName, lastName, userType, profile
   - Relationships: has Profile, creates Projects, submits Proposals, sends Messages

2. **Profile** (embedded in User)
   - Attributes: bio, skills[], experience, portfolio[], resume, location, rating
   - Relationships: belongs to User

3. **Project**
   - Attributes: title, description, category, budget, timeline, status, requirements[]
   - Relationships: belongs to Client, has Proposals, has TimeEntries, has Reviews

4. **Proposal**
   - Attributes: coverLetter, proposedBudget, timeline, status
   - Relationships: belongs to Project and Freelancer

5. **Message**
   - Attributes: content, attachments[], read status
   - Relationships: has Sender and Receiver, optional Project link

6. **TimeEntry**
   - Attributes: startTime, endTime, durationMinutes, description
   - Relationships: belongs to Project and Freelancer

7. **Review**
   - Attributes: rating, comment, reviewType
   - Relationships: belongs to Project, has Reviewer and Reviewee

8. **Notification**
   - Attributes: type, message, read status
   - Relationships: belongs to User

---

## 3. Functionality (User Stories)

### 3.1 Must Have User Stories (27 Stories)

#### US-1: As a freelancer, I want to create an account so that I can access the platform

| Task | Time (hours) |
|------|--------------|
| Registration form UI (email, password, firstName, lastName, userType) | 1 |
| Form validation (client-side) | 0.5 |
| Password strength validation | 0.5 |
| Backend registration endpoint | 1.5 |
| Password hashing (bcrypt) | 0.5 |
| Email uniqueness check | 0.5 |
| JWT token generation | 0.5 |
| Error handling and user feedback | 0.5 |
| Auto-login after registration | 0.5 |
| Responsive design | 0.5 |
| **Total** | **6.5** |

#### US-2: As a freelancer, I want to log in to my account

| Task | Time (hours) |
|------|--------------|
| Login form UI (email, password) | 0.5 |
| Form validation | 0.5 |
| Backend login endpoint | 1 |
| Password verification (bcrypt) | 0.5 |
| JWT token generation and response | 0.5 |
| Token storage (localStorage) | 0.5 |
| Error handling (invalid credentials) | 0.5 |
| "Remember me" functionality | 0.5 |
| Responsive design | 0.5 |
| **Total** | **5** |

#### US-3: As a freelancer, I want to create and update my profile

| Task | Time (hours) |
|------|--------------|
| Profile form UI (bio, skills, experience, location) | 1.5 |
| Skills input (add/remove tags) | 1 |
| Form validation | 0.5 |
| Backend profile endpoint (POST/PUT) | 1.5 |
| Profile data persistence (MongoDB) | 1 |
| View mode vs Edit mode toggle | 0.5 |
| Save/Cancel buttons | 0.5 |
| Success/error feedback | 0.5 |
| Responsive design | 0.5 |
| **Total** | **7.5** |

#### US-4: As a freelancer, I want to upload my resume

| Task | Time (hours) |
|------|--------------|
| File upload input UI | 0.5 |
| File type validation (PDF, DOC, DOCX) | 0.5 |
| File size validation (max 5MB) | 0.5 |
| Multer configuration (backend) | 1 |
| File storage (uploads directory) | 0.5 |
| File path storage in profile | 0.5 |
| File serving endpoint | 0.5 |
| Download/view resume link | 0.5 |
| Error handling | 0.5 |
| Loading state during upload | 0.5 |
| **Total** | **5.5** |

#### US-5: As a freelancer, I want to upload portfolio pieces

| Task | Time (hours) |
|------|--------------|
| Portfolio upload UI (multiple files) | 1 |
| File validation (type, size) | 0.5 |
| File upload handling (Multer) | 1 |
| Portfolio array management | 0.5 |
| Display portfolio links/files | 0.5 |
| Remove portfolio item | 0.5 |
| Support for URLs and file uploads | 0.5 |
| Error handling | 0.5 |
| **Total** | **5** |

#### US-6: As a freelancer, I want to search for jobs by category, skills, and location

| Task | Time (hours) |
|------|--------------|
| Search page UI | 1.5 |
| Search input field | 0.5 |
| Category filter dropdown | 0.5 |
| Skills filter input | 0.5 |
| Location filter | 0.5 |
| Budget range filter | 0.5 |
| Backend search endpoint with filters | 2 |
| MongoDB query with filters | 1.5 |
| Search results display | 1.5 |
| Pagination | 1 |
| Responsive design | 0.5 |
| **Total** | **10.5** |

#### US-7: As a freelancer, I want to view detailed job descriptions

| Task | Time (hours) |
|------|--------------|
| Project detail page layout | 1.5 |
| Display project information (title, description, budget, timeline) | 0.5 |
| Display client information | 0.5 |
| Display requirements list | 0.5 |
| Display project status | 0.5 |
| Backend project detail endpoint | 0.5 |
| Error handling (project not found) | 0.5 |
| Responsive design | 0.5 |
| **Total** | **5** |

#### US-8: As a freelancer, I want to apply for jobs directly through the platform

| Task | Time (hours) |
|------|--------------|
| Proposal form UI (cover letter, proposed budget, timeline) | 1.5 |
| Form validation | 0.5 |
| Submit proposal button | 0.5 |
| Backend proposal creation endpoint | 1.5 |
| Duplicate proposal prevention | 0.5 |
| Proposal saved to database | 0.5 |
| Success confirmation | 0.5 |
| Error handling | 0.5 |
| **Total** | **6** |

#### US-9: As a freelancer, I want to create and submit proposals to clients

| Task | Time (hours) |
|------|--------------|
| Proposal form on project page | 1 |
| Cover letter textarea | 0.5 |
| Proposed budget input | 0.5 |
| Timeline input | 0.5 |
| Form submission | 0.5 |
| Backend proposal endpoint | 1 |
| Proposal status (pending) | 0.5 |
| Notification to client | 0.5 |
| **Total** | **5** |

#### US-10: As a freelancer, I want to manage my submitted proposals

| Task | Time (hours) |
|------|--------------|
| My Proposals page UI | 1.5 |
| List all proposals | 0.5 |
| Filter by status (pending/accepted/rejected) | 1 |
| Display proposal details | 0.5 |
| Link to project | 0.5 |
| Backend proposals endpoint (filtered by freelancer) | 1.5 |
| Status badges | 0.5 |
| Responsive design | 0.5 |
| **Total** | **6.5** |

#### US-11: As a freelancer, I want to send and receive messages from clients

| Task | Time (hours) |
|------|--------------|
| Messages page UI | 1.5 |
| Conversation list sidebar | 1.5 |
| Message display area | 1.5 |
| Message input field | 0.5 |
| Send message button | 0.5 |
| Backend message creation endpoint | 1.5 |
| Fetch messages endpoint | 1 |
| Real-time message display | 0.5 |
| Unread message indicators | 0.5 |
| Responsive design | 0.5 |
| **Total** | **9.5** |

#### US-12: As a freelancer, I want to share files and documents with clients

| Task | Time (hours) |
|------|--------------|
| File attachment button in message UI | 0.5 |
| File selection dialog | 0.5 |
| File validation (type, size) | 0.5 |
| File upload to server | 1 |
| File path stored with message | 0.5 |
| Display file attachments in messages | 0.5 |
| Download file functionality | 0.5 |
| File icon/type display | 0.5 |
| Error handling | 0.5 |
| **Total** | **5** |

#### US-13: As a freelancer, I want to view and manage my ongoing projects

| Task | Time (hours) |
|------|--------------|
| My Projects page UI | 1.5 |
| List of active projects | 0.5 |
| Project status display | 0.5 |
| Link to project detail | 0.5 |
| Backend projects endpoint (filtered by freelancer) | 1.5 |
| Project status filtering | 0.5 |
| Responsive design | 0.5 |
| **Total** | **5.5** |

#### US-14: As a freelancer, I want to update project statuses and milestones

| Task | Time (hours) |
|------|--------------|
| Project status update UI | 1 |
| Status dropdown (in-progress/completed) | 0.5 |
| Update status endpoint | 1 |
| Status change validation | 0.5 |
| Notification to client on status change | 0.5 |
| Status history (optional) | 0.5 |
| **Total** | **4** |

#### US-15: As a freelancer, I want to track time spent on projects

| Task | Time (hours) |
|------|--------------|
| Timer UI component | 1.5 |
| Start timer button | 0.5 |
| Stop timer button | 0.5 |
| Timer display (hours:minutes:seconds) | 0.5 |
| Description input for time entry | 0.5 |
| Backend start timer endpoint | 1.5 |
| Backend stop timer endpoint | 1.5 |
| Duration calculation | 0.5 |
| Time entries history display | 1.5 |
| Prevent multiple active timers | 0.5 |
| **Total** | **9** |

#### US-16: As a freelancer, I want to view my overall rating and client reviews

| Task | Time (hours) |
|------|--------------|
| Reviews section on profile page | 1 |
| Overall rating calculation | 0.5 |
| Star rating display | 0.5 |
| Individual reviews list | 0.5 |
| Review details (rating, comment, date) | 0.5 |
| Backend reviews endpoint (filtered by freelancer) | 1 |
| Rating breakdown display | 0.5 |
| Responsive design | 0.5 |
| **Total** | **5** |

#### US-17: As a client, I want to create an account

| Task | Time (hours) |
|------|--------------|
| Registration form (same as US-1, userType: client) | 0.5 |
| Client-specific registration flow | 0.5 |
| **Total** | **1** |

#### US-18: As a client, I want to create and post job listings

| Task | Time (hours) |
|------|--------------|
| Create Project page UI | 2 |
| Project form (title, description, category, budget, timeline) | 1.5 |
| Requirements input (multiple skills) | 1 |
| Form validation | 1 |
| Submit button | 0.5 |
| Backend project creation endpoint | 1.5 |
| Project saved to database | 0.5 |
| Success confirmation | 0.5 |
| Error handling | 0.5 |
| Responsive design | 0.5 |
| **Total** | **9.5** |

#### US-19: As a client, I want to provide detailed job descriptions, requirements, and budgets

| Task | Time (hours) |
|------|--------------|
| Rich text description field | 0.5 |
| Requirements array input | 0.5 |
| Budget input with validation | 0.5 |
| Timeline selection | 0.5 |
| Category selection | 0.5 |
| (Included in US-18) | 0 |
| **Total** | **2.5** |

#### US-20: As a client, I want to search for freelancers by skills, experience, and location

| Task | Time (hours) |
|------|--------------|
| Search Freelancers page UI | 1.5 |
| Skills search input | 0.5 |
| Location filter | 0.5 |
| Experience filter | 0.5 |
| Rating filter | 0.5 |
| Backend freelancer search endpoint | 2 |
| MongoDB query with filters | 1.5 |
| Freelancer cards display | 1.5 |
| Pagination | 0.5 |
| Responsive design | 0.5 |
| **Total** | **10** |

#### US-21: As a client, I want to view freelancer profiles and portfolios

| Task | Time (hours) |
|------|--------------|
| View Profile page UI | 1.5 |
| Display freelancer information | 0.5 |
| Display skills list | 0.5 |
| Display portfolio items (links/files) | 1 |
| Resume download link | 0.5 |
| Rating and reviews display | 0.5 |
| Backend profile endpoint | 0.5 |
| Error handling | 0.5 |
| Responsive design | 0.5 |
| **Total** | **6** |

#### US-22: As a client, I want to review proposals from freelancers

| Task | Time (hours) |
|------|--------------|
| Proposals list on project page | 1.5 |
| Display proposal details | 0.5 |
| Display freelancer information | 0.5 |
| Accept/Reject buttons | 0.5 |
| Backend proposals endpoint (filtered by project) | 1 |
| Proposal status update endpoint | 1.5 |
| Notification to freelancer | 0.5 |
| Project status update on acceptance | 0.5 |
| **Total** | **6.5** |

#### US-23: As a client, I want to make payments to freelancers securely

| Task | Time (hours) |
|------|--------------|
| Payment button on project page | 0.5 |
| Payment modal UI | 1.5 |
| Stripe Elements integration | 2 |
| Payment form (card input) | 1 |
| Backend payment intent creation | 1.5 |
| Stripe API integration | 1.5 |
| Payment confirmation | 0.5 |
| Error handling | 1 |
| Success/error feedback | 0.5 |
| **Total** | **10** |

#### US-24: As a client, I want to receive feedback and ratings from freelancers

| Task | Time (hours) |
|------|--------------|
| Review submission form | 1 |
| Rating selector (1-5 stars) | 0.5 |
| Comment textarea | 0.5 |
| Review type selection | 0.5 |
| Submit review endpoint | 1 |
| Review saved to database | 0.5 |
| Notification to freelancer | 0.5 |
| Success confirmation | 0.5 |
| **Total** | **5** |

#### US-25: As an admin, I want to view all users in the system

| Task | Time (hours) |
|------|--------------|
| Admin dashboard UI | 1.5 |
| Users tab | 0.5 |
| Users list table | 1.5 |
| User details display | 0.5 |
| Backend admin users endpoint | 1 |
| Admin authentication check | 0.5 |
| Pagination | 0.5 |
| Responsive design | 0.5 |
| **Total** | **6.5** |

#### US-26: As an admin, I want to suspend or activate user accounts

| Task | Time (hours) |
|------|--------------|
| Suspend/Activate buttons in user list | 0.5 |
| Confirmation dialog | 0.5 |
| Backend suspend endpoint | 1 |
| Backend activate endpoint | 1 |
| User status update in database | 0.5 |
| Status change notification | 0.5 |
| UI update after status change | 0.5 |
| **Total** | **4.5** |

#### US-27: As an admin, I want to view all projects in the system

| Task | Time (hours) |
|------|--------------|
| Projects tab in admin dashboard | 0.5 |
| Projects list table | 1.5 |
| Project details display | 0.5 |
| Backend admin projects endpoint | 1 |
| Project status filtering | 0.5 |
| Pagination | 0.5 |
| **Total** | **4.5** |

**Total Must Have Stories: 27 stories**  
**Total Must Have Hours: 150 hours**

---

### 3.2 Should Have User Stories (5 Stories)

#### US-28: As a freelancer, I want to save favorite jobs so that I can apply to them later

| Task | Time (hours) |
|------|--------------|
| Favorite button on project cards | 0.5 |
| Favorite icon toggle | 0.5 |
| Backend favorite endpoint (POST/DELETE) | 1 |
| Favorites list page | 1 |
| Display favorited projects | 0.5 |
| Remove from favorites | 0.5 |
| **Total** | **4** |

#### US-29: As a client, I want to invite specific freelancers to apply for my jobs

| Task | Time (hours) |
|------|--------------|
| Invite button on freelancer profile | 0.5 |
| Invite modal/form | 0.5 |
| Backend invite creation endpoint | 1 |
| Notification to freelancer | 0.5 |
| Invited projects list for freelancer | 1 |
| **Total** | **3.5** |

#### US-30: As a freelancer, I want to set up job alerts so that I can be notified of relevant opportunities

| Task | Time (hours) |
|------|--------------|
| Job alerts settings page | 1.5 |
| Alert criteria (skills, category, budget) | 1 |
| Backend alert creation endpoint | 1.5 |
| Alert matching logic | 1.5 |
| Email notification system | 1.5 |
| Manage alerts (edit/delete) | 0.5 |
| **Total** | **7.5** |

#### US-31: As a client, I want to create project templates so that I can quickly post similar jobs

| Task | Time (hours) |
|------|--------------|
| Template creation UI | 1.5 |
| Save as template option | 0.5 |
| Templates list page | 1 |
| Use template to create project | 1 |
| Backend template endpoints | 1.5 |
| Template management (edit/delete) | 0.5 |
| **Total** | **6** |

#### US-32: As both users, I want to use video calling so that we can have face-to-face discussions

| Task | Time (hours) |
|------|--------------|
| Video call button in messages | 0.5 |
| Video call modal/page | 1.5 |
| WebRTC integration | 5 |
| Backend signaling server | 2 |
| Call controls (mute, video toggle, end) | 1.5 |
| Call history | 0.5 |
| **Total** | **11.5** |

**Total Should Have Stories: 5 stories**  
**Total Should Have Hours: 32 hours**

---

### 3.3 Nice to Have User Stories (3 Stories)

#### US-33: As a freelancer, I want to create a custom portfolio website

| Task | Time (hours) |
|------|--------------|
| Portfolio builder UI | 3 |
| Template selection | 1.5 |
| Customization options | 2 |
| Portfolio preview | 1 |
| Publish portfolio | 1 |
| Backend portfolio storage | 1.5 |
| **Total** | **10** |

#### US-34: As a client, I want to use AI-powered matching

| Task | Time (hours) |
|------|--------------|
| AI matching algorithm | 5 |
| Machine learning model integration | 4 |
| Matching score calculation | 2 |
| Display matched freelancers | 1.5 |
| Backend matching endpoint | 1.5 |
| **Total** | **14** |

#### US-35: As both users, I want to access the platform through a mobile app

| Task | Time (hours) |
|------|--------------|
| React Native setup | 1.5 |
| Mobile app UI components | 5 |
| API integration | 2.5 |
| Push notifications | 2 |
| App store deployment | 2 |
| **Total** | **13** |

**Total Nice to Have Stories: 3 stories**  
**Total Nice to Have Hours: 37 hours**

---

### 3.4 Hourly Estimates Summary

| Category | Number of Stories | Total Hours |
|----------|-------------------|-------------|
| Must Have | 27 | 150 |
| Should Have | 5 | 32 |
| Nice to Have | 3 | 37 |
| **Total** | **35** | **219** |

**Estimated Development Time:** 219 hours (7 weeks at 30 hours/week = 210 hours, with 9 hours buffer)

---

## 4. Technical Specifications

### 4.1 Technology Stack

**Frontend:**
- React 19.1.1 (https://react.dev/)
- TypeScript 5.8.3 (https://www.typescriptlang.org/)
- Vite 7.1.7 (https://vitejs.dev/)
- React Router DOM 7.9.2 (https://reactrouter.com/)
- Axios 1.12.2 (https://axios-http.com/)
- Stripe React SDK (@stripe/react-stripe-js 4.0.2, @stripe/stripe-js 7.9.0)

**Backend:**
- Node.js (https://nodejs.org/)
- Express 5.1.0 (https://expressjs.com/)
- TypeScript 5.9.2
- MongoDB Atlas (https://www.mongodb.com/cloud/atlas)
- Mongoose 8.18.1 (https://mongoosejs.com/)

**Authentication & Security:**
- JWT (jsonwebtoken 9.0.2)
- bcryptjs 3.0.2 (https://www.npmjs.com/package/bcryptjs)

**File Handling:**
- Multer 2.0.2 (https://github.com/expressjs/multer)

**Payment Processing:**
- Stripe 18.5.0 (https://stripe.com/docs/api)

**Development Tools:**
- ESLint 9.36.0
- Prettier 3.6.2
- ts-node-dev 2.0.0

### 4.2 Hosting Information

**Frontend Hosting:**
- Platform: Vercel (https://vercel.com/)
- Build Command: `npm run build`
- Output Directory: `client/dist`
- Environment Variables: `VITE_API_BASE_URL`, `VITE_STRIPE_PUBLISHABLE_KEY`

**Backend Hosting:**
- Platform: Render (https://render.com/) or Railway
- Build Command: `npm run build`
- Start Command: `npm start`
- Environment Variables: `PORT`, `MONGODB_URI`, `JWT_SECRET`, `STRIPE_SECRET_KEY`, `CORS_ORIGIN`

**Database:**
- Platform: MongoDB Atlas (https://www.mongodb.com/cloud/atlas)
- Free Tier: 512MB storage
- Connection: MongoDB URI in environment variables

**File Storage:**
- Development: Local file system (`server/uploads/`)
- Production: Consider AWS S3 or Cloudinary for scalability

### 4.3 Third-Party Software

1. **Stripe Payment API**
   - Version: 18.5.0
   - URL: https://stripe.com/docs/api
   - Purpose: Secure payment processing
   - Cost: 2.9% + $0.30 per transaction (production), free in test mode

2. **MongoDB Atlas**
   - Version: Latest
   - URL: https://www.mongodb.com/cloud/atlas
   - Purpose: Cloud database hosting
   - Cost: Free tier available

3. **React Router**
   - Version: 7.9.2
   - URL: https://reactrouter.com/
   - Purpose: Client-side routing

4. **Axios**
   - Version: 1.12.2
   - URL: https://axios-http.com/
   - Purpose: HTTP client for API calls

---

## 5. Data Design

### 5.1 Data Flow Diagrams

**User Registration Flow:**
```
User → Registration Form → Validate Input
  [Invalid] → Show Errors → User Fixes → Validate Again
  [Valid] → Check Email Exists in Database
    [Exists] → Show "Email Already Registered" Error
    [Not Exists] → Hash Password → Create User Record → Generate JWT Token → Store Token → Redirect to Dashboard
```

**Project Creation Flow:**
```
Client → Create Project Form → Validate Input
  [Invalid] → Show Validation Errors
  [Valid] → Save Project to Database → Create Notification for Matching Freelancers → Display Success Message → Redirect to Project Page
```

**Proposal Submission Flow:**
```
Freelancer → View Project → Fill Proposal Form → Validate Input
  [Invalid] → Show Errors
  [Valid] → Check if Proposal Already Exists
    [Exists] → Show "Already Applied" Error
    [Not Exists] → Save Proposal → Create Notification for Client → Display Success Message
```

**Payment Processing Flow:**
```
Client → Click Payment Button → Open Payment Modal → Enter Card Details → Submit Payment
  → Create Stripe Payment Intent → Confirm Payment with Stripe
    [Payment Failed] → Show Error Message → Allow Retry
    [Payment Success] → Update Project Status → Create Payment Record → Send Receipt Notification → Close Modal → Show Success Message
```

**Messaging Flow:**
```
User → Open Messages → Select Conversation → Type Message → (Optional) Attach File → Send Message
  → Upload File (if attached) → Save Message to Database → Create Notification for Receiver → Display Message in Chat
```

**Time Tracking Flow:**
```
Freelancer → Open Project → Enter Description → Click Start Timer
  → Create TimeEntry with startTime → Display Running Timer → Click Stop Timer
  → Calculate Duration → Update TimeEntry with endTime and duration → Display Time Entry in History
```

### 5.2 Database Schemas

**Users Collection:**
```javascript
{
  _id: ObjectId,
  email: String (unique, required),
  password: String (hashed, required),
  firstName: String (required),
  lastName: String (required),
  userType: String (enum: ['freelancer', 'client', 'admin'], required),
  isVerified: Boolean (default: false),
  isActive: Boolean (default: true),
  status: String (enum: ['active', 'suspended'], default: 'active'),
  profile: {
    bio: String,
    skills: [String],
    experience: String,
    portfolio: [String],
    resume: String,
    rating: Number (default: 0),
    location: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

**Projects Collection:**
```javascript
{
  _id: ObjectId,
  clientId: ObjectId (ref: 'User', required),
  title: String (required),
  description: String (required),
  category: String (required),
  budget: Number (required),
  timeline: String (required),
  status: String (enum: ['open', 'in-progress', 'completed'], default: 'open'),
  requirements: [String],
  selectedFreelancer: ObjectId (ref: 'User'),
  createdAt: Date,
  updatedAt: Date
}
```

**Proposals Collection:**
```javascript
{
  _id: ObjectId,
  projectId: ObjectId (ref: 'Project', required),
  freelancerId: ObjectId (ref: 'User', required),
  coverLetter: String (required),
  proposedBudget: Number (required),
  timeline: String (required),
  status: String (enum: ['pending', 'accepted', 'rejected'], default: 'pending'),
  createdAt: Date
}
```

**Messages Collection:**
```javascript
{
  _id: ObjectId,
  senderId: ObjectId (ref: 'User', required),
  receiverId: ObjectId (ref: 'User', required),
  projectId: ObjectId (ref: 'Project', optional),
  content: String (required),
  attachments: [String],
  read: Boolean (default: false),
  createdAt: Date
}
```

**TimeEntries Collection:**
```javascript
{
  _id: ObjectId,
  freelancerId: ObjectId (ref: 'User', required),
  projectId: ObjectId (ref: 'Project', required),
  startTime: Date (required),
  endTime: Date,
  durationMinutes: Number,
  description: String,
  createdAt: Date
}
```

**Reviews Collection:**
```javascript
{
  _id: ObjectId,
  projectId: ObjectId (ref: 'Project', required),
  reviewerId: ObjectId (ref: 'User', required),
  revieweeId: ObjectId (ref: 'User', required),
  rating: Number (required, min: 1, max: 5),
  comment: String (required),
  reviewType: String (enum: ['client-to-freelancer', 'freelancer-to-client'], required),
  createdAt: Date
}
```

**Notifications Collection:**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User', required),
  type: String (required),
  message: String (required),
  relatedId: ObjectId (optional),
  read: Boolean (default: false),
  createdAt: Date
}
```

---

## 6. Development Specifications

### 6.1 Folder Structure

```
Capstone/
├── client/                    # React frontend application
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── components/       # Reusable React components
│   │   │   ├── AuthModal.tsx
│   │   │   └── PaymentModal.tsx
│   │   ├── pages/            # Page components
│   │   │   ├── Admin.tsx
│   │   │   ├── CreateProject.tsx
│   │   │   ├── Messages.tsx
│   │   │   ├── MyProjects.tsx
│   │   │   ├── MyProposals.tsx
│   │   │   ├── Notifications.tsx
│   │   │   ├── Profile.tsx
│   │   │   ├── Project.tsx
│   │   │   ├── Search.tsx
│   │   │   ├── SearchFreelancers.tsx
│   │   │   └── ViewProfile.tsx
│   │   ├── services/          # API service layer
│   │   │   └── api.ts
│   │   ├── App.tsx           # Main app component
│   │   ├── App.css           # Global styles
│   │   ├── index.css         # Base styles
│   │   └── main.tsx          # Entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── server/                    # Express backend application
│   ├── src/
│   │   ├── models/           # Mongoose models
│   │   │   ├── User.ts
│   │   │   ├── Project.ts
│   │   │   ├── Proposal.ts
│   │   │   ├── Message.ts
│   │   │   ├── TimeEntry.ts
│   │   │   ├── Review.ts
│   │   │   └── Notification.ts
│   │   ├── routes/           # Route handlers
│   │   │   ├── auth.ts
│   │   │   └── routes.ts
│   │   ├── middleware/       # Express middleware
│   │   │   └── auth.ts
│   │   ├── db.ts            # Database connection
│   │   └── index.ts         # Server entry point
│   ├── uploads/             # File uploads directory
│   ├── package.json
│   └── tsconfig.json
├── docs/                     # Project documentation
│   ├── wireframes.md
│   ├── data-flow-diagrams.md
│   ├── database-schema.md
│   └── requirements-links.md
└── README.md
```

### 6.2 File Naming Conventions

- **Components:** PascalCase (e.g., `AuthModal.tsx`, `PaymentModal.tsx`)
- **Pages:** PascalCase (e.g., `Profile.tsx`, `CreateProject.tsx`)
- **Utilities/Services:** camelCase (e.g., `api.ts`, `utils.ts`)
- **Models:** PascalCase (e.g., `User.ts`, `Project.ts`)
- **Routes:** camelCase (e.g., `auth.ts`, `routes.ts`)
- **CSS Files:** PascalCase matching component (e.g., `App.css`)

### 6.3 Accessibility Standards

- **WCAG 2.1 Level AA Compliance:**
  - All images have alt text
  - Form inputs have associated labels
  - Color contrast ratio meets 4.5:1 for text
  - Keyboard navigation support for all interactive elements
  - Focus indicators visible
  - ARIA labels where appropriate
  - Semantic HTML elements (header, nav, main, footer)

- **Implementation:**
  - Use semantic HTML5 elements
  - Add `aria-label` attributes for icon-only buttons
  - Ensure form validation messages are accessible
  - Test with screen readers (NVDA, JAWS)
  - Keyboard-only navigation testing

### 6.4 Responsiveness Requirements

- **Breakpoints:**
  - Mobile: 320px - 768px
  - Tablet: 769px - 1024px
  - Desktop: 1025px+

- **Mobile-First Approach:**
  - Base styles for mobile
  - Progressive enhancement for larger screens
  - Touch-friendly button sizes (minimum 44x44px)
  - Readable font sizes (minimum 16px)

- **Responsive Components:**
  - Navigation menu collapses to hamburger menu on mobile
  - Tables become cards on mobile
  - Forms stack vertically on mobile
  - Images scale proportionally

### 6.5 GitHub Repository

**Repository Structure:**
- Main branch: `main`
- Development branch: `develop`
- Feature branches: `feature/[feature-name]`

**Commit Messages:**
- Format: `[type]: [description]`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Repository Link:** [Add your GitHub repository URL here]

---

## 7. Schedule

See **Timeline Sheet** document for detailed 7-week schedule with weekly milestones and deliverables.

**Summary:**
- Week 1: Project setup, auth foundation, health endpoint, docs
- Week 2: Profiles, project posting, search, basic proposals
- Week 3: Proposal mgmt, messaging, file upload, project dashboard
- Week 4: Time tracking, payments (Stripe), reviews, admin dashboard
- Week 5: Notifications, advanced search, testing, UI polish
- Week 6: Performance, final testing, docs, deployment prep
- Week 7: Final polish, UAT, go-live, presentation

**Total Estimated Hours:** 219 hours  
**Weekly Commitment:** 30 hours/week  
**Duration:** 7 weeks (210 hours available, 9 hours buffer)

---

## 8. Conclusion

FreelanceHub is a comprehensive full-stack freelance marketplace platform designed to connect clients with skilled freelancers. This requirements document outlines 35 user stories (27 Must Have, 5 Should Have, 3 Nice to Have) with detailed task breakdowns totaling 219 hours of development work, designed to fit within a 7-week timeline.

The project leverages modern web technologies including React, TypeScript, Node.js, Express, and MongoDB Atlas, with Stripe integration for secure payment processing. The application follows accessibility standards (WCAG 2.1 Level AA) and responsive design principles to ensure a professional user experience across all devices.

This document serves as the comprehensive roadmap for the project, with each user story broken down into specific tasks with time estimates. Upon completion of all Must Have user stories, the application will deliver a fully functional MVP that meets all core requirements for a freelance marketplace platform.

---

**Document Prepared By:** Dhruv Chavda  
**Date:** [Current Date]  
**Version:** 1.0

