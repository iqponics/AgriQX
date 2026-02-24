# AgriBackend - Backend Documentation

## Project Overview

AgriBackend is a Node.js/Express-based API backend for an agricultural and professional services platform. It provides services for user management, social networking, professional consultations, product marketplace, and real-time communication.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Real-time Communication**: Socket.IO
- **Authentication**: JWT + Google OAuth 2.0
- **Payment Gateway**: Razorpay
- **File Storage**: Cloudinary
- **Email Service**: Nodemailer
- **Security**: Helmet, CORS, Bcrypt

## Project Structure

```
src/
├── config/          # Configuration files (Database, Auth, Cloudinary, Passport)
├── controllers/     # Business logic for all routes
├── middlewares/     # Authentication and authorization middleware
├── models/          # MongoDB schemas
├── repositories/    # Data access layer
├── routes/          # API route definitions
├── services/        # Business services
├── sockets/         # Real-time communication handlers
└── utils/           # Helper utilities
```

---

## Features Status

### ✅ COMPLETED FEATURES

#### 1. **Authentication & Authorization**
- User registration with email verification
- Login/Logout functionality
- JWT token-based authentication
- Google OAuth 2.0 integration (Sign up/Sign in with Google)
- Password hashing with bcrypt
- Token refresh mechanism
- Admin role management

#### 2. **User Management**
- User profile creation and updates
- Search users and professionals (Astrologers, Lawyers)
- User connections (request, accept, decline, delete)
- User ratings and reviews
- Contact list management
- Professional verification documents
- Experience and Education management
- Professional certifications storage

#### 3. **Social Feed**
- Create posts (text, media)
- View feed (personal and others)
- Like/Unlike posts
- Comment on posts
- Delete posts
- Post search functionality

#### 4. **Real-time Messaging**
- One-to-one conversations
- Real-time message delivery via Socket.IO
- Message history retrieval
- Conversation management
- Online status tracking

#### 5. **Real-time Calling**
- Initiate voice/video calls
- Call history tracking
- Active call detection
- Call status management (initiated, ongoing, ended)
- Call duration tracking
- Conversation-based calls

#### 6. **Product Marketplace**
- Create products (Farmer-only)
- Product listing with images (Cloudinary integration)
- Product search and filtering
- QR code support for products
- Product updates and deletion
- My Products section for farmers

#### 7. **Payment System**
- Razorpay integration
- Order creation
- Payment verification
- Payment history tracking
- Transaction logging

#### 8. **File Management**
- File upload to Cloudinary
- Multiple file format support
- File metadata storage
- File retrieval and deletion

#### 9. **Professional Forms**
- Astrologer registration form
- Lawyer registration form
- Form submission and validation

#### 10. **Admin Panel**
- Admin role assignment
- User management capabilities
- Content moderation
- Role migration utilities

#### 11. **Real-time Features**
- Socket.IO integration
- User presence/status tracking
- Real-time notifications (chat, calls)
- User activity logging

---

### 🔄 HALF-COMPLETED / IN-PROGRESS FEATURES

#### 1. **Professional Verification System**
- ✅ Document storage structure
- ✅ Verification fields in User model
- ❌ Verification workflow (manual review process not implemented)
- ❌ Admin approval/rejection mechanism
- ❌ Verification status updates

#### 2. **Complete Call Features**
- ✅ Call logging and history
- ✅ Basic call management
- ❌ WebRTC integration for actual audio/video
- ❌ Call recording functionality
- ❌ Call analytics and quality metrics
- ❌ Call transfer/conference features

#### 3. **Rating & Review System**
- ✅ Rating model structure
- ✅ Rating endpoints
- ❌ Review text/comments
- ❌ Rating filtering and sorting
- ❌ Rating moderation

#### 4. **Group Messaging**
- ✅ Conversation model supports group concept
- ✅ Frontend UI components created
- ❌ Backend group chat implementation incomplete
- ❌ Group member management
- ❌ Group permissions

#### 5. **Email Notifications**
- ✅ Nodemailer configured
- ✅ Email utility created
- ❌ Automated email triggers (order confirmation, call reminders)
- ❌ Email templates
- ❌ Email queue system

---

### ❌ NOT STARTED / TODO FEATURES

#### 1. **Advanced Search & Filtering**
- Full-text search for posts, products, users
- Advanced filtering by location, ratings, specialization
- Search history
- Saved searches

