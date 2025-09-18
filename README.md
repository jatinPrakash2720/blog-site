# AI Blogging Platform - Client

A modern React-based blogging platform with AI-powered features and comprehensive authentication flow.

## Features

- ✨ AI-Powered Writing Assistant
- 🔍 Smart Content Discovery
- 📊 Analytics Dashboard
- 🔐 Complete Authentication Flow
- 📱 Responsive Design
- 🌙 Dark Mode Support

## Authentication Flow

The application includes a complete authentication system with the following flow:

### Navigation Structure

```
Home Page (/)
├── Sign In (/signin)
└── Forgot Password Flow (/forgot-password)
    ├── Forgot Password Form
    ├── Account Search
    └── OTP Verification
```

### Auth Components

1. **SignIn** (`/signin`)
   - Email and password login
   - Navigation to forgot password flow
   - Clean, modern UI with loading states

2. **ForgotPasswordRoute** (`/forgot-password`)
   - Manages the complete password reset flow
   - Uses `AuthLayout` for state management
   - Seamless navigation between auth steps

3. **AuthLayout**
   - Central state management for auth flow
   - Handles navigation between:
     - Forgot Password Form
     - Account Search
     - OTP Verification
   - Maintains user data across steps

### Auth Flow Steps

1. **Forgot Password Form**
   - User enters email address
   - Validates email format
   - Shows success/error states
   - Option to search for account

2. **Account Search**
   - Search by email or username
   - Real-time validation
   - Auto-redirect on success
   - Back navigation to forgot password

3. **OTP Verification**
   - 6-digit code input
   - Auto-focus and navigation
   - Resend functionality with cooldown
   - Success/error handling

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint
```

### Development

The application uses:

- **React 19** with TypeScript
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Radix UI** for components
- **Lucide React** for icons

### Project Structure

```
src/
├── components/
│   ├── ui/           # Reusable UI components
│   ├── layout/       # Layout components
│   └── features/     # Feature-specific components
├── pages/
│   ├── auth/         # Authentication pages
│   └── HomePage.tsx  # Main landing page
├── lib/              # Utility functions
├── store/            # State management
├── types/            # TypeScript definitions
└── services/         # API services
```

## API Integration

The auth components are ready for API integration. Replace the TODO comments in:

- `ForgotPasswordRoute.tsx`
- `Signin.tsx`

With actual API calls to your backend services.

## Styling

The application uses a modern design system with:

- Glass morphism effects
- Smooth animations
- Responsive layouts
- Dark mode support
- Consistent spacing and typography

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details
