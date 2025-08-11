# SkillUp Website

A modern, responsive e-learning platform built with React, TypeScript, and Tailwind CSS. SkillUp provides students and instructors with a comprehensive online learning experience featuring course browsing, enrollment, progress tracking, and interactive dashboards.

## 🌟 Features

### For Students
- **Course Discovery**: Browse and search through a wide variety of courses with advanced filtering
- **Learning Dashboard**: Track your progress, view enrolled courses, and monitor achievements
- **Interactive Learning**: Engage with course content, track completion, and earn certificates
- **Personal Profile**: Manage your account, view learning statistics, and customize preferences
- **Wishlist & Bookmarks**: Save courses for later and organize your learning path

### For Instructors
- **Course Creation**: Build and publish comprehensive courses with multimedia content
- **Student Management**: Monitor student progress and engagement
- **Analytics Dashboard**: View course performance and student statistics
- **Content Management**: Organize course materials, lessons, and assessments

### Core Features
- **Authentication**: Secure JWT-based authentication with role-based access
- **Responsive Design**: Mobile-first design that works seamlessly across all devices
- **Real-time Updates**: Live progress tracking and notifications
- **Search & Filter**: Advanced search capabilities with category and level filtering
- **Modern UI/UX**: Clean, intuitive interface with smooth animations

## 🚀 Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite (Fast development and optimized builds)
- **Styling**: Tailwind CSS with custom components
- **State Management**: Redux Toolkit for global state
- **Routing**: React Router v6 for navigation
- **HTTP Client**: Axios for API communication
- **Icons**: Lucide React for consistent iconography
- **Form Handling**: Custom form components with validation

## 📦 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

### Installation

1. **Clone the repository**:
```bash
git clone <repository-url>
cd skillup-website
```

2. **Install dependencies**:
```bash
npm install
```

3. **Start the development server**:
```bash
npm run dev
```

4. **Open your browser** and navigate to `http://localhost:5173`

### Development Commands

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

## 🏗️ Project Structure

```
src/
├── api/                    # API service layer
│   ├── auth.ts            # Authentication endpoints
│   ├── client.ts          # HTTP client configuration
│   └── courses.ts         # Course-related endpoints
├── components/            # Reusable UI components
│   ├── auth/              # Authentication components
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   ├── layout/            # Layout components
│   │   ├── Header.tsx
│   │   └── Layout.tsx
│   └── ui/                # Base UI components
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       ├── Loading.tsx
│       └── Modal.tsx
├── pages/                 # Page components
│   ├── HomePage.tsx       # Landing page
│   ├── CoursesPage.tsx    # Course listing
│   ├── CourseDetailPage.tsx
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   └── StudentDashboard.tsx
├── store/                 # Redux store configuration
│   ├── index.ts           # Store setup
│   ├── hooks.ts           # Typed hooks
│   └── slices/            # Redux slices
│       ├── authSlice.ts   # Authentication state
│       ├── coursesSlice.ts
│       └── uiSlice.ts
├── types/                 # TypeScript type definitions
│   └── index.ts
├── utils/                 # Utility functions
│   ├── auth.ts            # Authentication utilities
│   └── formatters.ts      # Data formatting helpers
└── App.tsx                # Main application component
```

## 🔐 Authentication & Authorization

The application uses JWT-based authentication with role-based access control:

- **Students**: Can browse courses, enroll, track progress, and manage their profile
- **Instructors**: Additional access to course creation and student management
- **Admins**: Full platform administration (handled in separate admin dashboard)

### User Registration
Users can register as either students or instructors with the following information:
- Full name and email
- Secure password with validation
- Role selection (Student/Instructor)
- Optional bio

## 🎨 UI Components & Design

### Design System
- **Color Palette**: Professional blue-based theme with accessibility in mind
- **Typography**: Inter font family for excellent readability
- **Spacing**: Consistent 8px grid system
- **Components**: Modular, reusable components with TypeScript props

### Key Components
- **Button**: Multiple variants (primary, secondary, outline, ghost)
- **Card**: Flexible container with consistent styling
- **Input**: Form inputs with validation and error states
- **Modal**: Accessible modal dialogs
- **Loading**: Skeleton loaders and spinners

## 🌐 API Integration

The website integrates with the SkillUp backend API:

### Base URL
```
http://localhost:8888/api
```

### Key Endpoints
- **Authentication**: `/auth/login`, `/auth/register`, `/auth/validate`
- **Courses**: `/courses`, `/courses/search`, `/courses/:id`
- **Users**: `/users/profile`, `/users/enrollments`
- **Dashboard**: `/dashboard/stats`

### Error Handling
- Network error recovery with user-friendly messages
- Token expiration handling with automatic redirect to login
- Form validation with real-time feedback
- Loading states for all async operations

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 640px (Single column, touch-optimized)
- **Tablet**: 640px - 1024px (Two-column layout)
- **Desktop**: > 1024px (Full multi-column layout)

### Mobile Features
- Collapsible navigation menu
- Touch-friendly buttons and forms
- Optimized course cards for mobile viewing
- Swipe gestures where appropriate

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=http://localhost:8888/api
VITE_APP_NAME=SkillUp
```

### Tailwind Configuration
The project uses a custom Tailwind configuration with:
- Custom color palette
- Extended spacing scale
- Custom component classes
- Responsive breakpoints

## 🧪 Development & Testing

### Code Quality
- **TypeScript**: Strict type checking enabled
- **ESLint**: React and TypeScript specific rules
- **Prettier**: Consistent code formatting
- **Husky**: Pre-commit hooks for quality assurance

### Best Practices
- Component composition over inheritance
- Custom hooks for reusable logic
- Type-safe API calls with proper error handling
- Accessibility-first component design

## 🚀 Building for Production

1. **Build the application**:
```bash
npm run build
```

2. **Preview the build**:
```bash
npm run preview
```

3. **Deploy**: The `dist` folder contains the production-ready files

### Production Optimizations
- Code splitting for optimal loading
- Asset optimization and compression
- Bundle analysis and tree shaking
- Progressive Web App features ready

## 📋 Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest 2 versions)
- **Mobile**: iOS Safari, Chrome Mobile, Samsung Internet
- **Progressive Enhancement**: Graceful degradation for older browsers

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow the existing code style and TypeScript conventions
- Add proper error handling and loading states
- Ensure responsive design for new components
- Write meaningful commit messages
- Test your changes across different screen sizes

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support & Documentation

For detailed API documentation, component usage examples, and troubleshooting guides, please refer to:
- [API Documentation](docs/api.md)
- [Component Library](docs/components.md)
- [Development Guide](docs/development.md)

---

**SkillUp Website** - Empowering learners and educators through modern web technology.
