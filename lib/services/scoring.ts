/**
 * Investment Scoring Algorithm
 *
 * Calculates a 0-100 score for real estate investment properties
 * based on multiple factors including financial metrics, market conditions,
 * and property characteristics.
 */

interface ScoringInput {
  // Financial metrics
  price: number;
  monthlyRent?: number;
  capRate?: number;
  cashOnCash?: number;
  arvEstimate?: number;
  rehabCostEstimate?: number;

  // Property details
  bedrooms: number;
  bathrooms: number;
  sqft?: number;
  yearBuilt?: number;
  propertyType: string;

  // Market data
  daysOnMarket?: number;
  marketAvgPrice?: number;
  marketAvgCapRate?: number;
}

interface ScoringResult {
  score: number;
  breakdown: {
    capRateScore: number;
    cashFlowScore: number;
    valueScore: number;
    marketScore: number;
    propertyScore: number;
  };
  insights: string[];
}

const WEIGHTS = {
  capRate: 0.25,
  cashFlow: 0.25,
  value: 0.20,
  market: 0.15,
  property: 0.15,
};

export function calculateInvestmentScore(input: ScoringInput): ScoringResult {
  const insights: string[] = [];

  // 1. Cap Rate Score (0-100)
  let capRateScore = 0;
  if (input.capRate) {
    if (input.capRate >= 10) capRateScore = 100;
    else if (input.capRate >= 8) capRateScore = 90;
    else if (input.capRate >= 7) capRateScore = 80;
    else if (input.capRate >= 6) capRateScore = 70;
    else if (input.capRate >= 5) capRateScore = 60;
    else if (input.capRate >= 4) capRateScore = 50;
    else capRateScore = input.capRate * 10;

    if (input.capRate >= 8) {
      insights.push(`Strong cap rate of ${input.capRate.toFixed(1)}%`);
    }
  } else if (input.monthlyRent && input.price) {
    // Calculate estimated cap rate
    const annualRent = input.monthlyRent * 12;
    const estimatedExpenses = annualRent * 0.4; // 40% expense ratio
    const noi = annualRent - estimatedExpenses;
    const estimatedCapRate = (noi / input.price) * 100;
    capRateScore = Math.min(100, estimatedCapRate * 10);
  }

  // 2. Cash Flow Score (0-100)
  let cashFlowScore = 0;
  if (input.cashOnCash) {
    if (input.cashOnCash >= 15) cashFlowScore = 100;
    else if (input.cashOnCash >= 12) cashFlowScore = 90;
    else if (input.cashOnCash >= 10) cashFlowScore = 80;
    else if (input.cashOnCash >= 8) cashFlowScore = 70;
    else if (input.cashOnCash >= 6) cashFlowScore = 60;
    else cashFlowScore = input.cashOnCash * 8;

    if (input.cashOnCash >= 10) {
      insights.push(`Excellent cash-on-cash return of ${input.cashOnCash.toFixed(1)}%`);
    }
  } else if (input.monthlyRent && input.price) {
    // Estimate cash flow using 1% rule
    const onePercentRent = input.price * 0.01;
    const rentRatio = input.monthlyRent / onePercentRent;
    cashFlowScore = Math.min(100, rentRatio * 50);

    if (input.monthlyRent >= onePercentRent) {
      insights.push("Meets the 1% rule for rental income");
    }
  }

  // 3. Value Score (0-100) - Based on ARV potential
  let valueScore = 50; // Default neutral score
  if (input.arvEstimate && input.price) {
    const equityPotential = ((input.arvEstimate - input.price) / input.price) * 100;
    const rehabROI = input.rehabCostEstimate
      ? ((input.arvEstimate - input.price - input.rehabCostEstimate) /
          (input.price + input.rehabCostEstimate)) *
        100
      : equityPotential;

    if (rehabROI >= 30) valueScore = 100;
    else if (rehabROI >= 25) valueScore = 90;
    else if (rehabROI >= 20) valueScore = 80;
    else if (rehabROI >= 15) valueScore = 70;
    else if (rehabROI >= 10) valueScore = 60;
    else valueScore = Math.max(0, 50 + rehabROI);

    if (rehabROI >= 20) {
      insights.push(`Strong value-add potential with ${rehabROI.toFixed(0)}% ROI opportunity`);
    }
  }

  // 4. Market Score (0-100) - Based on days on market and pricing
  let marketScore = 50;
  if (input.daysOnMarket !== undefined) {
    if (input.daysOnMarket <= 7) {
      marketScore = 90;
      insights.push("New listing - recently hit the market");
    } else if (input.daysOnMarket <= 14) {
      marketScore = 80;
    } else if (input.daysOnMarket <= 30) {
      marketScore = 70;
    } else if (input.daysOnMarket <= 60) {
      marketScore = 60;
    } else if (input.daysOnMarket <= 90) {
      marketScore = 50;
    } else {
      marketScore = 40;
      insights.push("Extended time on market - potential negotiation opportunity");
    }
  }

  // Adjust for price vs market average
  if (input.marketAvgPrice && input.price) {
    const priceRatio = input.price / input.marketAvgPrice;
    if (priceRatio < 0.8) {
      marketScore += 10;
      insights.push("Priced below market average");
    } else if (priceRatio > 1.2) {
      marketScore -= 10;
    }
  }
  marketScore = Math.max(0, Math.min(100, marketScore));

  // 5. Property Score (0-100) - Based on characteristics
  let propertyScore = 50;

  // Bedroom scoring (3-4 beds optimal for rentals)
  if (input.bedrooms >= 3 && input.bedrooms <= 4) {
    propertyScore += 15;
  } else if (input.bedrooms === 2) {
    propertyScore += 5;
  }

  // Property type scoring
  if (input.propertyType === "single_family") {
    propertyScore += 10;
  } else if (input.propertyType === "multi_family") {
    propertyScore += 15;
    insights.push("Multi-family property - multiple income streams");
  }

  // Age scoring
  if (input.yearBuilt) {
    const age = new Date().getFullYear() - input.yearBuilt;
    if (age <= 10) {
      propertyScore += 10;
    } else if (age <= 30) {
      propertyScore += 5;
    } else if (age > 50) {
      propertyScore -= 5;
    }
  }

  // Size scoring
  if (input.sqft) {
    if (input.sqft >= 1200 && input.sqft <= 2500) {
      propertyScore += 5;
    }
  }

  propertyScore = Math.max(0, Math.min(100, propertyScore));

  // Calculate weighted total score
  const score = Math.round(
    capRateScore * WEIGHTS.capRate +
      cashFlowScore * WEIGHTS.cashFlow +
      valueScore * WEIGHTS.value +
      marketScore * WEIGHTS.market +
      propertyScore * WEIGHTS.property
  );

  // Add overall assessment insight
  if (score >= 80) {
    insights.unshift("High potential investment opportunity");
  } else if (score >= 60) {
    insights.unshift("Moderate investment potential - review carefully");
  } else {
    insights.unshift("May not meet typical investment criteria");
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    breakdown: {
      capRateScore: Math.round(capRateScore),
      cashFlowScore: Math.round(cashFlowScore),
      valueScore: Math.round(valueScore),
      marketScore: Math.round(marketScore),
      propertyScore: Math.round(propertyScore),
    },
    insights: insights.slice(0, 5), // Top 5 insights
  };
}

