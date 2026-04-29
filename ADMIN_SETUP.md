# Reservi Admin Panel Setup Guide

## 🔐 Overview

This is a secure, pre-launch admin panel for the Reservi restaurant reservation platform. It provides role-based access control via Firebase Auth with admin role verification through Firestore.

**Key Features:**
- ✅ Firebase Authentication (email/password)
- ✅ Role-based access control (admin verification)
- ✅ Waitlist management with CSV export
- ✅ Restaurant partnership leads tracking
- ✅ Real-time analytics dashboard
- ✅ Platform settings and configuration
- ✅ Responsive SaaS-style UI

---

## 📋 Prerequisites

1. **Firebase Project Setup**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Create a new project or use existing one
   - Enable **Authentication** (Email/Password)
   - Create **Firestore Database** (production mode)

2. **Environment Variables**
   Add these to your `.env` file:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

---

## 🔧 Firebase Firestore Setup

### 1. Create Admin User Collection

In Firebase Console, create a Firestore document:

**Collection:** `users`  
**Document ID:** (auto-generated)

```json
{
  "uid": "user_uid_from_auth",
  "email": "admin@reservi.com",
  "role": "admin",
  "createdAt": "2026-04-29T00:00:00.000Z"
}
```

**Important:** Match the `uid` with the Firebase Auth user ID.

### 2. Create Waitlist Collection

**Collection:** `waitlist`

```json
{
  "id": "auto",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",  // or "restaurant_owner"
  "joinedDate": "2026-04-29T10:30:00.000Z",
  "preferences": "Italian cuisine"
}
```

### 3. Create Restaurant Leads Collection

**Collection:** `restaurant_leads`

```json
{
  "id": "auto",
  "restaurantName": "Pizza Palace",
  "contactEmail": "owner@pizzapalace.com",
  "phone": "+1 (555) 123-4567",
  "city": "New York",
  "message": "Interested in partnership",
  "submittedDate": "2026-04-29T10:30:00.000Z",
  "status": "new"  // new | contacted | interested | partner
}
```

### 4. Create Settings Collection

**Collection:** `settings`  
**Document ID:** `global`

```json
{
  "launchDate": "2026-05-18T18:19:19",
  "heroHeadline": "The modern way to book restaurants",
  "enableWaitlist": true,
  "enablePartnerSignup": true,
  "maintenanceMode": false
}
```

---

## 👤 Creating Admin Users

### Method 1: Firebase Console (Recommended)

1. Go to **Authentication** → **Users**
2. Click **Add User**
3. Enter admin email and password
4. Copy the **User UID**
5. Create a document in `users` collection with that UID and `role: "admin"`

### Method 2: Programmatically

Use the provided auth service:

```typescript
import { loginAdmin } from "@/lib/auth";

// After Firebase Auth user is created
const user = await loginAdmin("admin@reservi.com", "password");
console.log("Admin UID:", user.uid);
```

---

## 🚀 Accessing the Admin Panel

1. **Navigate to:** `http://localhost:5173/admin/login`
2. **Enter credentials:**
   - Email: `admin@reservi.com`
   - Password: `your_admin_password`
3. **On successful login:** Redirects to `/admin/dashboard`

---

## 📊 Admin Dashboard Features

### Dashboard (`/admin/dashboard`)
- Total waitlist users with weekly growth
- Restaurant leads pipeline
- Conversion rate metrics
- Weekly activity charts
- Recent activity feed

### Waitlist Management (`/admin/waitlist`)
- View all waitlist signups
- Filter by role (user / restaurant owner)
- Search by name or email
- **Export to CSV** button
- Stats: total users, breakdown by role

### Restaurant Leads (`/admin/leads`)
- View all partnership inquiries
- Update lead status (new → contacted → interested → partner)
- Contact info (email, phone)
- Filter by status
- Search functionality
- Quick action buttons

### Analytics (`/admin/analytics`)
- Total signups and leads metrics
- 7-day growth tracking
- Conversion rate calculation
- Daily signup trends (chart)
- Restaurant leads trend (bar chart)
- Pre-launch summary stats

### Settings (`/admin/settings`)
- **Launch Configuration:**
  - Set launch date/time (updates homepage countdown)
  - Edit hero headline
  
- **Feature Toggles:**
  - Enable/disable waitlist form
  - Enable/disable partner signup
  - Maintenance mode activation

---

## 🔒 Security Architecture

### Authentication Flow

```
Login Form → Firebase Auth → UID Retrieved
                              ↓
                    Firestore users/{uid}
                              ↓
                    Check role === "admin"
                              ↓
                    Grant Access / Redirect to Login
```

