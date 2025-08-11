# SkillUp Component Library Documentation

A comprehensive guide to the reusable UI components used across the SkillUp platform. This library ensures consistency, accessibility, and maintainability throughout both the website and admin dashboard.

## 🎨 Design System

### Color Palette

```css
:root {
  /* Primary Colors */
  --color-primary: #3b82f6;
  --color-primary-dark: #2563eb;
  --color-primary-light: #60a5fa;
  
  /* Secondary Colors */
  --color-secondary: #6b7280;
  --color-secondary-dark: #4b5563;
  --color-secondary-light: #9ca3af;
  
  /* Semantic Colors */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #06b6d4;
  
  /* Neutral Colors */
  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-900: #111827;
  --color-white: #ffffff;
  --color-black: #000000;
}
```

### Typography Scale

```css
/* Font Sizes */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Spacing System

Based on 4px grid system (0.25rem increments):

```css
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-12: 3rem;    /* 48px */
--space-16: 4rem;    /* 64px */
```

## 🧩 Core Components

### Button Component

A versatile button component with multiple variants and states.

**Props:**
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  children: React.ReactNode;
}
```

**Usage:**
```tsx
import Button from '../components/ui/Button';

// Basic usage
<Button variant="primary" size="md">
  Click me
</Button>

// With loading state
<Button variant="primary" loading={isSubmitting}>
  Submit Form
</Button>

// With icons
<Button variant="outline" startIcon={<PlusIcon />}>
  Add Item
</Button>
```

**Variants:**
- `primary`: Blue background, white text
- `secondary`: Gray background, white text
- `outline`: Transparent background, colored border
- `ghost`: Transparent background, colored text
- `danger`: Red background, white text

### Input Component

Form input component with validation and error states.

**Props:**
```typescript
interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}
```

**Usage:**
```tsx
import Input from '../components/ui/Input';

<Input
  label="Email Address"
  type="email"
  placeholder="Enter your email"
  value={email}
  onChange={setEmail}
  error={emailError}
  required
/>
```

### Card Component

Container component for grouping related content.

**Props:**
```typescript
interface CardProps {
  children: React.ReactNode;
  padding?: 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  border?: boolean;
  className?: string;
}
```

**Usage:**
```tsx
import Card from '../components/ui/Card';

<Card padding="lg" shadow="md">
  <h3>Card Title</h3>
  <p>Card content goes here...</p>
</Card>
```

### Modal Component

Accessible modal dialog component.

**Props:**
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}
```

**Usage:**
```tsx
import Modal from '../components/ui/Modal';

<Modal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  title="Edit Profile"
  size="md"
>
  <div>Modal content...</div>
</Modal>
```

### Loading Component

Loading indicators and skeleton loaders.

**Props:**
```typescript
interface LoadingProps {
  type?: 'spinner' | 'skeleton' | 'dots';
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
}
```

**Usage:**
```tsx
import Loading from '../components/ui/Loading';

// Spinner
<Loading type="spinner" size="md" text="Loading..." />

// Skeleton loader
<Loading type="skeleton" />

// Full screen loading
<Loading type="spinner" fullScreen text="Loading application..." />
```

## 📝 Form Components

### FormField Component

Wrapper component for consistent form field styling.

**Props:**
```typescript
interface FormFieldProps {
  label?: string;
  error?: string;
  required?: boolean;
  helpText?: string;
  children: React.ReactNode;
}
```

### Select Component

Dropdown select component with search functionality.

**Props:**
```typescript
interface SelectProps {
  options: Array<{ value: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchable?: boolean;
  multiple?: boolean;
  disabled?: boolean;
}
```

### Textarea Component

Multi-line text input component.

**Props:**
```typescript
interface TextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  resize?: boolean;
}
```

### Checkbox Component

Checkbox input with custom styling.

**Props:**
```typescript
interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  indeterminate?: boolean;
}
```

### Radio Component

Radio button input component.

**Props:**
```typescript
interface RadioProps {
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  label?: string;
  disabled?: boolean;
}
```

## 📊 Data Display Components

### Table Component

Responsive table component with sorting and pagination.

**Props:**
```typescript
interface TableProps {
  columns: Array<{
    key: string;
    title: string;
    sortable?: boolean;
    render?: (value: any, row: any) => React.ReactNode;
  }>;
  data: Array<any>;
  loading?: boolean;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number) => void;
  };
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
}
```

### Badge Component

Small status indicators and labels.

**Props:**
```typescript
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  rounded?: boolean;
}
```

### Avatar Component

User avatar component with fallback initials.

**Props:**
```typescript
interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  name?: string;
  fallback?: string;
}
```

### ProgressBar Component

Progress indicator component.

**Props:**
```typescript
interface ProgressBarProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'success' | 'warning' | 'error';
  showLabel?: boolean;
  animated?: boolean;
}
```

## 🎯 Navigation Components

### Breadcrumb Component

Navigation breadcrumb component.

**Props:**
```typescript
interface BreadcrumbProps {
  items: Array<{
    label: string;
    href?: string;
    onClick?: () => void;
  }>;
  separator?: React.ReactNode;
}
```

### Pagination Component

Pagination control component.

**Props:**
```typescript
interface PaginationProps {
  current: number;
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
}
```

### Tabs Component

Tab navigation component.

**Props:**
```typescript
interface TabsProps {
  activeTab: string;
  onChange: (tab: string) => void;
  tabs: Array<{
    key: string;
    label: string;
    content: React.ReactNode;
  }>;
  variant?: 'default' | 'pills' | 'underline';
}
```

## 🔔 Feedback Components

### Alert Component

Alert messages and notifications.

**Props:**
```typescript
interface AlertProps {
  type: 'success' | 'warning' | 'error' | 'info';
  title?: string;
  message: string;
  closable?: boolean;
  onClose?: () => void;
  actions?: React.ReactNode;
}
```

### Toast Component

Toast notification system.

**Props:**
```typescript
interface ToastProps {
  type: 'success' | 'warning' | 'error' | 'info';
  title?: string;
  message: string;
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}
```

### Tooltip Component

Hover tooltip component.

**Props:**
```typescript
interface TooltipProps {
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  trigger?: 'hover' | 'click' | 'focus';
  children: React.ReactNode;
}
```

## 🎨 Layout Components

### Container Component

Responsive container with max-width constraints.

**Props:**
```typescript
interface ContainerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: boolean;
  children: React.ReactNode;
}
```

### Grid Component

CSS Grid layout component.

**Props:**
```typescript
interface GridProps {
  columns?: number | { sm?: number; md?: number; lg?: number };
  gap?: number;
  children: React.ReactNode;
}
```

### Flex Component

Flexbox layout component.

**Props:**
```typescript
interface FlexProps {
  direction?: 'row' | 'column';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  align?: 'start' | 'center' | 'end' | 'stretch';
  wrap?: boolean;
  gap?: number;
  children: React.ReactNode;
}
```

## 📱 Responsive Utilities

### Breakpoints

```css
/* Mobile */
@media (max-width: 640px) { ... }

