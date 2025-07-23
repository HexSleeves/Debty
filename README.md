# Debty - Debt Management App

A modern debt management application built with React 19, Vite, Convex, and Clerk.

## 🚀 Tech Stack

- **Frontend**: React 19 + Vite + TypeScript
- **Backend**: Convex (serverless, real-time)
- **Authentication**: Clerk
- **UI**: shadcn/ui + Tailwind CSS
- **Routing**: Tanstack Router
- **Forms**: Tanstack Form + React Hook Form
- **Icons**: Lucide React
- **Testing**: Vitest + Testing Library + Playwright
- **Linting**: Biome

## 📋 Prerequisites

- Node.js 18+ or Bun
- Convex account
- Clerk account

## 🛠 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd debty
   ```

2. **Install dependencies**

   ```bash
   bun install
   ```

3. **Set up environment variables**
   Copy `.env.local.example` to `.env.local` and fill in your keys:

   ```bash
   VITE_CONVEX_URL=your_convex_url
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
   ```

4. **Start development server**

   ```bash
   bun run dev
   ```

## 📜 Available Scripts

- `bun run dev` - Start development server with Convex backend
- `bun run build` - Build for production
- `bun run preview` - Preview production build
- `bun run typecheck` - Run TypeScript checking
- `bun run lint` - Run linting with Biome
- `bun run lint:check` - Check linting without fixing
- `bun run test` - Run unit tests
- `bun run test:run` - Run tests once
- `bun run test:coverage` - Run tests with coverage
- `bun run e2e` - Run E2E tests
- `bun run e2e:ui` - Run E2E tests with UI
- `bun run clean` - Clean build artifacts
- `bun run reset` - Reset node_modules and reinstall

## 🏗 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── dashboard/      # Dashboard-specific components
│   ├── debts/          # Debt-related components
│   ├── strategies/     # Strategy components
│   ├── forms/          # Form components
│   └── shared/         # Shared utilities
├── layouts/            # Layout components
├── pages/              # Page components
│   ├── auth/          # Authentication pages
│   └── dashboard/     # Dashboard pages
├── providers/          # Context providers
├── router/            # Tanstack Router configuration
├── lib/               # Utility functions
│   ├── calculations/  # Debt calculation algorithms
│   └── utils/         # General utilities
└── main.tsx           # App entry point

convex/
├── _generated/        # Auto-generated Convex files
├── _schema.ts         # Database schema
├── auth.config.js     # Auth configuration
└── myFunctions.ts     # Backend functions
```

## 🔑 Environment Variables

Create a `.env.local` file with:

```env
VITE_CONVEX_URL=https://your-deployment.convex.cloud
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

## 🧪 Testing

The project uses Vitest for unit tests and Playwright for E2E tests:

```bash
# Run unit tests
bun run test

# Run E2E tests
bun run e2e
```

## 📦 Deployment

The app is designed to be deployed on static hosting platforms:

1. **Build the project**

   ```bash
   bun run build
   ```

2. **Deploy the `dist` folder** to:
   - Netlify
   - Vercel
   - Cloudflare Pages
   - Any static hosting service

## 🔧 Development Tools

- **VS Code**: Configured with recommended extensions
- **Git Hooks**: Pre-commit hooks run linting and tests
- **Commit Linting**: Conventional commit messages required
- **Hot Reload**: Instant updates during development

## 📈 Features

### Core Functionality

- ✅ User authentication (Clerk)
- ✅ Debt tracking and management
- ✅ Payment recording
- ✅ Strategy calculations (Avalanche/Snowball)
- ✅ Progress visualization
- ✅ Real-time data sync

### Planned Features

- 🔄 Bank integration (Plaid)
- 🔄 Advanced analytics
- 🔄 Mobile app
- 🔄 Export/import functionality

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
