# Product Share 🛍️

**Product Share** is a modern, premium e-commerce platform and store-builder that allows users to quickly create an online store, manage products, and track real-time analytics. Built with a focus on high-end design and seamless user experience, Product Share is the easiest way to launch your online business.

## 🚀 Key Features

- **Store Creation & Customization**: Set up your own branded store page with custom theme colors and links.
- **Product Management**: Easily add, edit, and organize your products, including tracking stock and adding discounts.
- **Real-Time Analytics Dashboard**: Monitor store visits, product views, and top-performing items using interactive charts.
- **Customer Reviews**: Collect and display feedback from your customers to build trust.
- **Premium Aesthetics**: A sleek, Shopify-style dashboard built with modern UI principles, glassmorphism, and responsive layouts.
- **Secure Authentication**: User sign-ups and secure sessions powered by Firebase Auth.

## 🛠️ Technology Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (React)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & custom vanilla CSS for complex components
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Database & Auth**: [Firebase](https://firebase.google.com/) (Firestore, Storage, Authentication)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/) & React Icons

## 💻 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd productShare
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory and add your Firebase configuration keys:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open the application:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## 📈 Roadmap

- [x] Premium Dashboard Redesign
- [x] Advanced Analytics & Charting
- [x] Fix Production Image Handling
- [ ] Integration with Payment Gateways
- [ ] Custom Domains Support
- [ ] Email Notifications for Orders

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request if you have ideas for improvements or new features.

---
*Built with ❤️ for modern merchants.*