### Protected Routes

- **`ProtectedRoute`:** Checks authentication only
- **`AdminRoute`:** Checks authentication + admin role
- Automatic redirects:
  - Not logged in → `/admin/login`
  - Not admin → `/` (home page)

### Key Security Features

✅ **Frontend Role Verification:** Firestore document check  
✅ **Backend-Ready:** Admin routes prevent unauthorized access  
✅ **No Hardcoded Permissions:** Role stored in Firestore  
✅ **Session Management:** Firebase Auth handles sessions  
✅ **Logout Function:** Clears auth state properly  

---

## 🗂️ File Structure

```
src/
├── lib/
│   ├── firebase.ts              # Firebase config + Auth init
│   ├── auth.ts                  # Auth service functions
│   └── AdminContext.tsx         # Admin auth state management
├── types/
│   └── admin.ts                 # TypeScript interfaces
└── app/components/admin/
    ├── index.ts                 # Export barrel
    ├── ProtectedRoute.tsx       # Route protection wrapper
    ├── LoginPage.tsx            # Admin login form
    ├── AdminLayout.tsx          # Sidebar + navigation
    ├── Dashboard.tsx            # Main dashboard
    ├── WaitlistManagement.tsx   # Waitlist table
    ├── RestaurantLeads.tsx      # Leads management
    ├── Analytics.tsx            # Analytics charts
    └── Settings.tsx             # Platform settings
```

---

## 🎨 UI Components Used

- **Radix UI + Shadcn:** Pre-built accessible components
- **Tailwind CSS:** Responsive styling
- **Lucide React:** Icons
- **Recharts:** Analytics charts
- **Framer Motion:** (Optional) Smooth transitions

---

## 📱 Responsive Design

The admin panel is fully responsive:
- **Desktop:** Sidebar always visible, full layout
- **Tablet:** Collapsible sidebar with toggle
- **Mobile:** Hamburger menu, stacked layout

---

## 🔄 Real-Time Updates

All data is fetched from Firestore on component mount. To add real-time listeners:

```typescript
import { onSnapshot } from "firebase/firestore";

const unsub = onSnapshot(collection(db, "waitlist"), (snapshot) => {
  const data = snapshot.docs.map(doc => doc.data());
  setWaitlist(data);
});

// Cleanup
return () => unsub();
```

---

## 🧪 Testing the Admin Panel

### Test Data Script

Create test data in Firestore:

```typescript
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Add test waitlist user
await addDoc(collection(db, "waitlist"), {
  name: "Test User",
  email: "test@example.com",
  role: "user",
  joinedDate: new Date(),
});

// Add test restaurant lead
await addDoc(collection(db, "restaurant_leads"), {
  restaurantName: "Test Restaurant",
  contactEmail: "owner@test.com",
  phone: "+1 (555) 123-4567",
  city: "San Francisco",
  message: "Interested",
  submittedDate: new Date(),
  status: "new",
});
```

---

## 📦 CSV Export

Waitlist data can be exported as CSV with columns:
- Name
- Email
- Role
- Joined Date

**Usage:** Click "Export CSV" button on Waitlist page.

---

## 🚨 Troubleshooting

| Issue | Solution |
|-------|----------|
| Login page loops | Verify Firebase config in `.env` |
| "Not admin" error | Check Firestore `users/{uid}` has `role: "admin"` |
| Data not loading | Check Firestore rules aren't blocking reads |
| 404 on `/admin/login` | Ensure admin routes are added to App.tsx |
| Firestore quota exceeded | Check if real-time listeners are accumulating |

---

## 🔐 Production Considerations

Before deploying to production:

1. **Firestore Security Rules:**
   ```
   match /users/{uid} {
     allow read: if request.auth.uid == uid && get(/databases/$(database)/documents/users/$(uid)).data.role == 'admin';
   }
   ```

2. **Environment Variables:** Use Firebase Console Secrets

3. **HTTPS:** Ensure admin panel is only accessible over HTTPS

4. **Rate Limiting:** Consider adding rate limits to auth endpoints

5. **Audit Logging:** Log admin actions to a separate collection

---

## 📚 Related Documentation

- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Firestore Database](https://firebase.google.com/docs/firestore)
- [React Router](https://reactrouter.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## 🤝 Support

For issues or questions, refer to:
- Firebase Documentation
- React Router Docs
- GitHub Issues in the repository

---

**Last Updated:** April 29, 2026  
**Version:** 1.0.0 - Pre-Launch
