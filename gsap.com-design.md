---
version: alpha
name: GSAP Animate
description: A high-contrast, performance-forward dark system with neon accents and oversized editorial typography.
colors:
  primary: "#fffce1"
  primary-strong: "#ffffff"
  secondary: "#ff8709"
  tertiary: "#18f24a"
  accent: "#ff8709"
  background: "#0e100f"
  surface: "#121412"
  on-surface: "#fffce1"
  muted: "#7d7f75"
  border: "#374151"
  success: "#18f24a"
  error: "#ff5a5f"
typography:
  headline-display:
    fontFamily: Mori
    fontSize: 81px
    fontWeight: 700
    lineHeight: 97px
    letterSpacing: 0px
  headline-lg:
    fontFamily: Mori
    fontSize: 54px
    fontWeight: 400
    lineHeight: 97px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Mori
    fontSize: 36px
    fontWeight: 400
    lineHeight: 43px
    letterSpacing: 0px
  headline-sm:
    fontFamily: Mori
    fontSize: 24px
    fontWeight: 400
    lineHeight: 43px
    letterSpacing: -0.02em
  body-lg:
    fontFamily: Mori
    fontSize: 22px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0px
  body-md:
    fontFamily: Mori
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: -0.03em
  body-sm:
    fontFamily: Mori
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: -0.02em
  label-lg:
    fontFamily: Mori
    fontSize: 22px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: 0px
  label-md:
    fontFamily: Mori
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: 0px
  label-sm:
    fontFamily: Mori
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: 0.06em
rounded:
  none: 0px
  sm: 4px
  md: 8px
  lg: 16px
  xl: 100px
  full: 9999px
spacing:
  xs: 10px
  sm: 20px
  md: 32px
  lg: 64px
  xl: 100px
components:
  button-primary:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.xl}"
    padding: "15px 24px"
    height: "53px"
  button-primary-hover:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary-strong}"
    rounded: "{rounded.xl}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.xl}"
    padding: "15px 24px"
    height: "53px"
  button-tertiary:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    typography: "{typography.body-lg}"
    rounded: "{rounded.none}"
    padding: "0px"
  card:
    backgroundColor: "{colors.background}"
    textColor: "{colors.primary}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "16px"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
  chip:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
    padding: "8px 12px"
# GSAP Animate

## Overview
GSAP feels bold, technical, and kinetic, with an editorial scale that immediately signals motion expertise. The dark backdrop, oversized type, and electric accent colors create a high-energy, professional tone aimed at developers, designers, and motion-led teams. Spacing is generous around the hero and tight in the header, balancing clarity with theatrical impact.

## Colors
- **Primary (#fffce1):** A warm ivory used for main text, buttons, and key UI highlights. It reads softer than pure white, preserving contrast without feeling sterile.
- **Secondary (#ff8709):** A vivid orange used as a brand accent for graphic moments and visual energy. It adds warmth and motion against the dark field.
- **Tertiary (#18f24a):** A neon green used for emphasis, success, and punchy call-to-action treatment. It should be reserved for high-attention moments.
- **Background (#0e100f):** A near-black charcoal that creates the site’s cinematic, immersive base. Most large sections should sit on this color.
- **Surface (#121412):** A slightly lifted dark surface for cards, controls, and inset panels. It should stay close to the background to preserve the flat, editorial look.
- **Muted (#7d7f75):** A subdued gray-green for secondary navigation and low-emphasis text. Use it sparingly so the primary ivory remains dominant.
- **Border (#374151):** A restrained border color for subtle separation in cards and inputs. It supports structure without adding shadow.
- **Success (#18f24a):** Shared with the tertiary neon green for positive status and energetic confirmation states.
- **Error (#ff5a5f):** A clear alert red for destructive or invalid states. It should appear only when necessary.

## Typography
GSAP uses Mori across the system, pairing a geometric feel with a polished, modern voice. Headings range from the dramatic 81px display size down to 24px section heads, all with light tracking adjustments that keep the forms crisp at large scale. Body copy remains compact and efficient, and labels use stronger weight for buttons and navigation so interactive elements stay legible in the dark environment. Uppercase styling is minimal; the brand relies more on scale, weight, and spacing than on all-caps treatment.

## Layout
The page uses a wide, fluid desktop canvas with a strong top navigation band and a hero that spans nearly the full viewport width. Content is aligned to a comfortable inner grid with large lateral breathing room, while the hero composition intentionally breaks symmetry for motion and excitement. Spacing follows a loose but consistent rhythm: 10px and 20px for micro-separation, 32px for grouped content, and 64px to 100px for major section breathing room. Cards, controls, and text blocks should favor roomy padding rather than dense packing.

## Elevation & Depth
The system is intentionally flat. Depth is created through contrast, borders, and tonal separation rather than shadows or blur. Thin outlines, bright text, and vivid accent colors provide hierarchy, while subtle surface shifts distinguish interactive areas from the page background. Avoid heavy elevation effects that would dilute the sharp, modern motion-brand feel.

## Shapes
The shape language is clean and highly rounded on interactive elements, especially pill buttons with the 100px radius. Structural containers are softer but still restrained, using small 8px radii for cards and panels. Overall, the system feels smooth and friendly at the edges while remaining technically precise.

## Components
Buttons are prominent and minimal, with transparent backgrounds, ivory outlines, and rounded pills. Use `button-primary` and `button-secondary` for major actions; both should remain 53px tall with 15px vertical and 24px horizontal padding, keeping a substantial but not bulky presence. `button-primary` can carry slightly stronger emphasis through border weight or hover fill, while `button-tertiary` should read as a plain text action with no box treatment. Button text should use `label-lg` styling and remain highly legible against the dark background.

Cards should use `card` styling: dark surface, 1px border, 8px rounding, and modest 16px padding. They should feel like framed content blocks rather than floating panels. Inputs should follow the same tonal logic as cards, with subtle borders, dark surfaces, and comfortable inner padding so form fields stay aligned with the visual language.

Chips and tags should be compact pills with full rounding, using small type and tight horizontal padding. Navigation links should stay understated in muted or ivory text, with hover states relying on color shift rather than decoration. The brand does not rely on shadows, so component states should be communicated through color, border contrast, and typography weight.

## Do's and Don'ts
- Do keep the background near-black and let ivory text carry most of the visual hierarchy.
- Do use oversized typography for hero moments and keep line lengths short enough to preserve the dramatic rhythm.
- Do favor pill-shaped CTAs with strong borders and transparent fills for the primary interaction style.
- Do use neon green and orange as accent colors, not as dominant fills across large surfaces.
- Don't introduce heavy shadows, glassmorphism, or soft ambient depth effects.
- Don't swap Mori for a more neutral UI font; the identity depends on its editorial geometry.
- Don't make cards too light or too detached from the background; they should remain tightly integrated with the dark system.
- Don't overuse uppercase labels or dense microcopy, which would fight the spacious, motion-led personality.