#### 2. **Notification System**
- Push notifications
- In-app notifications
- Notification preferences
- Notification history

#### 3. **Subscription/Premium Features**
- Premium subscription tiers
- Feature access control based on subscription
- Subscription management (upgrade, downgrade, cancel)
- Billing cycle management

#### 4. **Location-based Services**
- Geolocation features
- Nearby professionals finder
- Location-based search
- Map integration

#### 5. **Analytics & Reporting**
- User activity analytics
- Transaction reports
- Platform usage statistics
- User engagement metrics

#### 6. **Advanced Payment Features**
- Multiple payment gateways (Stripe, PayPal)
- Subscription billing
- Refund processing
- Invoice generation

#### 7. **Security Features**
- Two-factor authentication (2FA)
- Rate limiting
- DDoS protection
- Data encryption at rest
- API key management

#### 8. **Logging & Monitoring**
- Centralized logging system
- Error tracking
- Performance monitoring
- API usage metrics

#### 9. **Content Moderation**
- Spam detection
- Inappropriate content filtering
- Content approval workflow
- Flagging and reporting system

#### 10. **Integration Features**
- Calendar integration
- Third-party API integrations
- Webhook support
- Data export functionality

#### 11. **Background Jobs**
- Task scheduling (cron jobs)
- Email queue processing
- Notification sending
- Database cleanup routines

#### 12. **Database & Performance**
- Database indexing optimization
- Query optimization
- Caching layer (Redis)
- Database replication

---

## API Endpoints Summary

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/google` - Google OAuth
- `GET /api/auth/google/callback` - Google OAuth callback
- `GET /api/auth/confirm/:confirmationCode` - Email verification

### Users
- `POST /api/users/search/astrologers` - Search astrologers
- `POST /api/users/search/users` - Search users
- `GET /api/users/:userId` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `DELETE /api/users/:id` - Delete user
- `GET /api/users/contacts/:userId` - Get contacts
- `PUT /api/users/:id/requestConnect` - Request connection
- `PUT /api/users/:id/acceptConnect` - Accept connection
- `PUT /api/users/:id/deleteConnect` - Remove connection
- `PUT /api/users/:id/withdrawRequest` - Withdraw connection request

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create post
- `GET /api/posts/feed/:userId` - Get user feed
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `POST /api/posts/:id/like` - Like post

### Messages & Conversations
- `GET /api/conversation/:userId` - Get conversations
- `POST /api/message` - Send message
- `GET /api/message/:conversationId` - Get messages
- `PUT /api/message/:messageId` - Update message

### Calls
- `POST /api/call/initiate` - Initiate call
- `GET /api/call/history/user/:userId` - Get call history
- `PATCH /api/call/:callId/end` - End call
- `GET /api/call/active/:userId` - Get active call

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product
- `GET /api/products/my-products` - Get my products
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Payment
- `POST /api/payment/create-order` - Create payment order
- `POST /api/payment/verify-payment` - Verify payment

### Files
- `POST /api/files/upload` - Upload file
- `GET /api/files/:fileId` - Get file
- `DELETE /api/files/:fileId` - Delete file

---

## Installation & Setup

### Prerequisites
- Node.js (v14+)
- MongoDB Atlas account or local MongoDB
- Cloudinary account
- Razorpay account
- Gmail account for email service

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Cloudinary
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Email
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_password

# Client URL
CLIENT_URL=http://localhost:5173
```

### Installation Steps

```bash
# Install dependencies
npm install

# Run migration scripts (optional)
node migrate-roles.js

# Create admin user (optional)
node create-admin.js

# Start development server
npm run dev

# Start production server
npm start
```

---

## Development Notes

### Known Issues
- Group messaging backend not fully implemented
- WebRTC integration pending for video/audio calls
- Email notifications not yet automated
- Verification workflow needs implementation

### Next Steps
1. Implement WebRTC for real video calls
2. Complete group messaging backend
3. Add email notification triggers
4. Implement professional verification workflow
5. Add Redis caching layer
6. Set up automated logging system
7. Implement rate limiting
8. Add comprehensive API documentation (Swagger)

### Contributors
- Development Team

### License
ISC

---

## Contact & Support

For issues, bugs, or feature requests, please create an issue in the project repository.

