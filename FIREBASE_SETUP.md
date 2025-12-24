# Firebase Firestore Setup Guide

This application uses Firebase Firestore (NoSQL database) to store invoices persistently. Follow these steps to set up Firebase.

## Step 1: Create Firebase Project

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Sign in with your Google account
3. Click "Add project" or "Create a project"
4. Fill in project details:
   - **Project name**: `order-easy-print` (or your preferred name)
   - **Google Analytics**: Optional (can disable if not needed)
5. Click "Create project" and wait for setup to complete

## Step 2: Register Web App

1. In your Firebase project, click the **Web icon** (`</>`) or "Add app" → "Web"
2. Register your app:
   - **App nickname**: `order-easy-print-web` (or any name)
   - **Firebase Hosting**: Optional (can skip for now)
3. Click "Register app"
4. **Copy the Firebase configuration object** - you'll need this in the next step

## Step 3: Get Configuration Values

The Firebase config object looks like this:
```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

## Step 4: Create Environment Variables

1. Create a `.env` file in the project root (if it doesn't exist)
2. Add your Firebase configuration:
   ```
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abc123
   ```

## Step 5: Set Up Firestore Database

1. In Firebase Console, go to **Build** → **Firestore Database**
2. Click "Create database"
3. Choose **"Start in test mode"** (for development)
   - ⚠️ **Note**: Test mode allows all reads/writes. For production, set up proper security rules.
4. Select a location (choose closest to your users)
5. Click "Enable"

## Step 6: Configure Firestore Security Rules (Important!)

1. Go to **Firestore Database** → **Rules** tab
2. For development, you can use:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /invoices/{invoiceId} {
         allow read, write: if true; // Allow all for development
       }
     }
   }
   ```
3. Click "Publish"
4. ⚠️ **For production**, implement proper authentication and security rules

## Step 7: Create Firestore Index (Optional but Recommended)

1. Go to **Firestore Database** → **Indexes** tab
2. Click "Create Index"
3. Collection: `invoices`
4. Fields to index:
   - Field: `created_at`, Order: Descending
5. Click "Create"

## Step 8: Test the Application

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to the application
3. Create a new invoice and click "Save Invoice"
4. Check Firebase Console → **Firestore Database** → **Data** tab
5. You should see the `invoices` collection with your saved invoice

## Firebase Free Tier Limits

- **Storage**: 1 GB total
- **Reads**: 50,000/day
- **Writes**: 20,000/day
- **Deletes**: 20,000/day

These limits are generous for a small restaurant operation.

## Security Notes

- **Development**: Test mode allows all operations (convenient but not secure)
- **Production**: Implement proper security rules with authentication
- The API keys in `.env` are safe to use in frontend (they're public by design)
- Never commit `.env` file to version control

## Troubleshooting

**Error: "Firebase: Error (auth/configuration-not-found)"**
- Check that all environment variables are set correctly in `.env`
- Verify you copied the config from the correct Firebase project
- Restart the dev server after changing `.env`

**Error: "Missing or insufficient permissions"**
- Check Firestore security rules
- Make sure rules allow read/write operations
- For development, use test mode rules shown above

**Error: "Failed to load invoices"**
- Verify Firestore database is created and enabled
- Check browser console for detailed error messages
- Ensure `invoices` collection exists (it will be created automatically on first save)

**Collection not appearing**
- Create your first invoice - the collection will be created automatically
- Check Firestore Console → Data tab
- Refresh the page if needed

## Next Steps

- Set up proper authentication (optional)
- Configure production security rules
- Set up Firebase Hosting (optional, for deployment)
- Enable Firebase Analytics (optional)
