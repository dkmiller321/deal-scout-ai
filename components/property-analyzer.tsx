"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Search, TrendingUp, DollarSign, Home, Percent } from "lucide-react";
import { cn } from "@/lib/utils";

const analyzeSchema = z.object({
  address: z.string().min(5, "Enter a valid address"),
  city: z.string().min(2, "Enter a city"),
  state: z.string().length(2, "Enter 2-letter state code"),
  zipCode: z.string().min(5, "Enter a ZIP code"),
  price: z.coerce.number().min(1000, "Enter the listing price"),
  bedrooms: z.coerce.number().min(0).max(20),
  bathrooms: z.coerce.number().min(0).max(20),
  sqft: z.coerce.number().min(100).optional(),
  yearBuilt: z.coerce.number().min(1800).max(2030).optional(),
  propertyType: z.enum(["single_family", "multi_family", "condo", "townhouse", "apartment"]),
});

type AnalyzeFormData = z.infer<typeof analyzeSchema>;

export function PropertyAnalyzer() {
  const [analysisResult, setAnalysisResult] = useState<{
    score: number;
    monthlyRent: number;
    capRate: number;
    cashOnCash: number;
    analysis: string;
    breakdown: Record<string, number>;
    insights: string[];
  } | null>(null);

  const form = useForm<AnalyzeFormData>({
    resolver: zodResolver(analyzeSchema),
    defaultValues: {
      address: "",
      city: "",
      state: "",
      zipCode: "",
      price: undefined,
      bedrooms: 3,
      bathrooms: 2,
      sqft: undefined,
      yearBuilt: undefined,
      propertyType: "single_family",
    },
  });

  const analyzeMutation = trpc.properties.analyze.useMutation({
    onSuccess: (data) => {
      setAnalysisResult(data);
    },
  });

  const onSubmit = (data: AnalyzeFormData) => {
    analyzeMutation.mutate(data);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-green-500/10 border-green-500/20";
    if (score >= 60) return "bg-yellow-500/10 border-yellow-500/20";
    return "bg-red-500/10 border-red-500/20";
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Analyze a Property
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Street Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main St" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="Tampa" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input placeholder="FL" maxLength={2} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ZIP Code</FormLabel>
                        <FormControl>
                          <Input placeholder="33601" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Listing Price ($)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="350000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="propertyType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="single_family">Single Family</SelectItem>
                          <SelectItem value="multi_family">Multi-Family</SelectItem>
                          <SelectItem value="condo">Condo</SelectItem>
                          <SelectItem value="townhouse">Townhouse</SelectItem>
                          <SelectItem value="apartment">Apartment</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bedrooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bedrooms</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bathrooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bathrooms</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.5" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sqft"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Square Feet (optional)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="1500" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="yearBuilt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year Built (optional)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="1990" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={analyzeMutation.isPending}
              >
                {analyzeMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Analyze Deal
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {analysisResult && (
        <Card className={cn("border-2", getScoreBg(analysisResult.score))}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Analysis Results</span>
              <span className={cn("text-4xl font-bold", getScoreColor(analysisResult.score))}>
                {analysisResult.score}/100
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <DollarSign className="h-4 w-4" />
                  Est. Monthly Rent
                </div>
                <p className="text-2xl font-semibold mt-1">
                  {formatPrice(analysisResult.monthlyRent)}
                </p>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Percent className="h-4 w-4" />
                  Cap Rate
                </div>
                <p className="text-2xl font-semibold mt-1">
                  {analysisResult.capRate.toFixed(1)}%
                </p>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <TrendingUp className="h-4 w-4" />
                  Cash on Cash
                </div>
                <p className="text-2xl font-semibold mt-1">
                  {analysisResult.cashOnCash.toFixed(1)}%
                </p>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Home className="h-4 w-4" />
                  Annual Cash Flow
                </div>
                <p className="text-2xl font-semibold mt-1">
                  {formatPrice(analysisResult.monthlyRent * 12 * 0.6 - (form.getValues("price") * 0.75 * 0.07))}
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">AI Analysis</h4>
              <p className="text-muted-foreground">{analysisResult.analysis}</p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Score Breakdown</h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {Object.entries(analysisResult.breakdown).map(([key, value]) => (
                  <div key={key} className="text-center p-2 bg-muted rounded">
                    <p className="text-xs text-muted-foreground capitalize">
                      {key.replace("Score", "")}
                    </p>
                    <p className="font-semibold">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {analysisResult.insights.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Key Insights</h4>
                <ul className="space-y-1">
                  {analysisResult.insights.map((insight, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary">•</span>
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
