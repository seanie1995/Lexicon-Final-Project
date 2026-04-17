# Design System Specification: High-End Editorial

## 1. Overview & Creative North Star: "The Digital Archivist"
The Creative North Star for this design system is **The Digital Archivist**. We are not building a standard e-commerce interface; we are curating a digital sanctuary that honors the tactile heritage of rare book collecting.

To move beyond the "template" look, this system rejects the rigid, boxy constraints of modern web design. Instead, it embraces **intentional asymmetry** and **editorial pacing**. Elements should feel "placed" rather than "slotted," utilizing generous whitespace to allow the scholarly typography to breathe. We evoke the feeling of an antique library through tonal depth, layered surfaces, and a rejection of harsh digital borders.

---

## 2. Colors: The Tonal Palette
The color strategy mimics the natural materials of a high-end study: aged parchment, carbon ink, and polished oak.

### Palette Application
- **Primary (`#4f1819`):** Our "Muted Burgundy." Used sparingly for high-intent actions or to signpost critical scholarly notes.
- **Secondary (`#725a42`):** Our "Deep Oak." Used for structural depth and subtle interaction states.
- **Surface (`#fff9eb`):** Our "Warm Parchment." This is the foundational texture of the experience.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders for sectioning. Boundaries must be defined solely through background color shifts. 
- Use `surface-container-low` (`#f9f3e5`) to define a soft content area on a `surface` background.
- For high-contrast sections, transition from `surface` to `surface-container-highest` (`#e8e2d4`).

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. To create depth:
1. **Base:** `surface` (`#fff9eb`)
2. **Sectioning:** `surface-container-low` (`#f9f3e5`)
3. **Interactive Elements/Cards:** `surface-container-lowest` (`#ffffff`) to create a "lifted" paper effect.

### Signature Textures & Soul
To avoid a flat digital feel, use a subtle linear gradient on primary CTAs: transitioning from `primary` (`#4f1819`) to `primary-container` (`#6b2d2d`). This creates the "bloom" of light hitting a leather book spine.

---

## 3. Typography: The Scholarly Voice
Typography is the cornerstone of this system. It must feel authoritative yet inviting.

- **Display & Headline (Newsreader):** These are our "Titling" faces. Use `display-lg` (3.5rem) for hero moments. The high-contrast serifs should feel like ink pressed into heavy paper. Use intentional letter-spacing (optical kerning) to increase the premium feel.
- **Body (Noto Serif):** The "Text" face. Chosen for its exceptional readability in long-form scholarly critiques. Maintain generous line-heights (1.6 - 1.8) to ensure the "editorial" feel.
- **Labels (Public Sans):** Our "Annotation" face. A clean sans-serif used for metadata (ISBN, Date, Publisher). It provides a functional contrast to the romanticism of the serifs.

---

## 4. Elevation & Depth: Tonal Layering
We achieve hierarchy through light and material, not structural scaffolding.

- **The Layering Principle:** Depth is achieved by "stacking" the surface-container tiers. Place a `surface-container-lowest` card on a `surface-container-low` section to create a soft, natural lift without needing a shadow.
- **Ambient Shadows:** For floating elements (like a rare book detail modal), use an extra-diffused shadow: `blur: 40px`, `spread: 0`, `opacity: 6%`. Use a tint of `on-surface` (`#1d1c13`) for the shadow color to ensure it feels like a natural shadow on parchment.
- **The "Ghost Border" Fallback:** If a border is required for accessibility, use the `outline-variant` token (`#d8c1c0`) at **15% opacity**. This creates a "watermark" effect rather than a hard line.
- **Glassmorphism:** For navigation bars, use `surface` (`#fff9eb`) at 85% opacity with a `backdrop-filter: blur(12px)`. This allows the "ink" of the content to scroll elegantly beneath the header.

---

## 5. Components

### Buttons: The Wax Seal
- **Primary:** Rectangular (`0px` roundedness). Background: `primary`. Text: `on-primary`. Hover state: Transition to `primary-container`.
- **Secondary:** `surface-container-high` background with `on-secondary-container` text. No border.
- **Tertiary:** Text-only in `secondary`, using `label-md` typography.

### Cards & Lists: Editorial Blocks
- **The Rule:** No dividers. Use `spacing-8` (2.75rem) or `spacing-10` (3.5rem) to separate entries.
- **Cards:** Use `surface-container-lowest` for the card body. Instead of a shadow, use a 1px "Ghost Border" at 10% opacity.
- **Interaction:** On hover, a card should shift from `surface-container-lowest` to `surface-bright`.

### Input Fields: The Ledger
- **Styling:** Underline-only style using `outline-variant`. When focused, the underline transitions to `primary` (`#4f1819`) at 2px thickness. 
- **Labels:** Use `label-sm` in `on-surface-variant`.

### Signature Component: "The Margin Note"
- **Purpose:** For highlighting book quotes or curator insights.
- **Design:** A vertical line (2px) of `primary` on the left, `body-md` italicized text, and a background of `surface-container-lowest`.

---

## 6. Do’s and Don’ts

### Do
- **Do** use asymmetrical layouts (e.g., an image offset to the left with text columns starting at 40% width).
- **Do** use `0px` border-radius for every single element. Modern "roundedness" kills the vintage scholarly aesthetic.
- **Do** prioritize vertical whitespace. If a section feels crowded, double the spacing.

### Don't
- **Don't** use 100% black (`#000000`). Always use `on-surface` (`#1d1c13`) for text to maintain the "ink on paper" feel.
- **Don't** use standard "drop shadows" with high opacity.
- **Don't** use icons unless absolutely necessary. Rely on clear, high-end typography for navigation wherever possible.
- **Don't** use horizontal divider lines to separate list items. Use the spacing scale to create "breathing rooms."