# TailorPro is a premium, AI-powered workshop management system designed for bespoke tailoring businesses. Originally built for Lucy Stitches in Onitsha, Anambra State, Nigeria.

## 🚀 Getting Started

1. **Clone & Install**:
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Supabase Setup**:
   - Create a project on [Supabase](https://supabase.com).
   - Run the SQL contents from `src/lib/supabase/schema.sql` (found in the root/setup folder or previously generated) in the Supabase SQL Editor.
   - Enabling RLS is highly recommended for production.

3. **Environment**:
   Copy `.env.local.example` to `.env.local` and fill in:
   - Supabase Credentials
   - Hugging Face API Token (for Design Suggester)
   - Resend API Key (for Email)
   - Paystack Sandbox Keys (for Payments)

4. **Run**:
   ```bash
   npm run dev
   ```

## ✨ Features
- **Measurements Management**: Store client body data for reuse.
- **Order Lifecycle**: Track garments from fabric selection to delivery.
- **AI Design**: Generate clothing inspiration using Stable Diffusion.
- **Client Portal**: Let customers track their own orders.

## 🎨 Design System
- **Colors**: Brand Emerald (#064E3B), Brand Gold (#D97706).
- **Typography**: Inter / Sans-serif.
- **Aesthetic**: Premium, Modern, Nigerian-centric.
