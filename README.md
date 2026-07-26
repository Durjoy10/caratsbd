# Carats — Fine Jewellery Website

Premium Angular frontend for the Carats fine jewellery brand showcase.

## Tech Stack

- **Frontend**: Angular 18 (Standalone Components, Lazy-loaded Routes)
- **Styling**: SCSS with CSS Custom Properties
- **Design**: Parallax scrolling, Cormorant Garamond + Jost typography, Gold shimmer effects

## Project Structure

```
src/
├── app/
│   ├── enum/                        # Category enums
│   ├── interfaces/                  # TypeScript interfaces (Product, Category, Inquiry)
│   ├── pages/
│   │   ├── home/                    # Homepage with parallax hero + sections
│   │   ├── products/                # All products with filter bar
│   │   ├── category/                # Per-category gallery page
│   │   ├── product-detail/          # Single product detail + related
│   │   ├── customization-inquiry/   # Bespoke commission inquiry form
│   │   └── contact/                 # Contact info, map, message form
│   ├── services/
│   │   ├── product.service.ts       # Product & category data (mock → API-ready)
│   │   └── inquiry.service.ts       # Inquiry form submission
│   └── shared/
│       ├── components/
│       │   ├── navbar/              # Fixed transparent → frosted navbar
│       │   ├── footer/              # Full-width footer
│       │   └── product-card/        # Reusable product tile
│       └── directives/
│           ├── scroll-reveal.ts     # Intersection Observer reveal animations
│           └── parallax.ts          # Scroll-based parallax utility
├── environments/                    # environment.ts / environment.prod.ts
└── styles.scss                      # Global tokens, typography, utilities
```

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm start
# → http://localhost:4200

# Production build
npm run build:prod
```

## Connecting to the Backend

All API calls are centralized in `src/app/services/`. 

Replace mock data with real HTTP calls in `product.service.ts`:

```typescript
// Replace this:
return of(this.mockProducts);

// With this:
return this.http.get<Product[]>(`${this.baseUrl}/products`);
```

Update `src/environments/environment.ts` with your NestJS API URL.

## Pages

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | HomeComponent | Hero, categories, featured products, craft story |
| `/products` | ProductsComponent | All products with category filter |
| `/category/:slug` | CategoryComponent | Products in a specific category |
| `/product/:id` | ProductDetailComponent | Single product detail + related |
| `/customization` | CustomizationInquiryComponent | Bespoke commission form |
| `/contact` | ContactComponent | Contact info, Google Maps, message form |

## Design Tokens

Defined in `src/styles.scss` as CSS custom properties:

| Token | Value | Usage |
|-------|-------|-------|
| `--obsidian` | `#0A0A0A` | Primary background |
| `--deep-charcoal` | `#1A1714` | Section backgrounds |
| `--antique-gold` | `#C9A96E` | Primary accent |
| `--warm-ivory` | `#F5F0E8` | Primary text |
| `--font-display` | Cormorant Garamond | Headings |
| `--font-body` | Jost | Body, labels, navigation |

## Prepared By

Durjoy Dey — Software Engineer