/* Tablet */
@media (min-width: 641px) and (max-width: 1024px) { ... }

/* Desktop */
@media (min-width: 1025px) { ... }

/* Large Desktop */
@media (min-width: 1280px) { ... }
```

### Responsive Props

Many components support responsive props:

```tsx
<Grid columns={{ sm: 1, md: 2, lg: 3 }}>
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
</Grid>
```

## ♿ Accessibility Guidelines

### ARIA Labels

All interactive components include proper ARIA labels:

```tsx
<Button aria-label="Close modal">
  <CloseIcon />
</Button>
```

### Keyboard Navigation

Components support keyboard navigation:
- **Tab**: Navigate between interactive elements
- **Enter/Space**: Activate buttons and links
- **Escape**: Close modals and dropdowns
- **Arrow keys**: Navigate lists and menus

### Focus Management

Focus indicators are clearly visible and focus is managed properly in modals and complex components.

### Color Contrast

All text and interactive elements meet WCAG AA color contrast requirements (4.5:1 for normal text, 3:1 for large text).

## 🧪 Testing Components

### Unit Testing

Example test for Button component:

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<Button loading>Submit</Button>);
    expect(screen.getByText('Submit')).toBeDisabled();
  });
});
```

### Visual Regression Testing

Use Storybook for component development and visual testing:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import Button from './Button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Button',
  },
};

export const Loading: Story = {
  args: {
    variant: 'primary',
    loading: true,
    children: 'Loading...',
  },
};
```

## 🎯 Best Practices

### Component Development

1. **Single Responsibility**: Each component should have one clear purpose
2. **Composition over Inheritance**: Prefer composing smaller components
3. **Props Interface**: Always define TypeScript interfaces for props
4. **Default Props**: Provide sensible defaults for optional props
5. **Error Boundaries**: Wrap components that might fail

### Performance Optimization

1. **React.memo**: Memoize components that receive stable props
2. **useMemo/useCallback**: Memoize expensive calculations and functions
3. **Lazy Loading**: Load components only when needed
4. **Bundle Splitting**: Keep component bundles small

### Styling Guidelines

1. **Utility Classes**: Use Tailwind utility classes for styling
2. **Custom CSS**: Use CSS modules for component-specific styles
3. **Responsive Design**: Design mobile-first with responsive breakpoints
4. **Dark Mode**: Consider dark mode support in component design

## 📦 Component Library Usage

### Installation

Components are already included in both applications. Import them from the ui directory:

```tsx
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
```

### Customization

Components can be customized through:
1. **Props**: Pass different variants, sizes, and options
2. **CSS Classes**: Add custom classes for additional styling
3. **Theme Variables**: Modify CSS custom properties for global changes
4. **Component Extension**: Create new components that extend existing ones

### Documentation

Each component includes:
- TypeScript prop definitions
- Usage examples
- Accessibility notes
- Testing examples
- Storybook stories

---

## 🤝 Contributing to Components

### Adding New Components

1. Create component file in appropriate directory
2. Define TypeScript interface for props
3. Implement component with accessibility in mind
4. Add unit tests
5. Create Storybook story
6. Update documentation

### Component Guidelines

- Follow existing naming conventions
- Include proper TypeScript types
- Add accessibility attributes
- Support responsive design
- Include comprehensive tests
- Document usage examples

---

**Component Library** - Building consistent, accessible, and reusable UI components for the SkillUp platform.
