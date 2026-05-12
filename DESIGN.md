---
name: Story Pros Visual Identity
colors:
  surface: '#f7f9fc'
  surface-dim: '#d8dadd'
  surface-bright: '#f7f9fc'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f7'
  surface-container: '#eceef1'
  surface-container-high: '#e6e8eb'
  surface-container-highest: '#e0e3e6'
  on-surface: '#191c1e'
  on-surface-variant: '#4a4452'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f4'
  outline: '#7c7484'
  outline-variant: '#ccc3d4'
  surface-tint: '#7343bb'
  primary: '#521d99'
  on-primary: '#ffffff'
  primary-container: '#6a3ab2'
  on-primary-container: '#dac1ff'
  inverse-primary: '#d6baff'
  secondary: '#785900'
  on-secondary: '#ffffff'
  secondary-container: '#fdc003'
  on-secondary-container: '#6c5000'
  tertiary: '#004a10'
  on-tertiary: '#ffffff'
  tertiary-container: '#006519'
  on-tertiary-container: '#7ee27c'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ecdcff'
  primary-fixed-dim: '#d6baff'
  on-primary-fixed: '#270057'
  on-primary-fixed-variant: '#5a27a1'
  secondary-fixed: '#ffdf9e'
  secondary-fixed-dim: '#fabd00'
  on-secondary-fixed: '#261a00'
  on-secondary-fixed-variant: '#5b4300'
  tertiary-fixed: '#94f990'
  tertiary-fixed-dim: '#78dc77'
  on-tertiary-fixed: '#002204'
  on-tertiary-fixed-variant: '#005313'
  background: '#f7f9fc'
  on-background: '#191c1e'
  surface-variant: '#e0e3e6'
typography:
  display-lg:
    fontFamily: Lexend
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Lexend
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-md:
    fontFamily: Lexend
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Lexend
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Lexend
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-bold:
    fontFamily: Lexend
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 64px
  container-max: 1200px
  gutter: 24px
---

## Brand & Style

This design system is built on a foundation of "Playful Clarity." It is designed to foster a sense of wonder and safety for an educational audience, balancing high-energy vibrancy with structured, accessible layouts. The brand personality is encouraging, imaginative, and dependable.

The visual style utilizes a **Tactile-Minimalist** approach. It leverages the cleanliness of modern SaaS interfaces—heavy whitespace and clear content grouping—but injects warmth through "squishy" rounded corners, soft ambient shadows, and friendly mascot interactions. The presence of Dan and Daria provides a narrative thread throughout the user journey, making the interface feel like a guided adventure rather than a static tool. The primary emotional response should be one of "effortless discovery."

## Colors

The palette is driven by a high-contrast relationship between **Vibrant Purple** and **Golden Yellow**. Purple serves as the primary brand anchor, used for headers, navigation, and primary button backgrounds to instill a sense of creative authority. Yellow is the functional "spark," reserved for call-to-action elements, achievement highlights, and interactive feedback.

To maintain accessibility, the text primary color is a deep, desaturated indigo rather than pure black, ensuring high legibility while softening the visual strain. A tertiary "Success Green" is included for educational progress indicators. Backgrounds should remain light and airy, primarily using pure white surfaces on a very light grey-blue base to create depth.

## Typography

The design system exclusively utilizes **Lexend**, a font family specifically engineered to reduce visual stress and improve reading performance. Its rounded terminals and humanist proportions align perfectly with the friendly, educational aesthetic.

Headlines should use the Bold or SemiBold weights with tighter letter spacing to create a punchy, confident "editorial" feel. Body text relies on the Regular weight with generous line heights (1.5x) to ensure the interface remains approachable for younger readers or those in a learning environment. Labels for UI components like chips and small buttons should use the SemiBold weight to maintain high contrast against colorful backgrounds.

## Layout & Spacing

The layout philosophy follows a **Fixed-Fluid Hybrid** model. Content is housed within a 1200px max-width container for desktop viewing to maintain optimal line lengths for reading, while the inner grid remains fluid to adapt to tablet and mobile screens.

A strict 8px rhythmic grid governs all spacing decisions. Consistent padding of 24px (md) is used for standard card interiors and section gutters to ensure the UI feels "breathable." Large vertical gaps of 64px (xl) are encouraged between major content sections to prevent the playful elements from feeling cluttered.

## Elevation & Depth

Hierarchy in this design system is established through **Ambient Shadows** and tonal layering. Rather than using harsh, dark shadows, this system employs soft, diffused drop shadows with a slight purple tint (`rgba(106, 58, 178, 0.08)`) to make elements feel like they are floating gently above the surface.

- **Level 0 (Base):** Light grey background surfaces.
- **Level 1 (Cards):** White surfaces with a 16px blur shadow.
- **Level 2 (Interactive):** Elements that lift on hover, increasing shadow spread.
- **Level 3 (Modals/Popovers):** Highest elevation with a backdrop blur (glassmorphism) applied to the layer beneath to maintain context while focusing attention.

## Shapes

The shape language is defined by extreme softness. All primary containers (cards, modals, images) must use a corner radius between **16px and 24px**. This high degree of roundedness removes "sharpness" from the UI, making it feel safe and welcoming.

Buttons and input fields should follow a consistent 12px to 16px radius. Smaller elements like chips or tags may utilize a full pill-shape (999px radius). The "Story Pros" logo icon—the paper airplane book—should serve as the inspiration for any custom iconography, featuring slightly rounded points and thick, consistent stroke weights.

## Components

### Buttons
Primary buttons are solid Vibrant Purple with white text. Secondary buttons (CTAs) are Golden Yellow with the Deep Indigo text. All buttons should feature a subtle 2px bottom "border" of a darker shade to create a tactile, pressable 3D effect.

### Cards
Cards are the primary content vessel. They must have a white background, 24px corner radius, and a soft ambient shadow. For educational content, cards can feature a top "accent bar" in Golden Yellow or Vibrant Purple.

### Mascots (Dan & Daria)
Dan and Daria should be used as functional UI elements, not just decoration. They appear in empty states, onboarding flows, and as "celebratory" overlays when a user completes a task. Their placement should be slightly offset or "breaking the container" of cards to add dynamic energy.

### Input Fields
Inputs should have a thick 2px border in a light grey-purple, shifting to a solid Vibrant Purple border when focused. The 16px rounded corners must be maintained to match the overall shape language.

### Progress Bars
Educational progress is tracked using thick, rounded bars. The "track" is a pale purple, while the "fill" is a vibrant green or yellow, featuring a rounded cap on the leading edge.