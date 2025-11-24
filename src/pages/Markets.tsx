import { DashboardHeader } from "@/components/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Home, DollarSign } from "lucide-react";

interface MarketStats {
  city: string;
  state: string;
  totalProperties: number;
  avgScore: number;
  avgPrice: number;
  avgCapRate: number;
  hotDeals: number;
  priceChange: number;
}

const marketData: MarketStats[] = [
  {
    city: "Tampa",
    state: "FL",
    totalProperties: 156,
    avgScore: 74,
    avgPrice: 342000,
    avgCapRate: 7.2,
    hotDeals: 23,
    priceChange: 5.3,
  },
  {
    city: "Orlando",
    state: "FL",
    totalProperties: 189,
    avgScore: 71,
    avgPrice: 298000,
    avgCapRate: 7.8,
    hotDeals: 31,
    priceChange: 4.1,
  },
];

const Markets = () => {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Market Overview</h1>
          <p className="text-muted-foreground">
            Investment opportunities and trends across your target markets
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {marketData.map((market) => (
            <Card key={`${market.city}-${market.state}`}>
              <CardHeader>
                <CardTitle className="text-2xl">
                  {market.city}, {market.state}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <Home className="h-4 w-4" />
                      <span className="text-sm">Total Properties</span>
                    </div>
                    <p className="text-3xl font-bold">{market.totalProperties}</p>
                  </div>
                  
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-sm">Hot Deals</span>
                    </div>
                    <p className="text-3xl font-bold text-success">{market.hotDeals}</p>
                  </div>

                  <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <DollarSign className="h-4 w-4" />
                      <span className="text-sm">Avg Price</span>
                    </div>
                    <p className="text-2xl font-bold">${(market.avgPrice / 1000).toFixed(0)}k</p>
                  </div>

                  <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-sm">Avg Cap Rate</span>
                    </div>
                    <p className="text-2xl font-bold text-success">{market.avgCapRate}%</p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Average Deal Score</span>
                    <span className="text-2xl font-bold">{market.avgScore}/100</span>
                  </div>
                  <div className="mt-2 w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary rounded-full h-2 transition-all"
                      style={{ width: `${market.avgScore}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  {market.priceChange >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-success" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-destructive" />
                  )}
                  <span className={market.priceChange >= 0 ? "text-success" : "text-destructive"}>
                    {market.priceChange > 0 ? "+" : ""}{market.priceChange}%
                  </span>
                  <span className="text-sm text-muted-foreground">vs last month</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Market Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border-l-4 border-success bg-muted/30 rounded">
              <h4 className="font-semibold mb-1">Orlando Leading in Deal Volume</h4>
              <p className="text-sm text-muted-foreground">
                Orlando currently has 31 properties scoring above 80, with strong opportunities near UCF campus for student housing plays.
              </p>
            </div>
            <div className="p-4 border-l-4 border-warning bg-muted/30 rounded">
              <h4 className="font-semibold mb-1">Tampa Price Appreciation</h4>
              <p className="text-sm text-muted-foreground">
                Tampa market showing 5.3% price growth month-over-month, indicating strong demand. Consider buy-and-hold strategies.
              </p>
            </div>
            <div className="p-4 border-l-4 border-primary bg-muted/30 rounded">
              <h4 className="font-semibold mb-1">Best Cap Rates in Orlando</h4>
              <p className="text-sm text-muted-foreground">
                Orlando properties averaging 7.8% cap rate vs Tampa's 7.2%, making it more attractive for cash flow investors.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Markets;
