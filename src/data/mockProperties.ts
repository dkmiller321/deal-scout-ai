export interface Property {
  id: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  lotSize: number;
  yearBuilt: number;
  propertyType: string;
  description: string;
  photos: string[];
  daysOnMarket: number;
  listingUrl: string;
  source: string;
  score: number;
  capRate: number;
  cocReturn: number;
  arvEstimate: number;
  rehabEstimate: number;
  analysis?: string;
}

export const mockProperties: Property[] = [
  {
    id: "1",
    address: "3421 Harbor View Dr",
    city: "Tampa",
    state: "FL",
    zip: "33611",
    price: 285000,
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1450,
    lotSize: 6500,
    yearBuilt: 1978,
    propertyType: "Single Family",
    description: "Excellent BRRRR opportunity! Dated interior needs cosmetic updates. Strong rental market area near MacDill AFB. Newer roof (2019), AC (2020). Comps show $380k-$410k ARV after renovations.",
    photos: ["/placeholder.svg"],
    daysOnMarket: 12,
    listingUrl: "https://zillow.com/example",
    source: "Zillow",
    score: 89,
    capRate: 8.2,
    cocReturn: 18.5,
    arvEstimate: 395000,
    rehabEstimate: 45000,
    analysis: "Strong BRRRR candidate with excellent rental demand from military personnel. Conservative 20% equity capture post-refinance. Monthly rent potential: $2,200-$2,400."
  },
  {
    id: "2",
    address: "1567 Sunset Blvd",
    city: "Orlando",
    state: "FL",
    zip: "32801",
    price: 195000,
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1280,
    lotSize: 5200,
    yearBuilt: 1965,
    propertyType: "Single Family",
    description: "Investor special! Needs full renovation. Solid bones, great neighborhood with rising values. Recent sales in area at $310k-$340k. Priced for quick sale.",
    photos: ["/placeholder.svg"],
    daysOnMarket: 3,
    listingUrl: "https://zillow.com/example",
    source: "MLS",
    score: 92,
    capRate: 9.8,
    cocReturn: 22.3,
    arvEstimate: 325000,
    rehabEstimate: 62000,
    analysis: "Exceptional fix-and-flip opportunity. Distressed sale creating instant equity. Target 4-month renovation timeline. Conservative profit estimate: $45k-$60k."
  },
  {
    id: "3",
    address: "8842 Palm Grove Ave",
    city: "Tampa",
    state: "FL",
    zip: "33615",
    price: 425000,
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2150,
    lotSize: 8200,
    yearBuilt: 1992,
    propertyType: "Single Family",
    description: "Well-maintained home in desirable Carrollwood area. Recent updates include kitchen (2021), bathrooms (2022). Ready for immediate rental. Strong school district.",
    photos: ["/placeholder.svg"],
    daysOnMarket: 8,
    listingUrl: "https://redfin.com/example",
    source: "Redfin",
    score: 74,
    capRate: 6.1,
    cocReturn: 11.2,
    arvEstimate: 445000,
    rehabEstimate: 8000,
    analysis: "Solid buy-and-hold play for long-term appreciation. Below-market cap rate but excellent tenant profile area. Minimal work needed. Monthly rent: $2,800-$3,000."
  },
  {
    id: "4",
    address: "2901 Colonial Dr",
    city: "Orlando",
    state: "FL",
    zip: "32803",
    price: 215000,
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1100,
    lotSize: 4800,
    yearBuilt: 1972,
    propertyType: "Single Family",
    description: "Cozy 2-bed with large backyard. Needs kitchen and bathroom updates. Strong rental neighborhood, low crime, close to downtown Orlando. Tenant in place at $1,500/month (below market).",
    photos: ["/placeholder.svg"],
    daysOnMarket: 22,
    listingUrl: "https://zillow.com/example",
    source: "Zillow",
    score: 81,
    capRate: 7.8,
    cocReturn: 15.8,
    arvEstimate: 275000,
    rehabEstimate: 35000,
    analysis: "Good value-add opportunity. Current tenant provides immediate cash flow while planning renovations. Post-rehab rent: $1,900-$2,100. 6-month hold then refinance strategy recommended."
  },
  {
    id: "5",
    address: "5623 Bayshore Rd",
    city: "Tampa",
    state: "FL",
    zip: "33629",
    price: 650000,
    bedrooms: 4,
    bathrooms: 3.5,
    sqft: 2850,
    lotSize: 9500,
    yearBuilt: 2005,
    propertyType: "Single Family",
    description: "Beautiful South Tampa home with waterfront views. Move-in ready, recently renovated. Premium location with strong appreciation history. HOA: $125/month.",
    photos: ["/placeholder.svg"],
    daysOnMarket: 45,
    listingUrl: "https://zillow.com/example",
    source: "MLS",
    score: 58,
    capRate: 4.2,
    cocReturn: 6.8,
    arvEstimate: 675000,
    rehabEstimate: 5000,
    analysis: "Appreciation play over cash flow. Not ideal for income investors but excellent for wealth building in premium market. Consider long-term hold or luxury STR strategy."
  },
  {
    id: "6",
    address: "7734 University Blvd",
    city: "Orlando",
    state: "FL",
    zip: "32817",
    price: 235000,
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1350,
    lotSize: 5800,
    yearBuilt: 1985,
    propertyType: "Single Family",
    description: "Near UCF campus, excellent student rental potential. Needs flooring and paint. Roof 5 years old, AC 3 years. Zoned for up to 6 unrelated occupants.",
    photos: ["/placeholder.svg"],
    daysOnMarket: 7,
    listingUrl: "https://redfin.com/example",
    source: "Redfin",
    score: 86,
    capRate: 8.9,
    cocReturn: 19.2,
    arvEstimate: 295000,
    rehabEstimate: 28000,
    analysis: "Strong student housing play. Rent-by-room strategy yields $2,800-$3,200/month. High turnover offset by consistent demand. Consider property manager specializing in student rentals."
  },
  {
    id: "7",
    address: "4512 Oak Avenue",
    city: "Tampa",
    state: "FL",
    zip: "33614",
    price: 310000,
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1580,
    lotSize: 7200,
    yearBuilt: 1988,
    propertyType: "Single Family",
    description: "Solid rental in established neighborhood. Current tenant paying $2,100/month (market rate). All major systems updated within 5 years. Turnkey investment property.",
    photos: ["/placeholder.svg"],
    daysOnMarket: 18,
    listingUrl: "https://zillow.com/example",
    source: "Zillow",
    score: 76,
    capRate: 6.8,
    cocReturn: 13.5,
    arvEstimate: 330000,
    rehabEstimate: 12000,
    analysis: "Stable cash-flowing asset. Minimal management required. Good for passive investors or portfolio diversification. Modest appreciation potential but reliable income."
  },
  {
    id: "8",
    address: "9201 Lake Vista Ct",
    city: "Orlando",
    state: "FL",
    zip: "32819",
    price: 380000,
    bedrooms: 3,
    bathrooms: 2.5,
    sqft: 1850,
    lotSize: 6800,
    yearBuilt: 2010,
    propertyType: "Single Family",
    description: "Modern home in Doctor Phillips area. Excellent condition, granite counters, stainless appliances. Community pool and playground. Top-rated schools. Perfect for executive rental.",
    photos: ["/placeholder.svg"],
    daysOnMarket: 15,
    listingUrl: "https://redfin.com/example",
    source: "MLS",
    score: 69,
    capRate: 5.5,
    cocReturn: 9.8,
    arvEstimate: 395000,
    rehabEstimate: 5000,
    analysis: "Quality tenant market but lower returns. Consider furnished rental or mid-term corporate housing for 8-10% CoC. Professional property type with minimal maintenance."
  }
];
