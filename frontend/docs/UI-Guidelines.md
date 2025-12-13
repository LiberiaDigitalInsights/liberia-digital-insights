# UI Guidelines

## 🎨 Overview

This guide outlines the UI design principles, component usage patterns, and styling guidelines for Liberia Digital Insights. These guidelines ensure consistency across the platform and provide a cohesive user experience.

## 🎯 Design Principles

### 1. User-Centered Design

- Prioritize user needs and goals
- Create intuitive and predictable interfaces
- Provide clear feedback for user actions
- Ensure accessibility for all users

### 2. Consistency

- Maintain visual consistency across all pages
- Use consistent interaction patterns
- Apply consistent typography and spacing
- Follow established component patterns

### 3. Simplicity

- Keep interfaces clean and uncluttered
- Use clear and concise language
- Minimize cognitive load
- Focus on essential functionality

### 4. Responsiveness

- Design for all screen sizes
- Optimize for mobile-first experience
- Ensure touch-friendly interactions
- Adapt layouts gracefully

## 🎨 Design System

### Color Palette

#### Primary Colors

```css
/* Brand Colors */
--color-brand-50: #eff6ff;
--color-brand-100: #dbeafe;
--color-brand-200: #bfdbfe;
--color-brand-300: #93c5fd;
--color-brand-400: #60a5fa;
--color-brand-500: #3b82f6; /* Primary brand color */
--color-brand-600: #2563eb;
--color-brand-700: #1d4ed8;
--color-brand-800: #1e40af;
--color-brand-900: #1e3a8a;
```

#### Neutral Colors

```css
/* Gray Scale */
--color-gray-50: #f9fafb;
--color-gray-100: #f3f4f6;
--color-gray-200: #e5e7eb;
--color-gray-300: #d1d5db;
--color-gray-400: #9ca3af;
--color-gray-500: #6b7280;
--color-gray-600: #4b5563;
--color-gray-700: #374151;
--color-gray-800: #1f2937;
--color-gray-900: #111827;
```

#### Semantic Colors

```css
/* Status Colors */
--color-success: #10b981;
--color-warning: #f59e0b;
--color-error: #ef4444;
--color-info: #3b82f6;
```

### Typography

#### Font Family

```css
/* Primary Font */
--font-family-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

/* Monospace Font */
--font-family-mono: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
```

#### Font Scale

```css
/* Typography Scale */
--text-xs: 0.75rem; /* 12px */
--text-sm: 0.875rem; /* 14px */
--text-base: 1rem; /* 16px */
--text-lg: 1.125rem; /* 18px */
--text-xl: 1.25rem; /* 20px */
--text-2xl: 1.5rem; /* 24px */
--text-3xl: 1.875rem; /* 30px */
--text-4xl: 2.25rem; /* 36px */
--text-5xl: 3rem; /* 48px */
```

#### Font Weights

```css
--font-weight-light: 300;
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

### Spacing

#### Spacing Scale

```css
/* Spacing Scale (based on 4px base unit) */
--space-1: 0.25rem; /* 4px */
--space-2: 0.5rem; /* 8px */
--space-3: 0.75rem; /* 12px */
--space-4: 1rem; /* 16px */
--space-5: 1.25rem; /* 20px */
--space-6: 1.5rem; /* 24px */
--space-8: 2rem; /* 32px */
--space-10: 2.5rem; /* 40px */
--space-12: 3rem; /* 48px */
--space-16: 4rem; /* 64px */
--space-20: 5rem; /* 80px */
--space-24: 6rem; /* 96px */
```

### Border Radius

```css
/* Border Radius */
--radius-sm: 0.125rem; /* 2px */
--radius-base: 0.25rem; /* 4px */
--radius-md: 0.375rem; /* 6px */
--radius-lg: 0.5rem; /* 8px */
--radius-xl: 0.75rem; /* 12px */
--radius-2xl: 1rem; /* 16px */
--radius-full: 9999px;
```

### Shadows

```css
/* Shadow Scale */
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-base: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
```

## 🧩 Component Guidelines

### Buttons

#### Primary Button

```jsx
<Button variant="primary" size="md">
  Primary Action
</Button>

// Tailwind classes
bg-brand-500 text-white px-4 py-2 rounded-lg hover:bg-brand-600
```

#### Secondary Button

```jsx
<Button variant="secondary" size="md">
  Secondary Action
</Button>

// Tailwind classes
bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200
```

#### Outline Button

```jsx
<Button variant="outline" size="md">
  Outline Action
</Button>

