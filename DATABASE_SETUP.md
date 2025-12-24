# Database Setup Guide (DEPRECATED - Use Firebase)

> ⚠️ **This guide is for Supabase (deprecated).**  
> The application now uses **Firebase Firestore**.  
> Please see **[FIREBASE_SETUP.md](./FIREBASE_SETUP.md)** for current setup instructions.

---

## Legacy Supabase Setup (No longer used)

This application previously used Supabase (PostgreSQL) to store invoices persistently.

## Step 1: Create Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in project details:
   - Name: `order-easy-print` (or your preferred name)
   - Database Password: (save this securely)
   - Region: Choose closest to your users
5. Wait for project to be created (2-3 minutes)

## Step 2: Get API Credentials

1. In your Supabase project, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (under "Project URL")
   - **anon/public key** (under "Project API keys")

## Step 3: Create Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## Step 4: Create Database Table

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy and paste the contents of `supabase-schema.sql`
4. Click "Run" to execute the SQL
5. Verify the table was created by going to **Table Editor** → you should see `invoices` table

## Step 5: Test the Application

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to the application
3. Create a new invoice and click "Save Invoice"
4. Check Supabase **Table Editor** to verify the invoice was saved

## Database Schema

The `invoices` table stores:
- `id`: Unique identifier (UUID)
- `invoice_number`: Invoice number string
- `restaurant_info`: Restaurant details (JSON)
- `customer_info`: Customer details (JSON)
- `items`: Invoice items array (JSON)
- `tax_rate`: Tax percentage
- `subtotal`, `tax`, `total`: Calculated amounts
- `show_disclaimer`: Boolean flag
- `disclaimer_text`: Custom disclaimer text
- `created_at`, `updated_at`: Timestamps

## Security Notes

- The current setup allows all operations (for development)
- For production, implement proper Row Level Security (RLS) policies
- Consider adding user authentication to restrict access
- The anon key is safe to use in frontend (it's public by design)

## Troubleshooting

**Error: "Failed to load invoices"**
- Check that `.env` file has correct Supabase URL and key
- Verify the `invoices` table exists in Supabase
- Check browser console for detailed error messages

**Error: "Invalid API key"**
- Verify you copied the correct anon key (not the service_role key)
- Make sure there are no extra spaces in `.env` file

**Table not found**
- Run the SQL schema file again in Supabase SQL Editor
- Check that table name is exactly `invoices` (lowercase)
