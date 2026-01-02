# Webflow Style Guide Implementation

This document tracks the implementation of the Webflow Client-First style guide in the Astro project.

## Source
Style guide extracted from: https://lakshayas-business-websit-29830f6cf62e0.webflow.io/style-guide

## Implemented Classes

### Heading Classes
- `.heading-xxlarge` - 64px (4rem), bold, line-height 1.1
- `.heading-xlarge` - 48px (3rem), bold, line-height 1.2
- `.heading-large` - 32px (2rem), semibold, line-height 1.3
- `.heading-medium` - 24px (1.5rem), semibold, line-height 1.4
- `.heading-small` - 20px (1.25rem), semibold, line-height 1.5
- `.heading-xsmall` - 18px (1.125rem), semibold, line-height 1.5

### Text Size Classes
- `.text-size-large` - 18px (1.125rem), line-height 1.6
- `.text-size-medium` - 16px (1rem), line-height 1.6
- `.text-size-regular` - 16px (1rem), line-height 1.6
- `.text-size-small` - 14px (0.875rem), line-height 1.5
- `.text-size-tiny` - 12px (0.75rem), line-height 1.5

### Text Style Classes
- `.text-style-strikethrough` - Strikethrough text
- `.text-style-italic` - Italic text
- `.text-style-muted` - Muted gray color with opacity
- `.text-style-allcaps` - Uppercase with letter spacing
- `.text-style-nowrap` - No text wrapping
- `.text-style-link` - Link styling with primary color
- `.text-style-quote` - Quote block with left border
- `.text-style-2lines` - Clamp to 2 lines
- `.text-style-3lines` - Clamp to 3 lines

### Text Weight Classes
- `.text-weight-xbold` - Font weight 900
- `.text-weight-bold` - Font weight 700
- `.text-weight-semibold` - Font weight 600
- `.text-weight-medium` - Font weight 500
- `.text-weight-normal` - Font weight 400
- `.text-weight-light` - Font weight 300

### Text Alignment Classes
- `.text-align-left` - Left align
- `.text-align-center` - Center align
- `.text-align-right` - Right align

### Text Color Classes
- `.text-color-grey` - Gray text color (#6b7280)
- `.text-color-black` - Black text color (#000000)

### Button Classes
- `.button` - Primary button (blue background, white text, rounded-4xl)
- `.button-secondary` - Secondary button (white background, blue border)
- `.button-text` - Text button (underlined link style)
- `.button.on-blue` - Button variant for blue backgrounds

### Utility Classes
- `.align-center` - Center alignment
- `.mobile-center` - Center on mobile, left on desktop
- `.bold` - Bold font weight
- `.no-wrap` - No text wrapping

### Component-Specific Classes
- `.hero-heading` - Hero section heading style
- `.hero-para` - Hero section paragraph style
- `.text-subheading` - Subheading text style
- `.why-sub-para` - Why section paragraph style
- `.sub-head` - Sub heading style
- `.category-item-heading` - Category item heading
- `.category-item-desc` - Category item description
- `.testimonial-text` - Testimonial text style
- `.testimonial-name` - Testimonial author name
- `.footer-para` - Footer paragraph
- `.footer-heading-h4` - Footer heading
- `.footer-link` - Footer link
- `.footer-text-link` - Footer text link

## Color Palette

### Primary Colors
- Primary Blue: `#0a98e5` (primary-500)
- Dark Blue: `#016295` (primary-600)
- Dark Background: `#013a59` (primary-700)

### Accent Colors
- Red: `#f82c2d`
- Orange: `#e2814b`
- Yellow: `#e2a64b`
- Green: `#41b937`
- Teal: `#0baa97`

### Text Colors
- Black: `#000000`
- Grey: `#6b7280`

## Typography

### Font Family
- Primary: Inter (Google Fonts)
- Weights: 300, 400, 500, 600, 700, 800, 900

### Font Sizes
All sizes are defined in rem units for scalability:
- XXLarge: 4rem (64px)
- XLarge: 3rem (48px)
- Large: 2rem (32px)
- Medium: 1.5rem (24px)
- Small: 1.25rem (20px)
- XSmall: 1.125rem (18px)

## Usage Examples

### Headings
```html
<h1 class="heading-xxlarge">Main Heading</h1>
<h2 class="heading-large">Section Heading</h2>
<h3 class="heading-medium">Subsection Heading</h3>
```

### Text
```html
<p class="text-size-medium text-weight-normal">Regular paragraph text</p>
<p class="text-size-large text-weight-semibold">Large emphasized text</p>
```

### Buttons
```html
<a href="#" class="button">Primary Button</a>
<a href="#" class="button-secondary">Secondary Button</a>
<a href="#" class="button-text">Text Link</a>
```

### Text Styles
```html
<p class="text-style-muted">Muted text</p>
<p class="text-style-italic">Italic text</p>
<p class="text-style-allcaps">UPPERCASE TEXT</p>
```

## Files

- `public/styles/webflow-typography.css` - Typography and text utility classes
- `public/styles/webflow-styles.css` - Additional utility classes (if needed)
- `tailwind.config.mjs` - Tailwind configuration with extended font sizes and weights

## Integration

The styles are automatically loaded in `BaseLayout.astro`:
```astro
<link rel="stylesheet" href="/styles/webflow-typography.css" />
<link rel="stylesheet" href="/styles/webflow-styles.css" />
```

## Next Steps

1. Extract exact color values from Webflow variables
2. Update color palette in Tailwind config
3. Apply classes throughout the project
4. Test responsive behavior
5. Match spacing and layout values