// Tailwind classes
border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50
```

#### Button Sizes

```jsx
<Button size="sm">Small</Button>   // px-3 py-1.5 text-sm
<Button size="md">Medium</Button>  // px-4 py-2 text-base
<Button size="lg">Large</Button>   // px-6 py-3 text-lg
```

### Forms

#### Input Fields

```jsx
<Input
  type="text"
  placeholder="Enter your name"
  label="Full Name"
  error={errorMessage}
  required
/>

// Base classes
w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500
```

#### Text Areas

```jsx
<Textarea
  placeholder="Enter your message"
  rows={4}
  label="Message"
/>

// Base classes
w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 resize-vertical
```

#### Select Dropdowns

```jsx
<Select
  options={options}
  placeholder="Select an option"
  label="Category"
/>

// Base classes
w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white
```

### Cards

#### Article Card

```jsx
<ArticleCard
  article={article}
  showAuthor={true}
  showCategory={true}
/>

// Base classes
bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200
```

#### Event Card

```jsx
<EventCard
  event={event}
  showRegistration={true}
/>

// Base classes
bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200
```

### Navigation

#### Header Navigation

```jsx
<Header />
// Base classes
bg-white shadow-sm border-b border-gray-200
```

#### Footer

```jsx
<Footer />
// Base classes
bg-gray-900 text-white border-t border-gray-800
```

### Modals

#### Base Modal

```jsx
<Modal
  isOpen={isOpen}
  onClose={onClose}
  title="Modal Title"
>

// Base classes
fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50
```

#### Modal Content

```jsx
// Base classes
bg-white rounded-lg shadow-xl max-w-md mx-auto mt-20 p-6
```

## 📱 Responsive Design

### Breakpoints

```css
/* Responsive Breakpoints */
--breakpoint-sm: 640px; /* Small screens */
--breakpoint-md: 768px; /* Medium screens */
--breakpoint-lg: 1024px; /* Large screens */
--breakpoint-xl: 1280px; /* Extra large screens */
--breakpoint-2xl: 1536px; /* 2X large screens */
```

### Grid System

#### Mobile (Default)

```jsx
<div className="grid grid-cols-1 gap-4">{/* Single column on mobile */}</div>
```

#### Tablet

```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{/* 2 columns on tablet */}</div>
```

#### Desktop

```jsx
<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
  {/* 3-4 columns on desktop */}
</div>
```

### Responsive Typography

```jsx
<h1 className="text-2xl md:text-3xl lg:text-4xl">
  Responsive heading
</h1>

<p className="text-sm md:text-base lg:text-lg">
  Responsive text
</p>
```

## 🎭 Animation Guidelines

### Transitions

#### Hover Effects

```css
/* Standard hover transition */
transition-all duration-200 ease-in-out
```

#### Focus States

```css
/* Focus ring */
focus:ring-2 focus:ring-brand-500 focus:ring-offset-2
```

### Animations

#### Loading States

```jsx
<LoadingSpinner />
// Base classes
animate-spin rounded-full border-2 border-gray-300 border-t-brand-500
```

#### Fade In

```jsx
<div className="animate-fade-in">
  Content
</div>

// CSS
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
```

#### Slide Up

```jsx
<div className="animate-slide-up">
  Content
</div>

