Overview
This project is a comprehensive College Management System designed to streamline the academic and administrative processes for students, teachers, and administrators. It provides a secure, role-based platform for student applications, registration payments, course management, grade entry, and administrative oversight.

The application is built with a modern web stack, leveraging the power of Next.js for a fast and dynamic frontend, Clerk for robust authentication and user management, and Convex as a real-time database and serverless backend.

Key Features
The system offers distinct functionalities tailored to each user role:

🎓 Student Dashboard
Secure Registration & Login: Students can register and log in securely using Clerk.

Online Application Form: Submit detailed academic and personal information.

Registration Fee Payment  (Future): Integrated payment gateway for secure online transactions.

Application & Admission Status Tracking: View real-time updates on their application and admission decision.

Personalized Profile: Manage their credentials and view personal information.

Course Enrollment: Ability to view enrolled courses and academic progress.

👩‍🏫 Teacher Dashboard
Dedicated Login: Teachers access their specialized dashboard through secure authentication.

Assigned Student Overview: View a list of students assigned to them.

Mark Entry & Management: Easily input and update student marks for assigned courses.

Course Management (Future): View courses they are assigned to teach.

👑 Admin Dashboard
Full System Control: Comprehensive access to manage all aspects of the college system.

User Management: View, add, edit, and manage student and teacher accounts, including role assignment.

Admission Management: Review student applications, make admission decisions (admit/reject), and assign matriculation numbers.

Course Management: Create, update, and delete courses; assign teachers to courses.

Program Management: Create, update, and delete academic programs.

Payment Tracking: Monitor all registration and tuition fee transactions.

Report Generation (PDF): Generate and download various reports (e.g., student lists, grade reports).

🔒 Authentication & Authorization
Clerk Integration: Handles user sign-up, sign-in, and session management.

Role-Based Access Control: Middleware and Convex queries ensure users can only access features and data permitted by their admin, teacher, or student role.

Secure Webhooks: Clerk webhooks automatically sync user data and assign default roles (e.g., "student") to Convex upon registration.

Tech Stack
Frontend Framework: Next.js (React, TypeScript, App Router)

Database & Backend: Convex (Real-time, Serverless Functions - Queries, Mutations, Actions)

Authentication: Clerk (User Management, Authentication, Webhooks)

UI Components: Material-UI (MUI)

Styling: Tailwind CSS

Animations: Framer Motion

PDF Generation: jsPDF & jspdf-autotable

Webhook Verification: Svix

Notifications: React Hot Toast

Getting Started
Follow these steps to get your development environment set up.

Prerequisites
Node.js (v18.x or higher recommended)

npm (v9.x or higher) or Yarn (v1.x or higher)

Git

Installation
Clone the repository:

git clone <your-repo-url>
cd my-college-website

Install dependencies:

npm install
# or
yarn install

Environment Variables
Create a .env.local file in the root of your project and add the following:

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_YOUR_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY=sk_live_YOUR_CLERK_SECRET_KEY
CLERK_ISSUER_URL=https://clerk.your-domain.com # From Clerk JWT Templates -> Default -> Issuer

# Convex
NEXT_PUBLIC_CONVEX_URL=https://<your-convex-deployment-url>.convex.cloud # From Convex Dashboard

# Webhooks (for Clerk to Convex sync)
WEBHOOK_SECRET=whsec_YOUR_CLERK_WEBHOOK_SECRET # From Clerk Dashboard -> Webhooks

# Payment Gateway (Example: Paystack)
PAYSTACK_SECRET_KEY=sk_test_YOUR_PAYSTACK_SECRET_KEY # Store in Convex Secrets too!
NEXT_PUBLIC_BASE_URL=http://localhost:3000 # Your app's base URL (important for payment callbacks)

Convex Setup
Initialize Convex (if not already done):

npx convex init

Deploy your Convex Schema and Functions:
Start the Convex development server, which automatically deploys changes:

npx convex dev

Add Convex Environment Secrets:
Go to your Convex Dashboard -> Settings -> Environment Variables. Add your CLERK_SECRET_KEY and PAYSTACK_SECRET_KEY here. These are accessible in Convex Actions.

