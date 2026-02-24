# AgriFrontend - Frontend Documentation

## Project Overview

AgriFrontend is a React + TypeScript + Vite-based web application for an agricultural and professional services platform. It provides a modern, responsive UI for users to connect, communicate, share content, and access professional services.

## Tech Stack

- **Framework**: React 18.3
- **Language**: TypeScript
- **Build Tool**: Vite
- **State Management**: Redux Toolkit
- **Routing**: React Router v6
- **UI Framework**: Tailwind CSS
- **Real-time**: Socket.IO Client
- **Maps**: Leaflet & React-Leaflet
- **Animations**: Framer Motion, GSAP
- **HTTP Client**: Axios
- **Icons**: Lucide React, React Icons
- **Date Picker**: React DatePicker
- **QR Code**: QRCode.react
- **Audio**: use-sound
- **Carousel**: Swiper

## Project Structure

```
src/
├── components/          # Reusable React components
├── pages/              # Page/Route components
├── ecommerce/          # E-commerce specific modules
├── config/             # API configuration
├── hooks/              # Custom React hooks
├── services/           # API services & utilities
├── store/              # Redux store & slices
├── styles/             # CSS & styling
├── types/              # TypeScript type definitions
├── utils/              # Helper utilities
└── public/             # Static assets
```

## Features Status

### ✅ COMPLETED FEATURES

#### 1. **Authentication Pages**
- ✅ Login page with email/password
- ✅ Sign up page with form validation
- ✅ Google OAuth integration
- ✅ Email verification page
- ✅ "Remember me" functionality
- ✅ Password validation rules display
- ✅ Form error handling

#### 2. **Landing & Home Pages**
- ✅ Landing page with hero section
- ✅ Feature showcases
- ✅ Team section
- ✅ Solutions section
- ✅ Popular professionals showcase
- ✅ Supply chain/consultation flow visualization
- ✅ Call-to-action sections

#### 3. **Feed/Social Features**
- ✅ Post creation modal
- ✅ Post feed display
- ✅ Like/Unlike posts
- ✅ Comment functionality (UI)
- ✅ Post deletion
- ✅ User feed filtering
- ✅ Post cards with media

#### 4. **Messaging & Chat**
- ✅ Conversation list
- ✅ Real-time message display
- ✅ Message input and sending
- ✅ Online status indicators
- ✅ User presence tracking
- ✅ Conversation search
- ✅ Message timestamps

#### 5. **User Profile**
- ✅ Profile information display
- ✅ Edit profile modal
- ✅ Profile picture upload
- ✅ Bio/About section
- ✅ Professional details display
- ✅ Education history display
- ✅ Experience history display
- ✅ Verification badge display

#### 6. **Contacts/Connections**
- ✅ Contacts list view
- ✅ Search contacts
- ✅ Connection request buttons
- ✅ Accept/Decline connections
- ✅ User connection status display
- ✅ Filter by professional type

#### 7. **Product Marketplace**
- ✅ Product listing page
- ✅ Product grid/list view
- ✅ Product detail page with QR code
- ✅ Product search
- ✅ Product filtering
- ✅ Product cart page
- ✅ Add to cart functionality
- ✅ Product categories

#### 8. **Farmer Dashboard**
- ✅ Farmer product lifecycle page
- ✅ Upload product functionality
- ✅ My products section
- ✅ Product management
- ✅ Farmer-specific dashboard

#### 9. **Professional Profiles**
- ✅ Lawyer profile page
- ✅ Professional details display
- ✅ Ratings display
- ✅ Specialization display
- ✅ Connect button

#### 10. **Call Interface**
- ✅ Call controls component
- ✅ Call example page
- ✅ Outgoing call modal
- ✅ Call interface UI
- ✅ Mute/unmute controls
- ✅ Speaker controls
- ✅ End call button
- ✅ Call status display

#### 11. **Navigation**
- ✅ Main navbar with responsive menu
- ✅ Secondary navbar variant
- ✅ Mobile-friendly menu
- ✅ User authentication status in nav
- ✅ Navigation links organized

#### 12. **Admin Dashboard**
- ✅ Admin dashboard page
- ✅ User management section
- ✅ Content moderation section
- ✅ Analytics overview
- ✅ Admin controls UI

#### 13. **UI Components**
- ✅ Custom date picker
- ✅ Custom select dropdown
- ✅ Confirmation modal
- ✅ Toast/Notification system
- ✅ Education modal
- ✅ Experience modal
- ✅ Professional details modal
- ✅ Group create modal
- ✅ Loading states
- ✅ Error boundaries

#### 14. **General Features**
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Tailwind CSS styling
- ✅ Dark mode support (partial)
- ✅ Form validation
- ✅ Error handling
- ✅ Loading indicators

---

### 🔄 HALF-COMPLETED / IN-PROGRESS FEATURES

