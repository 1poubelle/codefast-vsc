# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Local Stripe Testing
- `stripe listen --forward-to localhost:3000/api/stripe-webhooks` - Forward webhooks to local server
- `stripe trigger checkout.session.completed --add checkout_session:client_reference_id=USER_ID` - Test webhook events

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

### Payment & Billing System
- **Stripe Integration**: Complete subscription management with test and production environments
- **Webhook Handling**: Dual approach for reliability:
  - **Primary**: Real Stripe webhooks (production and localhost with CLI forwarding)
  - **Fallback**: Success page automatic access grant (works everywhere)
- **Events Processed**:
  - `checkout.session.completed` - Grants user access after successful payment
  - `customer.subscription.updated` - Updates access based on subscription status
  - `customer.subscription.deleted` - Revokes access when subscription canceled
- **Local Development**: Uses Stripe CLI for webhook forwarding to localhost
- **Production**: Real webhooks via public URL (https://imran.club/api/stripe-webhooks)

### Database Architecture
- **Dual MongoDB setup**:
  - Native MongoDB client (`libs/mongo.js`) for NextAuth adapter
  - Mongoose (`libs/mongoose.js`) for application models
- **Models**:
  - `User`: Contains name, email, image, hasAccess (boolean), customerId (Stripe), boards array (refs to Board)
  - `Board`: Contains userId (ref to User), name, description, category (enum: feedback, feature, bug, improvement, question)
- **Connection handling**: Both connections check existing connections to prevent multiple instances

### API Routes

#### Authentication
- `POST /api/auth/signin/email` - Send magic link for email authentication
- `GET /api/auth/callback/email` - Handle email authentication callback
- `GET /api/auth/[...nextauth]` - NextAuth.js dynamic routes

#### Board Management
- `POST /api/board` - Create new board (authenticated)

#### Payment & Billing
- `POST /api/billing/create-checkout-session` - Create Stripe checkout session
- `POST /api/billing/customer-portal` - Access Stripe customer portal (authenticated)
- `POST /api/stripe-webhooks` - Handle Stripe webhook events (validates webhook signature)

#### Testing & Development
- `GET/POST /api/test-db` - Test database connection

#### Security & Authentication
- Session-based authentication required for board and billing operations
- Comprehensive error handling with timeout management and specific error messages
- Webhook signature verification for Stripe endpoints

### Frontend Structure
- **App Router** with TypeScript/JavaScript mixed codebase
- **Styling**: Tailwind CSS + DaisyUI component library with light/dark/valentine themes
- **Components**: Mix of client and server components
- **Dashboard**: Server component that fetches user boards via Mongoose populate

#### Pages & Routes
- `/` - Landing page (public)
- `/auth/signin` - Email authentication page
- `/dashboard` - User dashboard with boards (authenticated)
- `/dashboard/b/[boardId]` - Individual board view (authenticated)
- `/b/[boardId]` - Public board view
- `/success` - Payment success page with automatic access grant fallback

#### Key Components
- `ButtonCheckout` - Initiates Stripe checkout flow
- `ButtonPortal` - Access to Stripe customer portal
- `ButtonLogin/ButtonLogout` - Authentication controls
- `FormNewBoard` - Board creation form with validation
- `CardBoardLink` - Board preview cards
- `ButtonDeleteBoard` - Board deletion with confirmation
- `FAQListItems` - FAQ component for landing page

### Key Environment Variables

#### Required for All Environments
- `MONGODB_URI` - MongoDB connection string
- `NEXTAUTH_SECRET` - NextAuth session secret (generate with openssl rand -base64 32)
- `RESEND_API_KEY` - Email service API key for magic links

#### Stripe Configuration
- `STRIPE_API_KEY` - Stripe secret key (sk_test_ for development, sk_live_ for production)
- `STRIPE_PRICE_ID` - Stripe price/product ID for subscriptions
- `STRIPE_WEBHOOK_SECRET` - Webhook signing secret (different for localhost vs production)

#### Environment-Specific
- `NEXTAUTH_URL` - Application URL (http://localhost:3000 for dev, https://imran.club for production)

### Development Patterns
- Server components for data fetching with error boundaries
- Client components for forms and interactive elements
- Axios for client-side API calls with error handling
- Form validation on both client and server
- Database operations include timeout handling and connection verification
- Always put console logs everywhere for easy debugging
- Use `react-hot-toast` for user notifications (toast.success, toast.error)
- Never use alert() - always use toast for user feedback
- All components must be fully responsive using Tailwind CSS classes
- Use Heroicons for consistent iconography
- Always use `truncate` className with URLs for better display

### Key Dependencies & Tools
- **Next.js 14** - App Router framework
- **NextAuth.js 4** - Authentication with email-only provider
- **Mongoose** - MongoDB object modeling
- **Stripe** - Payment processing and subscriptions
- **Tailwind CSS + DaisyUI** - Styling framework
- **Axios** - HTTP client for API calls
- **React Hot Toast** - User notifications
- **Heroicons** - Icon library
- **Resend** - Email service for magic links
- **TypeScript** - Mixed TypeScript/JavaScript codebase

### Local Development Setup

#### Prerequisites
1. Node.js and npm installed
2. MongoDB database (local or cloud)
3. Stripe account with test keys
4. Resend account for email service
5. Stripe CLI for local webhook testing

#### Setup Steps
1. Clone repository and run `npm install`
2. Copy `.env.local.example` to `.env.local` and configure variables
3. Set up Stripe webhook endpoint in dashboard
4. Start development server: `npm run dev`
5. For payment testing: `stripe listen --forward-to localhost:3000/api/stripe-webhooks`

#### Testing Payment Flow
1. Use Stripe test card: `4242 4242 4242 4242`
2. Any future expiry date and CVC
3. Webhook events are forwarded via Stripe CLI
4. Success page provides fallback access grant if webhooks fail

## Troubleshooting

### Payment Issues
- **Access not granted after payment**: Check webhook logs and ensure Stripe CLI is running
- **Webhook signature errors**: Verify STRIPE_WEBHOOK_SECRET matches Stripe CLI output
- **Payment redirects to wrong URL**: Check NEXTAUTH_URL in environment variables

### Database Connection Issues
- **Connection timeouts**: Check MONGODB_URI format and network connectivity
- **User not found errors**: Verify NextAuth session callback is syncing users properly
- **Duplicate connection warnings**: Normal behavior due to dual MongoDB setup

### Development Environment
- **Port conflicts**: Next.js will auto-increment port if 3000 is busy
- **Hot reload issues**: Clear .next directory and restart dev server
- **Build failures**: Run `npm run lint` to check for code issues

# Important Instructions Reminders
- Do what has been asked; nothing more, nothing less
- NEVER create files unless absolutely necessary for achieving the goal
- ALWAYS prefer editing existing files to creating new ones
- NEVER proactively create documentation files unless explicitly requested
- Always put maximum comments in code for easy understanding
- Always use console.log for debugging (never comment them out)
- Always use dependencies when needed - keep them in mind when looking for solutions

# Automatic updates: 
On every significant project change, automatically analyze all files to identify new features, API modifications, dependencies, or important fixes, then systematically update this claude.md file while maintaining its existing structure and adding/modifying necessary sections to reflect the current codebase state - always execute this update during important modifications and provide a summary of changes made.