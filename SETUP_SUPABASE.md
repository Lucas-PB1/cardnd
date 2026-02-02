# Supabase Setup Guide for Cardnd

Follow these steps to configure your Supabase backend for authentication.

## 1. Create a Supabase Project
1. Go to [Supabase](https://supabase.com/) and sign in.
2. Click **"New Project"**.
3. Choose your organization, name the project (e.g., `cardnd`), and set a database password.
4. Select a region close to you.
5. Click **"Create new project"**.

## 2. Get API Credentials
Once your project is ready (this may take a minute):
1. Go to **Project Settings** (gear icon in the bottom left).
2. Click on **API** in the sidebar.
3. **Project URL**: At the very top of this page, look for the "Project URL" box. It looks like `https://xyz...supabase.co`.
4. **API Keys**: Below that, finding the **`Publishable`** Key.

## 3. Configure Environment Variables
1. Open the `.env` file in your project root.
2. Replace the placeholders with your actual values:
    - `NEXT_PUBLIC_SUPABASE_URL`: Your Project URL
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your **Publishable** token (starts with `sb_publishable_...` or `ey...`)

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 4. Configure Authentication URLs
1. In your Supabase dashboard, go to **Authentication** (icon with users).
2. Click on **URL Configuration** in the sidebar.
3. Set **Site URL** to:
   ```
   http://localhost:3000
   ```
4. Add the following to **Redirect URLs**:
   ```
   http://localhost:3000/auth/callback
   ```
5. Click **Save**.

## 5. Enable Email Auth
1. Go to **Authentication** -> **Providers**.
2. Ensure **Email** is "Enabled".
3. (Optional) Disable "Confirm email" if you want to login without clicking the email link during testing (good for dev), or keep it enabled for Magic Links.
   * *Note: The current code uses Magic Links (`signInWithOtp`), so you WILL need to check your email (or use the Inbucket/Supabase email preview) to log in.*

## 6. Restart Development Server
After changing `.env`, you must restart your Next.js server:

```bash
# In your terminal
ctrl+c
npm run dev
```

## Troubleshooting
- **Login 404?**: Ensure you migrated the folder structure correctly (done in previous steps).
- **Infinite Loading?**: Check your browser console. If `Supabase URL` is missing, the client won't initialize.

## 7. Configure Custom SMTP (Fix Rate Limits)
The default Supabase email limit is very low (3-5 emails per hour). To fix this, you should use your own SMTP provider.

**Recommendation: Resend (Free Tier is generous)**

1.  Go to [Resend.com](https://resend.com) and create an account.
2.  Add an API Key.
3.  In **Supabase Dashboard**:
    - Go to **Project Settings** -> **Authentication** -> **SMTP Settings**.
    - Toggle **Enable Custom SMTP**.
    - **Sender Email**: `onboarding@resend.dev` (or your verified domain).
    - **Sender Name**: Cardnd
    - **Host**: `smtp.resend.com`
    - **Port**: `465`
    - **Username**: `resend`
    - **Password**: `re_123456...` (Your Resend API Key).
4.  Click **Save**.

Now you can send up to 3000 emails/month for free, bypassing the Supabase rate limit.
