# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Database Testing
- Test database connection via `/api/test-db` endpoint

## Architecture

This is a Next.js 14 SaaS application using the App Router with authentication and database integration.

### Authentication System
- **NextAuth.js** with email-only authentication (no OAuth providers)
- Custom email verification via **Resend** email service
- Dual database setup: MongoDB adapter for NextAuth sessions + custom Mongoose models
- Session callbacks sync users between NextAuth and custom User model
- Protected routes use `getServerSession()` with redirects to `/auth/signin`

### Database Architecture
- **Dual MongoDB setup**:
  - Native MongoDB client (`libs/mongo.js`) for NextAuth adapter
  - Mongoose (`libs/mongoose.js`) for application models
- **Models**:
  - `User`: Contains name, email, image, boards array (refs to Board)
  - `Board`: Contains userId (ref to User), name, description, category
- **Connection handling**: Both connections check existing connections to prevent multiple instances

### API Routes
- `POST /api/board` - Create new board (authenticated)
- Session-based authentication required for board operations
- Comprehensive error handling with timeout management and specific error messages

### Frontend Structure
- **App Router** with TypeScript/JavaScript mixed codebase
- **Styling**: Tailwind CSS + DaisyUI component library with light/dark/valentine themes
- **Components**: Mix of client and server components
- **Dashboard**: Server component that fetches user boards via Mongoose populate

### Key Environment Variables
- `MONGODB_URI` - MongoDB connection string
- `NEXTAUTH_SECRET` - NextAuth session secret
- `RESEND_API_KEY` - Email service API key

### Development Patterns
- Server components for data fetching with error boundaries
- Client components for forms and interactive elements
- Axios for client-side API calls with error handling
- Form validation on both client and server
- Database operations include timeout handling and connection verification
- always put ' console log' everywhere so we can easlily debug.