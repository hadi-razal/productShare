# Product Share 🛍️

Product Share is an e-commerce platform and storefront builder for launching
and managing an online business. Merchants can create a branded storefront,
manage their catalog, accept payments, and understand store performance from
one responsive dashboard.

## Features

- **Custom storefronts** — create a branded store with custom colors and links
- **Catalog management** — add, edit, organize, discount, and track products
- **Store analytics** — monitor visits, product views, and top-performing items
- **Customer reviews** — collect and display customer feedback
- **Payments** — create and manage Razorpay orders and subscriptions
- **Email delivery** — send transactional email through an SMTP provider
- **Secure authentication** — manage user accounts and sessions with Supabase
- **Responsive interface** — provide a consistent experience across devices

## Tech stack

- [Next.js 15](https://nextjs.org/) and [React 18](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/) for Authentication, Database, and Storage
- [Razorpay](https://razorpay.com/) for payments
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Recharts](https://recharts.org/) and Chart.js for analytics
- [Nodemailer](https://nodemailer.com/) for transactional email

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 20 or later
- npm
- A Supabase project

Razorpay and SMTP accounts are also required to use payments and email.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/hadi-razal/productShare.git
   cd productShare
   ```

2. Install dependencies:

   ```bash
   npm ci
   ```

3. Create a `.env` file in the project root:

   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

   # Razorpay
   NEXT_PUBLIC_RAZORPAY_KEY_ID=your_public_key_id
   RAZORPAY_KEY_ID=your_key_id
   RAZORPAY_KEY_SECRET=your_key_secret
   NEXT_PUBLIC_RZP_MONTHLY_PLAN_ID=your_monthly_plan_id
   NEXT_PUBLIC_RZP_YEARLY_PLAN_ID=your_yearly_plan_id

   # SMTP
   SMTP_HOST=your_smtp_host
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your_smtp_username
   SMTP_PASS=your_smtp_password
   SMTP_FROM=your_sender_address
   ```

   Never commit `.env` or real credentials. Environment files are ignored by
   Git.

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000).

## Available scripts

- `npm run dev` — start the local development server
- `npm run build` — create a production build and sitemap
- `npm run start` — run the production server
- `npm run lint` — run the Next.js linter

## Roadmap

- [x] Responsive merchant dashboard
- [x] Store analytics and charting
- [x] Razorpay payment integration
- [x] SMTP email support
- [ ] Custom domain support
- [ ] Expanded automated test coverage

## Contributing

Contributions are welcome. Open an issue to discuss a bug or feature, then
submit a focused pull request.

---

Built with ❤️ for modern merchants.

## Store onboarding

New customers reach `/onboarding` through the dashboard's setup gate. Existing completed stores keep their dashboard access. The seven-step setup includes a live catalogue preview, private per-account drafts, logo uploads, slug availability checks, and a support screen with a pausable ten-second dashboard redirect.

### Database setup (required before deploying)

After the existing `supabase/schema.sql`, run `supabase/migrations/20260922_store_onboarding.sql` in the project's Supabase SQL editor. This migration creates the owner-only `store_onboarding` table, catalogue preference columns, and the `complete_store_onboarding` transaction. It can be reapplied safely. The migration has not been applied to a live database by this change.

Set the existing `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Onboarding uses the authenticated user's session and does not require a service-role key. The existing public `uploads` bucket must be configured for authenticated uploads.

Draft details are stored as JSON in the private table, keyed by `user_id`, with the current step, completion flag and timestamps. They are saved after completed steps and one second after edits. Failed saves remain visible and can be retried; unsaved edits trigger the browser's leave warning. No personal draft details are stored in localStorage. Final submission validates on the client and API, then updates the store and completes the draft in one database transaction. Unique username enforcement handles competing slug claims.

Slugs support internal hyphens and exclude application routes. The displayed `productshare.in/store/[slug]` links use the existing storefront routing, which redirects to the canonical store subdomain in production. Catalogue currency, brand accent and enquiry preferences are applied to the storefront as well as the preview. Uploaded logos are public assets; customer contact details and other setup answers stay in the private draft record.

### Validation

Run `npm run dev` in one terminal and `npm run test:onboarding` in another. The browser test uses Edge on Windows; elsewhere first run `npx playwright install chromium`. Optional environment variables: `ONBOARDING_TEST_URL` (default `http://localhost:3001`) and `PLAYWRIGHT_CHANNEL`.

The test intercepts Supabase and completion requests; it never creates a real customer or changes live data. It covers all seven steps, invalid Indian phone numbers, unavailable slugs, custom-value draft restoration, save failure/retry, viewport widths of 320/390/768/1024/1440px, completion, and the WhatsApp support link. Screenshots are written under `tests/` and ignored by Git. A real authenticated integration check against the migrated Supabase project is still required before release.

Database regression coverage is in `tests/onboarding.database.cjs`. Install `@electric-sql/pglite` in a temporary directory, set `PGLITE_MODULE` to that package's absolute path, then run `node tests/onboarding.database.cjs`. This executes the migration twice in an isolated embedded PostgreSQL database and verifies owner-only draft access, anonymous denial, reserved slugs, atomic completion, repeated submission, and rollback on duplicate slugs. It does not connect to Supabase.
