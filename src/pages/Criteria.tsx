import { useState } from "react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface InvestmentCriteria {
  id: string;
  name: string;
  minCapRate: number;
  minCocReturn: number;
  maxPrice: number;
  propertyTypes: string[];
  targetMarkets: string[];
  isActive: boolean;
}

const defaultCriteria: InvestmentCriteria[] = [
  {
    id: "1",
    name: "BRRRR Strategy",
    minCapRate: 8.0,
    minCocReturn: 15.0,
    maxPrice: 350000,
    propertyTypes: ["Single Family", "Duplex"],
    targetMarkets: ["Tampa, FL", "Orlando, FL"],
    isActive: true,
  },
  {
    id: "2",
    name: "Fix & Flip",
    minCapRate: 0,
    minCocReturn: 20.0,
    maxPrice: 250000,
    propertyTypes: ["Single Family"],
    targetMarkets: ["Tampa, FL"],
    isActive: false,
  },
];

const Criteria = () => {
  const [criteriaList, setCriteriaList] = useState<InvestmentCriteria[]>(defaultCriteria);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();

  const propertyTypeOptions = ["Single Family", "Duplex", "Triplex", "Fourplex", "Multifamily"];
  const marketOptions = ["Tampa, FL", "Orlando, FL", "Jacksonville, FL", "Miami, FL"];

  const handleSave = (criteria: InvestmentCriteria) => {
    if (editingId) {
      setCriteriaList(prev => prev.map(c => c.id === editingId ? criteria : c));
      toast({ title: "Criteria updated successfully" });
    } else {
      setCriteriaList(prev => [...prev, { ...criteria, id: Date.now().toString() }]);
      toast({ title: "New criteria created" });
    }
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    setCriteriaList(prev => prev.filter(c => c.id !== id));
    toast({ title: "Criteria deleted" });
  };

  const toggleActive = (id: string) => {
    setCriteriaList(prev => prev.map(c => 
      c.id === id ? { ...c, isActive: !c.isActive } : c
    ));
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Investment Criteria</h1>
          <p className="text-muted-foreground">
            Define your investment strategies and deal-finding preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {criteriaList.map((criteria) => (
            <Card key={criteria.id} className={criteria.isActive ? "border-primary" : ""}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {criteria.name}
                      {criteria.isActive && (
                        <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                          Active
                        </span>
                      )}
                    </CardTitle>
                    <CardDescription>Investment strategy parameters</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingId(criteria.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(criteria.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Min Cap Rate</p>
                    <p className="text-xl font-bold text-success">{criteria.minCapRate}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Min CoC Return</p>
                    <p className="text-xl font-bold text-success">{criteria.minCocReturn}%</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Max Purchase Price</p>
                    <p className="text-xl font-bold">${criteria.maxPrice.toLocaleString()}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Property Types</p>
                  <div className="flex flex-wrap gap-2">
                    {criteria.propertyTypes.map(type => (
                      <span key={type} className="text-xs bg-muted px-2 py-1 rounded">
                        {type}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Target Markets</p>
                  <div className="flex flex-wrap gap-2">
                    {criteria.targetMarkets.map(market => (
                      <span key={market} className="text-xs bg-muted px-2 py-1 rounded">
                        {market}
                      </span>
                    ))}
                  </div>
                </div>

                <Button
                  variant={criteria.isActive ? "outline" : "default"}
                  className="w-full"
                  onClick={() => toggleActive(criteria.id)}
                >
                  {criteria.isActive ? "Deactivate" : "Activate"}
                </Button>
              </CardContent>
            </Card>
          ))}

          <Card className="border-dashed">
            <CardContent className="flex items-center justify-center h-full min-h-[400px]">
              <Button onClick={() => setEditingId("new")} size="lg">
                <Plus className="mr-2 h-5 w-5" />
                Create New Criteria
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Criteria;
