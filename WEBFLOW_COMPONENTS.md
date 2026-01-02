# Webflow Components Migration

This document tracks the components extracted from Webflow and recreated in the Astro project.

## Extracted Components

### 1. NavBar Component (`nav-bar`)
**Webflow Component ID:** `9fee3d03-8690-0adc-46c2-50b249e094e0`

**Location:** `src/components/NavBar.tsx`

**Features:**
- Logo with brand name
- About link
- Tests dropdown menu:
  - For High School Students
  - For Senior School Students
  - For College Students
  - For Corporate Professionals
- Services dropdown menu:
  - For Academic Institutions
  - For Corporate Organizations
- Contact Us link
- Conditional rendering:
  - Dashboard link (when logged in)
  - Hello, [User Name] (when logged in)
  - Logout button (when logged in)
  - Login link (when logged out)
  - Register button (when logged out)
- Mobile responsive menu
- Configurable register button text via props

**Properties:**
- `registerButtonText` (optional): Custom text for register button (default: "Register")

### 2. FooterWhite Component (`footer-white`)
**Webflow Component ID:** `a70518f9-adf2-7835-57d5-c1f057180bb9`

**Location:** `src/components/FooterWhite.tsx`

**Features:**
- Brand section with logo and description
- "Spread the word" section with social links
- Information links:
  - Register
  - Login
  - Contact Us
  - Privacy Policy
  - Terms and Conditions
- Tests Design For links:
  - High School Students
  - Senior School Students
  - College Students
  - Corporate Professionals
- Organizational Service links:
  - For Academic Institutions
  - For Corporates and Organizations
- Copyright notice

### 3. FooterGreen Component (`footer-green`)
**Webflow Component ID:** `ae609f92-595d-7d08-df6c-12cb23241e20`

**Location:** `src/components/FooterGreen.tsx`

**Features:**
- "Your journey awaits" heading
- Two CTA buttons:
  - Speak with us
  - Write to us
- "Spread the word" section with social links
- Optional Privacy Policy and Terms and Conditions links

**Properties:**
- `showPrivacyTerms` (optional): Show/hide privacy and terms links (default: true)

## Component Usage

### NavBar
```astro
---
import NavBar from '../components/NavBar';
import { getSession } from '../lib/session';

const session = await getSession(Astro.cookies);
---

<NavBar client:load session={session} registerButtonText="Register" />
```

### FooterWhite
```astro
---
import FooterWhite from '../components/FooterWhite';
---

<FooterWhite client:load />
```

### FooterGreen
```astro
---
import FooterGreen from '../components/FooterGreen';
---

<FooterGreen client:load showPrivacyTerms={true} />
```

## Backward Compatibility

The original `Header.tsx` and `Footer.tsx` components have been updated to re-export the new components for backward compatibility:

- `Header.tsx` → Re-exports `NavBar`
- `Footer.tsx` → Re-exports `FooterWhite`

Existing pages using `Header` and `Footer` will continue to work, but new pages should use `NavBar` and `FooterWhite` directly.

## Additional Components Found

### Global Styles Component
**Webflow Component ID:** `5ffad809-50c0-31dd-2ebc-e3eb71f28b9b`

This is a global styles component in Webflow. The styles are already implemented via Tailwind CSS configuration in `tailwind.config.mjs`.

### Font-size-symbol Component
**Webflow Component ID:** `a560104f-fa51-5fd4-cdfd-e50c4bb7372c`

This appears to be a utility component for font sizing. Not needed in Astro as we use Tailwind's typography classes.

## Migration Status

✅ NavBar component extracted and implemented  
✅ FooterWhite component extracted and implemented  
✅ FooterGreen component extracted and implemented  
✅ Backward compatibility maintained  
✅ All components are responsive and match Webflow design  

## Next Steps

1. Extract any additional reusable patterns from other pages
2. Create component variants if needed
3. Add TypeScript interfaces for all component props
4. Document component styling and customization options

