# ⚡ Admin Panel Quick Start Guide

## 🎯 5-Minute Setup

### Step 1: Verify Firebase Configuration ✅
Check your `.env` file has all Firebase credentials:
```env
VITE_FIREBASE_API_KEY=your_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Step 2: Create Firestore Collections ✅
Go to Firebase Console → Firestore Database and create these collections:

**Collection: `users`**
```json
{
  "uid": "firebase_auth_uid",
  "email": "admin@reservi.com",
  "role": "admin",
  "createdAt": "2026-04-29"
}
```

**Collection: `waitlist`**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "joinedDate": "2026-04-29",
  "preferences": "Italian food"
}
```

**Collection: `restaurant_leads`**
```json
{
  "restaurantName": "Pizza Palace",
  "contactEmail": "owner@pizza.com",
  "phone": "+1 (555) 123-4567",
  "city": "New York",
  "message": "Interested",
  "submittedDate": "2026-04-29",
  "status": "new"
}
```

**Collection: `settings` (Document ID: `global`)**
```json
{
  "launchDate": "2026-05-18T18:19:19",
  "heroHeadline": "The modern way to book restaurants",
  "enableWaitlist": true,
  "enablePartnerSignup": true,
  "maintenanceMode": false
}
```

### Step 3: Create Admin User ✅
1. Go to Firebase Console → Authentication → Users
2. Click "Add User"
3. Enter: `admin@reservi.com` / `password123` (or your choice)
4. Copy the generated **User UID**
5. Go back to Firestore
6. In `users` collection, create a document with `uid` matching the Firebase Auth UID
7. Set fields: `email`, `role` (must be "admin"), `createdAt`

### Step 4: Test Login 🧪
1. Run: `npm run dev`
2. Navigate to: `http://localhost:5173/admin/login`
3. Enter credentials: `admin@reservi.com` / `password123`
4. Should redirect to `/admin/dashboard`

---

## 📍 Admin Routes

Once logged in, access these pages:

| Route | Purpose |
|-------|---------|
| `/admin/login` | Login page |
| `/admin/dashboard` | Main overview & metrics |
| `/admin/waitlist` | User signups table + CSV export |
| `/admin/leads` | Restaurant partnership leads |
| `/admin/analytics` | Charts & trends |
| `/admin/settings` | Platform configuration |

---

## 🎨 Key Features

### Dashboard
- 📊 Real-time metrics (waitlist, leads, conversion)
- 📈 Weekly activity charts
- 🔄 Recent activity feed
- 🚀 Pre-launch status

### Waitlist Management
- 📋 Full user table with search/filter
- 👥 Filter by role (user/restaurant owner)
- 💾 **Export to CSV** button
- 📊 Stats breakdown

### Restaurant Leads
- 🏢 Leads with contact info
- 🔗 Direct email/phone links
- ✏️ Status tracking (new → contacted → interested → partner)
- 🔍 Search & filter by status

### Analytics
- 📈 Total signups & leads
- 📊 Conversion rate calculation
- 📅 7-day growth tracking
- 📉 Trend charts

### Settings
- ⏰ Launch date/time countdown
- ✍️ Hero headline editor
- 🔘 Feature toggles
- 🛠️ Maintenance mode

---

## 🔒 Security

- ✅ Firebase Auth required to access admin
- ✅ Firestore role check (`role === "admin"`)
- ✅ Automatic redirect if not admin
- ✅ Session management
- ✅ Logout clears auth state

---

## 🐛 Troubleshooting

**Login page shows but won't authenticate:**
- Check Firebase config in `.env`
- Verify user exists in Firebase Authentication
- Confirm Firestore `users` document has matching UID and `role: "admin"`

**Dashboard shows but no data:**
- Check Firestore collections exist
- Verify Firestore rules allow reads (default allows)
- Add test data to collections

**404 on `/admin/login`:**
- Verify routes are added to `src/app/App.tsx`
- Check AdminProvider wraps the app

**CORS/Firebase errors:**
- Clear browser cache and cookies
- Restart dev server: `npm run dev`
- Check internet connection to Firebase

---

## 📝 Add Test Data Script

Run this in Firebase Console Terminal or your app:

```typescript
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Add 3 waitlist users
for (let i = 1; i <= 3; i++) {
  await addDoc(collection(db, "waitlist"), {
    name: `Test User ${i}`,
    email: `user${i}@example.com`,
    role: i % 2 === 0 ? "restaurant_owner" : "user",
    joinedDate: new Date(),
    preferences: "Various cuisines"
  });
}

// Add 3 restaurant leads
for (let i = 1; i <= 3; i++) {
  await addDoc(collection(db, "restaurant_leads"), {
    restaurantName: `Test Restaurant ${i}`,
    contactEmail: `owner${i}@test.com`,
    phone: `+1 (555) 100-${100 + i}`,
    city: ["New York", "Los Angeles", "Chicago"][i - 1],
    message: "Very interested in partnership",
    submittedDate: new Date(),
    status: ["new", "contacted", "interested"][i - 1]
  });
}
```

---

## 📊 CSV Export

1. Go to `/admin/waitlist`
2. (Optional) Search or filter users
3. Click **"Export CSV"** button
4. File downloads as `waitlist-YYYY-MM-DD.csv`

Columns: Name, Email, Role, Joined Date

---

## 🎯 Common Tasks

### Change Launch Date
1. Go to `/admin/settings`
2. Update "Launch Date & Time"
3. Click "Save Settings"
4. Homepage countdown updates instantly

### Toggle Feature
1. Go to `/admin/settings`
2. Toggle: "Enable Waitlist Form" or "Enable Partner Signup"
3. Click "Save Settings"

### Update Lead Status
1. Go to `/admin/leads`
2. Find the restaurant
3. Click status dropdown
4. Select new status (auto-saves)

### View Analytics
1. Go to `/admin/analytics`
2. See all metrics and charts
3. Data auto-refreshes on load

---

## 🚀 Deploy to Production

Before deploying, ensure:

1. **Firebase Security Rules** are set up:
   ```
   match /users/{uid} {
     allow read, write: if request.auth.uid == uid && get(/databases/$(database)/documents/users/$(uid)).data.role == 'admin';
   }
   ```

2. **Firestore is in production mode** (not test mode)

3. **.env variables** are properly set in hosting environment

4. **HTTPS** is enabled

5. Consider adding **rate limiting** on auth endpoints

---

## 📚 Full Documentation

For detailed setup, see:
- `ADMIN_SETUP.md` - Complete guide
- `ADMIN_IMPLEMENTATION.md` - Implementation checklist

---

**Ready to go! 🎉**

Your admin panel is now live at `/admin/login`

Need help? Check the troubleshooting section or review full documentation.