// CSS
@keyframes slide-up {
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
```

## 🖼️ Image Guidelines

### Image Ratios

#### Square (1:1)

```jsx
<div className="aspect-w-1 aspect-h-1">
  <img src={image} alt="Description" />
</div>
```

#### Landscape (16:9)

```jsx
<div className="aspect-w-16 aspect-h-9">
  <img src={image} alt="Description" />
</div>
```

#### Portrait (4:5)

```jsx
<div className="aspect-w-4 aspect-h-5">
  <img src={image} alt="Description" />
</div>
```

### Image Optimization

#### Lazy Loading

```jsx
<img src={image} loading="lazy" alt="Description" className="w-full h-auto object-cover" />
```

#### Responsive Images

```jsx
<img
  src={image}
  srcSet={`${imageSmall} 400w, ${imageMedium} 800w, ${imageLarge} 1200w`}
  sizes="(max-width: 768px) 400px, (max-width: 1024px) 800px, 1200px"
  alt="Description"
/>
```

## ♿ Accessibility Guidelines

### Semantic HTML

#### Headings

```jsx
// Proper heading hierarchy
<h1>Main Title</h1>
<h2>Section Title</h2>
<h3>Subsection Title</h3>
```

#### Landmarks

```jsx
<header role="banner">
  <nav aria-label="Main navigation">
    {/* Navigation */}
  </nav>
</header>

<main role="main">
  {/* Main content */}
</main>

<aside role="complementary">
  {/* Sidebar content */}
</aside>

<footer role="contentinfo">
  {/* Footer content */}
</footer>
```

### ARIA Labels

#### Buttons

```jsx
<button aria-label="Close modal" onClick={onClose}>
  <XIcon />
</button>
```

#### Forms

```jsx
<label htmlFor="email">Email Address</label>
<input
  id="email"
  type="email"
  aria-describedby="email-help"
  aria-invalid={hasError}
/>
<div id="email-help" className="text-sm text-gray-600">
  We'll never share your email with anyone else.
</div>
```

### Keyboard Navigation

#### Focus Management

```jsx
// Trap focus in modal
useEffect(() => {
  if (isOpen) {
    const focusableElements = modalRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    const firstElement = focusableElements[0];
    firstElement?.focus();
  }
}, [isOpen]);
```

#### Skip Links

```jsx
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4"
>
  Skip to main content
</a>
```

## 🎨 Color Usage Guidelines

### Primary Actions

- Use brand-500 for primary buttons and links
- Use brand-600 for hover states
- Use brand-700 for active states

### Secondary Actions

- Use gray-100 for secondary buttons
- Use gray-200 for hover states
- Use gray-300 for active states

### Status Indicators

- Success: green-500 for positive feedback
- Warning: yellow-500 for caution
- Error: red-500 for errors and warnings
- Info: blue-500 for informational messages

### Text Colors

- Primary text: gray-900
- Secondary text: gray-600
- Muted text: gray-500
- Links: brand-500

## 📐 Layout Guidelines

### Container Widths

```jsx
// Standard container
<div className="container mx-auto px-4 sm:px-6 lg:px-8">
  {/* Content */}
</div>

// Wide container
<div className="container-wide mx-auto px-4 sm:px-6 lg:px-8">
  {/* Content */}
</div>
```

### Section Spacing

```jsx
<section className="py-12 md:py-16 lg:py-20">{/* Section content */}</section>
```

### Card Grids

```jsx
// 2-4 column grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {/* Cards */}
</div>
```

## 🔧 Implementation Tips

### Component Structure

```jsx
// Use consistent component structure
function ComponentName({ prop1, prop2, ...props }) {
  return (
    <div className="component-base-classes" {...props}>
      {/* Component content */}
    </div>
  );
}
```

### Class Organization

```jsx
// Organize Tailwind classes logically
<div
  className="
  // Layout
  flex flex-col space-y-4
  
  // Sizing
  w-full h-auto
  
  // Typography
  text-sm font-medium text-gray-700
  
  // Colors
  bg-white border border-gray-200
  
  // Borders & Radius
  rounded-lg shadow-sm
  
  // States
  hover:shadow-md focus:ring-2 focus:ring-brand-500
  
  // Transitions
  transition-all duration-200
"
>
  {/* Content */}
</div>
```

### Responsive Class Order

```jsx
// Mobile-first approach
<div
  className="
  // Mobile (default)
  grid-cols-1 gap-4 p-4
  
  // Tablet
  sm:grid-cols-2 sm:gap-6 sm:p-6
  
  // Desktop
  lg:grid-cols-3 lg:gap-8 lg:p-8
  
  // Large desktop
  xl:grid-cols-4
"
>
  {/* Content */}
</div>
```

## 🧪 Testing UI Components

### Visual Testing

- Test components at different screen sizes
- Verify hover and focus states
- Check color contrast ratios
- Test with various content lengths

### Accessibility Testing

- Test keyboard navigation
- Verify screen reader compatibility
- Check ARIA labels and roles
- Test color-only indicators

### Cross-browser Testing

- Test in modern browsers
- Verify consistent rendering
- Check fallbacks for older browsers
- Test on mobile devices

## 📚 Resources

### Design Tools

- [Figma](https://www.figma.com/) - Design and prototyping
- [Tailwind UI](https://tailwindui.com/) - Component library
- [Headless UI](https://headlessui.com/) - Unstyled components

### Accessibility Tools

- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

### Inspiration

- [Dribbble](https://dribbble.com/) - Design inspiration
- [Awwwards](https://www.awwwards.com/) - Award-winning designs
- [Smashing Magazine](https://www.smashingmagazine.com/) - Design articles

These guidelines ensure a consistent, accessible, and professional user experience across the Liberia Digital Insights platform.