#### 1. **API Integration Status**
- ✅ API configuration file created (`src/config/api.ts`)
- ✅ Cloud.tsx migrated to use centralized API
- 🔄 **IN PROGRESS**: Other components still have hardcoded URLs
  - Feed.tsx (11 hardcoded URLs)
  - Messages.tsx (9 hardcoded URLs)
  - ProfileInfo.tsx (8 hardcoded URLs)
  - Contacts.tsx (5 hardcoded URLs)
  - LawyerProfile.tsx (3 hardcoded URLs)
  - And 5+ more files with 1-2 hardcoded URLs each

#### 2. **Call Features**
- ✅ UI/UX for call interface
- ✅ Call controls component
- ✅ Call modals
- ❌ WebRTC integration not implemented
- ❌ Actual video/audio streaming
- ❌ Call quality metrics display

#### 3. **Payment/Premium Features**
- ✅ GetPremium page created
- ❌ Premium tier options not fully designed
- ❌ Payment integration incomplete
- ❌ Subscription management UI

#### 4. **Real-time Features**
- ✅ Socket.IO client configured
- ❌ Socket integration incomplete in some components
- ❌ Real-time notifications not fully implemented
- ❌ Presence indicators inconsistent

#### 5. **Form Completeness**
- ✅ Create case modal exists
- ❌ Form submission not fully integrated
- ❌ Form validation incomplete
- ❌ Case management workflow

#### 6. **E-commerce Module**
- ✅ Routes created
- ✅ Product pages exist
- ❌ Shopping cart logic incomplete
- ❌ Checkout process not implemented
- ❌ Order history/tracking

---

### ❌ NOT STARTED / TODO FEATURES

#### 1. **Complete API Migration**
- Migrate all components to use centralized API configuration
- Update hardcoded URLs in:
  - Feed.tsx
  - Messages.tsx
  - ProfileInfo.tsx
  - Contacts.tsx
  - LawyerProfile.tsx
  - Login.tsx
  - SignUp.tsx
  - Home.tsx
  - Navbar.tsx
  - And other files

#### 2. **WebRTC/Video Calling**
- WebRTC implementation
- Video stream handling
- Audio stream handling
- Peer connection management
- SDP offer/answer exchange
- ICE candidate handling

#### 3. **Advanced Search**
- Full-text search UI
- Advanced filters (location, ratings, specialization)
- Search history
- Saved searches
- Real-time search suggestions

#### 4. **Notifications System**
- Push notification UI
- In-app notification center
- Notification preferences settings
- Notification history
- Email notification settings

#### 5. **User Settings & Preferences**
- Account settings page
- Privacy settings
- Notification preferences
- Theme preferences
- Language preferences

#### 6. **Analytics Dashboard**
- User activity analytics
- Post engagement metrics
- Connection analytics
- Product sales analytics
- Revenue tracking

#### 7. **Content Moderation UI**
- Report modal
- Flagging interface
- Moderation dashboard
- Content approval workflow

#### 8. **Group Chat**
- Group chat creation UI
- Group member management
- Group settings
- Group notifications
- Group file sharing

#### 9. **Advanced Product Features**
- Product comparison
- Wishlist functionality
- Product reviews
- Product ratings
- Inventory management UI

#### 10. **Subscription Management**
- Subscription tier selection
- Billing history
- Payment method management
- Invoice download
- Subscription cancellation flow

#### 11. **Professional Verification**
- Verification status display
- Document upload UI
- Verification progress tracker
- Verification requirements checklist

#### 12. **Email Verification & Management**
- Email verification step-by-step UI
- Resend verification email option
- Email change interface
- Email confirmation

#### 13. **Performance Optimization**
- Code splitting & lazy loading
- Image optimization
- Bundle size reduction
- Caching strategies
- PWA implementation

#### 14. **Testing & QA**
- Unit tests
- Integration tests
- E2E tests
- Component tests
- Performance testing

#### 15. **Documentation**
- Component documentation
- API usage guide (UPDATE IN PROGRESS)
- User guides
- Developer setup guide
- Contribution guidelines

#### 16. **Accessibility**
- ARIA labels
- Keyboard navigation
- Screen reader support
- Color contrast improvements
- Form labels and descriptions

#### 17. **SEO & Meta Tags**
- Meta tags management
- Open Graph tags
- Twitter cards
- Schema markup
- Sitemap generation

---

## API Configuration Status

### Current Setup
The project has a centralized API configuration system:

**Location**: `src/config/api.ts`

**Features**:
- Environment-based URL configuration via `.env`
- Typed endpoint helpers
- Central control point for all API URLs

### Environment Configuration
Create `.env` file:
```env
VITE_API_BASE_URL=http://localhost:5000
```

### Files Completed with API Migration
- ✅ Cloud.tsx - Successfully migrated

