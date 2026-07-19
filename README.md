# 🪷 Buddha Dharma Sutra

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb)

Welcome to the **Buddha Dharma Sutra** project repository. This is a comprehensive, modern web application built with Next.js, dedicated to providing a serene, accessible, and enriching platform for exploring and reading Buddhist texts, sutras, and teachings.

---

## ✨ Key Features

- **📖 Open Book Layout:** Immersive and responsive reading experience designed for focus and tranquility.
- **🔐 Authentication:** Secure user and admin login powered by `next-auth`.
- **✍️ Writer Dashboard:** Dedicated portals for contributors to write and manage content.
- **🎛️ Admin Panel:** Comprehensive management interface with data visualization (`recharts`).
- **💳 Donations:** Integrated payment gateways (`Stripe` & `SSLCommerz`) to support the platform.
- **🎨 Modern UI/UX:** Built with Tailwind CSS and enhanced with smooth animations via `framer-motion`.
- **🔍 Advanced Search:** Fast and fuzzy search capabilities using `fuse.js`.
- **🌐 Internationalization:** Multilingual support setup using `next-intl`.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 & clsx/tailwind-merge
- **Database:** MongoDB (via Mongoose)
- **Authentication:** NextAuth.js
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Drag & Drop:** dnd-kit

---

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites

Ensure you have the following installed:
- Node.js (v20 or higher recommended)
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <repository-url>
   cd Buddha-Dharma-Sutra
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Variables:**
   Copy the example environment file and fill in the required values (Database URI, Auth secrets, Payment keys, etc.).
   ```bash
   cp .env.example .env.local
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open the app:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser to see the application.

---

## 📂 Project Structure (Key Areas)

- `/src/app/` - Next.js App Router pages (e.g., `/admin`, `/writer`).
- `/src/components/` - Reusable UI components (e.g., `DonateModal.tsx`, `OpenBookLayout.tsx`, `Footer.tsx`).
- `/public/` - Static assets like images and icons.

---

## 🤝 Contributing

Contributions are always welcome! Whether it's fixing a bug, improving the UI, or adding new features, please feel free to open an issue or submit a pull request.

---

May this platform bring peace and wisdom to all its users. 🙏
