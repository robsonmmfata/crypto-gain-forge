# Error Component

A modern, beautiful, and highly customizable error component for React applications.

## Features

✨ **Modern Design**: Beautiful gradients, animations, and modern UI elements
🎨 **Multiple Error Types**: Support for 404, 500, network, auth, and custom errors
🎭 **Animated Elements**: Floating particles, geometric shapes, and smooth transitions
📱 **Responsive**: Works perfectly on all screen sizes
🌙 **Theme Support**: Automatic dark/light mode support
🔧 **Highly Customizable**: Extensive props for customization
🎯 **TypeScript**: Full TypeScript support with proper types

## Installation

The component is already created in your project. Simply import it:

```tsx
import ErrorComponent from '@/components/errorComp/ErrorComponent';
```

## Usage

### Basic Usage

```tsx
import ErrorComponent from '@/components/errorComp/ErrorComponent';

function MyComponent() {
  return (
    <ErrorComponent
      type="404"
      onGoHome={() => navigate('/')}
      onGoBack={() => navigate(-1)}
    />
  );
}
```

### Advanced Usage

```tsx
import ErrorComponent from '@/components/errorComp/ErrorComponent';

function MyComponent() {
  const handleRetry = () => {
    // Your retry logic here
    console.log('Retrying...');
  };

  const handleGoHome = () => {
    // Navigate to home
    navigate('/');
  };

  return (
    <ErrorComponent
      type="network"
      title="Connection Failed"
      message="Unable to connect to the server. Please check your internet connection."
      onRetry={handleRetry}
      onGoHome={handleGoHome}
      showBack={false}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'404' \| '500' \| 'network' \| 'auth' \| 'generic'` | `'generic'` | The type of error to display |
| `title` | `string` | Auto-generated | Custom error title |
| `message` | `string` | Auto-generated | Custom error message |
| `onRetry` | `() => void` | `undefined` | Callback for retry button |
| `onGoHome` | `() => void` | `undefined` | Callback for home button |
| `onGoBack` | `() => void` | `undefined` | Callback for back button |
| `showRetry` | `boolean` | `true` | Show retry button |
| `showHome` | `boolean` | `true` | Show home button |
| `showBack` | `boolean` | `true` | Show back button |

## Error Types

### 404 - Page Not Found
```tsx
<ErrorComponent type="404" />
```
- Icon: Globe
- Gradient: Blue to Cyan
- Message: "The page you're looking for doesn't exist or has been moved."

### 500 - Server Error
```tsx
<ErrorComponent type="500" />
```
- Icon: Server
- Gradient: Red to Pink
- Message: "An internal server error occurred. Please try again later."

### Network Error
```tsx
<ErrorComponent type="network" />
```
- Icon: WiFi
- Gradient: Orange to Yellow
- Message: "Unable to connect to the server. Please check your internet connection."

### Auth Error
```tsx
<ErrorComponent type="auth" />
```
- Icon: Shield
- Gradient: Purple to Indigo
- Message: "You don't have permission to access this page."

### Generic Error
```tsx
<ErrorComponent type="generic" />
```
- Icon: Bug
- Gradient: Gray to Slate
- Message: "Something went wrong. Please try again."

## Customization Examples

### Custom Title and Message
```tsx
<ErrorComponent
  type="generic"
  title="Oops! Something broke"
  message="We encountered an unexpected error. Our team has been notified."
/>
```

### Minimal Configuration
```tsx
<ErrorComponent
  type="404"
  showRetry={false}
  showBack={false}
  onGoHome={() => navigate('/')}
/>
```

### Full Control
```tsx
<ErrorComponent
  type="network"
  title="No Internet Connection"
  message="Please check your WiFi or mobile data and try again."
  onRetry={handleRetry}
  onGoHome={handleGoHome}
  onGoBack={handleGoBack}
  showRetry={true}
  showHome={true}
  showBack={true}
/>
```

## Styling

The component uses Tailwind CSS classes and supports your theme configuration:

- **Background**: Uses your theme's background colors
- **Cards**: Uses your theme's card colors with backdrop blur
- **Gradients**: Custom gradients for each error type
- **Animations**: CSS animations for smooth transitions
- **Icons**: Lucide React icons with theme-aware colors

## Accessibility

- Semantic HTML structure
- Proper ARIA labels
- Keyboard navigation support
- Screen reader friendly
- High contrast support

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Requires CSS Grid and Flexbox support

## Examples

See `ErrorExamples.tsx` for complete usage examples with all error types and configurations.

## Contributing

To modify the component:

1. Edit `ErrorComponent.tsx` for the main component
2. Update `index.ts` for exports
3. Add examples to `ErrorExamples.tsx`
4. Update this README for documentation

## License

This component is part of your project and follows your project's license.