Clerk Setup
Create Clerk Application:
Sign up at Clerk.com and create a new application. Get your API keys.

Configure JWT Templates:
In your Clerk Dashboard, go to JWT Templates -> default template. Copy the "Issuer" URL and add it to your .env.local as CLERK_ISSUER_URL.

Set up Clerk Webhook:

Go to Webhooks in your Clerk Dashboard.

Add a new endpoint.

Endpoint URL: During development, use a tool like ngrok to expose your local API route publicly:

npx ngrok http 3000 # Your Next.js app port

Then, set the URL to https://<your-ngrok-url>/api/clerk-webhook.
For production, it will be https://your-app-domain.com/api/clerk-webhook.

Events to Subscribe: Select User -> user.created.

Copy the generated Webhook Secret and add it to your .env.local as WEBHOOK_SECRET. This is crucial for securing your webhook.

Running the Project
To start the development server:

npm run dev
# or
yarn dev

The application will be accessible at http://localhost:3000.

Deployment
This project is ideally suited for deployment on Vercel for Next.js, as it handles serverless functions, environment variables, and continuous deployment seamlessly.

Vercel: Connect your GitHub repository to Vercel. Ensure all environment variables from .env.local are set in Vercel's project settings.

Convex: Your Convex backend is automatically deployed when you run npx convex deploy or npx convex dev.

Clerk: Clerk is a hosted service; no separate deployment steps are needed after initial configuration.

Project Structure (High-Level)
.
├── app/                  # Next.js App Router root
│   ├── (dashboard)/      # Grouped routes for admin, teacher, student dashboards
│   │   ├── admin/
│   │   ├── student/
│   │   └── teacher/
│   ├── api/              # Next.js API Routes (e.g., Clerk Webhook)
│   ├── auth/             # Clerk's default auth pages (sign-in, sign-up)
│   ├── user-profile/     # Custom Clerk UserProfile page
│   ├── layout.tsx        # Root layout with Clerk, Convex, MUI Providers
│   └── globals.css       # Global CSS with Tailwind directives
├── components/           # Reusable React components (e.g., Navbar, CourseForm)
├── convex/               # Convex backend functions and schema
│   ├── _generated/       # Auto-generated Convex client API types
│   ├── auth.config.ts    # Clerk authentication configuration for Convex
│   ├── admin.ts          # Admin-specific queries/mutations (users, courses, programs, admissions)
│   ├── users.ts          # User-related queries/mutations (e.g., createOrUpdateUser, getCurrentUser)
│   ├── students.ts       # Student application & status mutations/queries
│   ├── teachers.ts       # Teacher-specific queries (e.g., getTeacherStudents)
│   ├── payments.ts       # Payment initiation and webhook handling
│   ├── files.ts          # File upload mutations (for PDFs)
│   ├── generatedPdfReports.ts # PDF report metadata storage
│   └── schema.ts         # Database schema definitions
├── context/              # React Context API for global state (e.g., AppContext for user role)
├── lib/                  # Utility functions, constants (e.g., routes.ts)
├── public/               # Static assets (images, fonts)
├── src/                  # (Optional, if you use a 'src' directory)
│   └── theme.ts          # MUI custom theme definitions
├── .env.local            # Environment variables (local development)
├── middleware.ts         # Next.js/Clerk middleware for route protection
├── next.config.js        # Next.js configuration (e.g., image domains)
├── package.json          # Project dependencies and scripts
├── postcss.config.js     # PostCSS configuration for Tailwind CSS
└── tailwind.config.js    # Tailwind CSS custom theme configuration

Future Enhancements
Course Enrollment: Allow students to enroll in available courses.

Student Timetable: Display personalized timetables for students and teachers.

Notifications: Implement in-app or email notifications for admission updates, new marks, etc.

Messaging System: Basic internal messaging between students, teachers, and admin.

Advanced Reporting: More detailed and customizable reports for administrators.

Attendance Tracking: System for teachers to record student attendance.

Tuition Fee Management: Comprehensive system for managing and paying tuition fees.

Student Result Slip Generation: Generate printable result slips for students.

License
This project is licensed under the MIT License.
