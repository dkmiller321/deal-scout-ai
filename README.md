# PropFlow AI - Real Estate Deal Analyzer

AI-powered investment property analysis tool. Enter any property details to get instant investment scoring, cash flow projections, and AI-generated insights.

## Current Features

### Deal Analyzer
- **Property Input Form** - Enter address, price, bedrooms, bathrooms, sqft, year built
- **Investment Scoring** - Proprietary 0-100 score based on:
  - Cap Rate (weight: 25%)
  - Cash-on-Cash Return (weight: 25%)
  - Value Potential (weight: 20%)
  - Market Timing (weight: 15%)
  - Property Characteristics (weight: 15%)
- **Financial Calculations**
  - Estimated monthly rent (based on price/bedroom formula)
  - Cap rate calculation
  - Cash-on-cash return (assumes 25% down, 7% interest, 30yr)
  - Annual cash flow projection
- **AI Analysis** - Generated insights and recommendations

### User Features
- **Authentication** - Clerk-based sign in/sign up
- **Save Analyses** - Store analyzed properties to your account
- **Investment Criteria** - Set and save your investment preferences
- **Favorites** - Bookmark properties for later review

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **API**: tRPC for type-safe endpoints
- **Database**: PostgreSQL via Supabase
- **ORM**: Drizzle ORM
- **Auth**: Clerk
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: Zustand (client), React Query (server)

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.local.example` to `.env.local` and fill in:
   ```
   DATABASE_URL=your_supabase_connection_string
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
   CLERK_SECRET_KEY=your_clerk_secret
   ```
4. Push database schema: `npm run db:push`
5. Start dev server: `npm run dev`

## Potential Improvements / Future Work

### Data Enhancements
- [ ] **HUD Fair Market Rent API** - Replace simple rent estimation with actual HUD data by ZIP code (free)
- [ ] **County Assessor Integration** - Pull property details automatically from public records
- [ ] **Zillow/Redfin URL Parser** - Paste a listing URL and auto-fill property details
- [ ] **Google Street View** - Show property images via Street View API

### Analysis Improvements
- [ ] **Neighborhood Scoring** - Census data for crime, schools, demographics
- [ ] **Comparable Sales** - Show recent sales in the area
- [ ] **Rent Comparables** - Similar rental listings nearby
- [ ] **Rehab Cost Estimator** - Estimate renovation costs based on age/condition
- [ ] **ARV Calculator** - After-repair value estimation

### User Features
- [ ] **Deal Sharing** - Share analysis via public link
- [ ] **Export to PDF** - Download analysis report
- [ ] **Portfolio Tracking** - Track multiple properties you own
- [ ] **Email Alerts** - Get notified when saved criteria match new analyses
- [ ] **Collaboration** - Share deals with partners/investors

### Monetization Ideas
- [ ] Free tier: 5 analyses/month
- [ ] Pro tier: Unlimited analyses + PDF export + portfolio tracking
- [ ] Team tier: Collaboration features

### Technical Debt
- [ ] Add comprehensive test coverage
- [ ] Implement rate limiting on analyze endpoint
- [ ] Add input validation for address format
- [ ] Optimize database queries with proper indexes

## License

Private - All rights reserved