### Files Needing API Migration
Priority order:
1. Feed.tsx (11 URLs)
2. Messages.tsx (9 URLs)
3. ProfileInfo.tsx (8 URLs)
4. Contacts.tsx (5 URLs)
5. LawyerProfile.tsx (3 URLs)
6. Login.tsx (1 URL)
7. SignUp.tsx (1 URL)
8. Home.tsx (1 URL)
9. Navbar.tsx (1 URL)

---

## Installation & Setup

### Prerequisites
- Node.js (v16+)
- npm or yarn
- Backend API running on localhost:5000

### Installation Steps

```bash
# Install dependencies
npm install

# Create .env file
# Copy the content from .env.example
cp .env.example .env

# Update .env with your API URL
VITE_API_BASE_URL=http://localhost:5000

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

---

## Pages Overview

| Page | Route | Status | Auth Required |
|------|-------|--------|----------------|
| Login | `/login` | ✅ Complete | No |
| Sign Up | `/signup` | ✅ Complete | No |
| Email Verification | `/verify-email` | ✅ Complete | No |
| Landing | `/` | ✅ Complete | No |
| Home | `/home` | ✅ Complete | Yes |
| Feed | `/feed` | 🔄 Partial | Yes |
| Messages | `/messages` | 🔄 Partial | Yes |
| Contacts | `/contacts` | 🔄 Partial | Yes |
| Profile | `/profile` | ✅ Complete | Yes |
| Profile Info | `/profile-info` | 🔄 Partial | Yes |
| Lawyer Profile | `/lawyer/:id` | 🔄 Partial | Yes |
| Products | `/ecommerce/shop` | 🔄 Partial | No |
| Product Details | `/ecommerce/product/:id` | ✅ Complete | No |
| Product Cart | `/product-cart` | ✅ Complete | Yes |
| Farmer Products | `/farmer-products` | ✅ Complete | Yes |
| Get Premium | `/premium` | 🔄 Partial | Yes |
| Admin Dashboard | `/admin` | ✅ Complete | Yes (Admin) |

---

## Component Architecture

### Layout Components
- Navbar - Main navigation
- Navbar1 - Alternative navigation
- Footer - Footer section
- ToastProvider - Notification system

### Reusable Components
- CustomSelect - Dropdown select
- CustomDatePicker - Date picker
- ConfirmationModal - Confirmation dialog
- Notification - Toast notification
- ExperienceModal - Experience editor
- EducationModal - Education editor
- ProfessionalModal - Professional details editor

### Feature Components
- CreatePostModal - Create post
- CallControls - Call control buttons
- OutgoingCallModal - Outgoing call UI
- CallInterface - Video call interface
- GroupCreateModal - Group chat creation

---

## Key Features Implementation Notes

### Real-time Communication
- Socket.IO client configured at `src/services/socketService.ts`
- Used in Messages and Call components
- Online status tracking implemented

### State Management
- Redux store for global state
- Redux Toolkit for slice creation
- Used for authentication state and user data

### Routing Protection
- Protected routes check authentication token
- Automatic redirect to login for unauthenticated users
- Public routes redirect authenticated users to home

### Form Handling
- React Hook Form for complex forms (if used)
- Controlled components for standard inputs
- Validation feedback

---

## Development Notes

### Known Issues
1. Hardcoded API URLs in multiple components
2. WebRTC not integrated for actual calls
3. Some real-time features incomplete
4. Group chat backend not fully implemented
5. E-commerce checkout incomplete

### Priority TODOs
1. **HIGH**: Complete API URL migration across all components
2. **HIGH**: WebRTC integration for calling
3. **MEDIUM**: Complete e-commerce checkout flow
4. **MEDIUM**: Implement real-time notifications
5. **MEDIUM**: Payment integration UI
6. **LOW**: Performance optimization
7. **LOW**: Add comprehensive tests

### Performance Considerations
- Large image optimization needed
- Component lazy loading recommended
- Redux devtools for development
- React DevTools profiler

---

## Testing

Currently no automated tests. Recommended setup:
- Jest for unit tests
- React Testing Library for component tests
- Cypress for E2E tests

---

## Deployment

### Build Process
```bash
npm run build
```

### Deployment Targets
- **Vercel** - Already configured (vercel.json exists)
- **Netlify** - Supported
- **Traditional Server** - Build and serve from /dist

### Production Checklist
- [ ] Update VITE_API_BASE_URL to production API
- [ ] Enable compression
- [ ] Setup CDN for static assets
- [ ] Configure CORS properly
- [ ] Setup monitoring/error tracking
- [ ] Configure CI/CD pipeline

---

## Git Workflow

The project uses standard git branching. Check `vercel.json` for deployment rules.

---

## Contact & Support

For issues, bugs, or feature requests, please create an issue in the project repository.

