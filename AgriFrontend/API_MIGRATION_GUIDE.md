# API Configuration Migration Guide

## What Was Done

✅ Created centralized API configuration at `src/config/api.ts`
✅ Updated `Cloud.tsx` to use the new API configuration
✅ Created `.env.example` file with documentation

## How It Works

### 1. Environment Variable
The API base URL is now controlled by the `VITE_API_BASE_URL` environment variable in your `.env` file:

```env
VITE_API_BASE_URL=http://localhost:5000
```

For production, simply change it to:
```env
VITE_API_BASE_URL=https://your-production-api.com
```

### 2. Centralized Configuration
All API endpoints are now defined in `src/config/api.ts`. This file:
- Reads the base URL from environment variables
- Provides typed endpoint helpers
- Makes it easy to update all API calls in one place

### 3. Usage Example
Instead of:
```typescript
fetch(`http://localhost:5000/api/users/${userId}`)
```

Now use:
```typescript
import { API_ENDPOINTS } from '../config/api';
fetch(API_ENDPOINTS.users.getUser(userId))
```

## Files That Still Need Updating

The following files still have hardcoded URLs and should be updated:

### High Priority (Most Used)
- [ ] `src/pages/Feed.tsx` (11 occurrences)
- [ ] `src/pages/Messages.tsx` (9 occurrences)
- [ ] `src/pages/ProfileInfo.tsx` (8 occurrences)

### Medium Priority
- [ ] `src/pages/Contacts.tsx` (5 occurrences)
- [ ] `src/pages/LawyerProfile.tsx` (3 occurrences)
- [ ] `src/pages/Login.tsx` (1 occurrence)
- [ ] `src/pages/SignUp.tsx` (1 occurrence)
- [ ] `src/pages/Home.tsx` (1 occurrence)
- [ ] `src/components/Navbar.tsx` (1 occurrence)

## How to Update Other Files

### Step 1: Add Import
At the top of each file, add:
```typescript
import { API_ENDPOINTS } from '../config/api';
```

### Step 2: Replace URLs
Replace hardcoded URLs with the appropriate endpoint from `API_ENDPOINTS`:

**User endpoints:**
- `http://localhost:5000/api/users/${userId}` → `API_ENDPOINTS.users.getUser(userId)`
- `http://localhost:5000/api/users/search/lawyers` → `API_ENDPOINTS.users.searchLawyers`

**Auth endpoints:**
- `http://localhost:5000/api/auth/google` → `API_ENDPOINTS.auth.google`
- `http://localhost:5000/api/auth/logout` → `API_ENDPOINTS.auth.logout`

**Post endpoints:**
- `http://localhost:5000/api/posts` → `API_ENDPOINTS.posts.base`
- `http://localhost:5000/api/posts/feed/${userId}` → `API_ENDPOINTS.posts.feed(userId)`
- `http://localhost:5000/api/posts/${postId}/like` → `API_ENDPOINTS.posts.like(postId)`

**Message/Conversation endpoints:**
- `http://localhost:5000/api/conversation/${userId}` → `API_ENDPOINTS.conversation.base(userId)`
- `http://localhost:5000/api/message` → `API_ENDPOINTS.message.base`

## Benefits

✨ **Easy Environment Switching**: Change one variable to switch between dev/staging/production
✨ **Type Safety**: TypeScript autocomplete for all endpoints
✨ **Maintainability**: Update endpoints in one place
✨ **No Hardcoded URLs**: Cleaner, more professional code
✨ **Team Collaboration**: Clear documentation of all API endpoints

## Next Steps

1. Update your `.env` file with the correct `VITE_API_BASE_URL`
2. Gradually migrate other files to use `API_ENDPOINTS`
3. Test each file after migration
4. Remove hardcoded URLs completely

## Testing

After updating, test by:
1. Running the dev server: `npm run dev`
2. Verifying API calls work correctly
3. Checking browser console for any errors
