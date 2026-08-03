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
- **Secure authentication** — manage user accounts and sessions with Firebase
- **Responsive interface** — provide a consistent experience across devices

## Tech stack

- [Next.js 15](https://nextjs.org/) and [React 18](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Firebase](https://firebase.google.com/) for Authentication, Firestore, and Storage
- [Razorpay](https://razorpay.com/) for payments
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Recharts](https://recharts.org/) and Chart.js for analytics
- [Nodemailer](https://nodemailer.com/) for transactional email

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 20 or later
- npm
- A Firebase project

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
   # Firebase
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

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