/**
 * Generate AI-style analysis text based on scoring
 */
export function generateAnalysis(input: ScoringInput, result: ScoringResult): string {
  const parts: string[] = [];

  // Financial analysis
  if (input.capRate && input.capRate >= 6) {
    parts.push(
      `This property offers a ${input.capRate.toFixed(1)}% cap rate, which is competitive for the current market.`
    );
  }

  if (input.monthlyRent) {
    const priceToRent = input.price / input.monthlyRent;
    if (priceToRent <= 100) {
      parts.push(
        `Strong rental income potential with a price-to-rent ratio of ${priceToRent.toFixed(0)}.`
      );
    }
  }

  // Value-add opportunity
  if (input.arvEstimate && input.arvEstimate > input.price) {
    const upside = input.arvEstimate - input.price;
    parts.push(
      `Potential equity gain of $${upside.toLocaleString()} through improvements.`
    );
  }

  // Market timing
  if (input.daysOnMarket !== undefined && input.daysOnMarket <= 14) {
    parts.push("Recently listed property - act quickly if interested.");
  } else if (input.daysOnMarket && input.daysOnMarket > 60) {
    parts.push("Extended market time suggests room for price negotiation.");
  }

  // Property specifics
  if (input.propertyType === "multi_family") {
    parts.push("Multi-family properties offer diversified rental income.");
  }

  if (parts.length === 0) {
    parts.push(
      `This ${input.bedrooms}-bed property is priced at $${input.price.toLocaleString()} in ${input.propertyType.replace("_", " ")} category.`
    );
  }

  return parts.join(" ");
}
