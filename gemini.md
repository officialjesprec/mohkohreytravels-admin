# Admin Dashboard Constitution (gemini.md)

## 1. Architectural Invariants
- **Framework**: Vite + React 19.
- **Styling**: Tailwind CSS v4 (Pure).
- **Architecture**: Atomic components in `src/components`, feature-pages in `src/pages`.
- **Branding**: Montserrat for headers, Plus Jakarta Sans for body.
- **Safety Rule**: Use Row Level Security (RLS) policies for all Supabase queries.

## 2. Data Schemas
- `tours`: uuid, name, price, description, highlights, itinerary, images.
- `bookings`: uuid, user_id, type (Tour, Flight, Visa, Passport), status, amount.
- `blogs`: uuid, title, content, author, created_at, cover_image.

## 3. Design Tokens
- primary: #1E293B
- secondary: #FFA000
- accent: #945D00
- surface: #FFFFFF
- background: #F8FAFC
- text-main: #0F172A
- text-muted: #64748B
- border: #E2E8F0
- error: #EF4444
- success: #10B981
