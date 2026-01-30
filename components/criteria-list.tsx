"use client";

import { trpc } from "@/lib/trpc/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

export function CriteriaList() {
  const utils = trpc.useUtils();

  const { data: criteria, isLoading } = trpc.criteria.list.useQuery();

  const toggleActive = trpc.criteria.toggleActive.useMutation({
    onSuccess: () => {
      utils.criteria.list.invalidate();
      toast.success("Criteria updated");
    },
  });

  const deleteCriteria = trpc.criteria.delete.useMutation({
    onSuccess: () => {
      utils.criteria.list.invalidate();
      toast.success("Criteria deleted");
    },
  });

  if (isLoading) {
    return (
      <div className="grid gap-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
    );
  }

  if (!criteria?.length) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No investment criteria yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Create your first criteria to start finding matching deals
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {criteria.map((c) => (
        <Card key={c.id}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CardTitle className="text-lg">{c.name}</CardTitle>
                <Badge variant={c.isActive ? "default" : "secondary"}>
                  {c.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={c.isActive ?? false}
                  onCheckedChange={(checked) =>
                    toggleActive.mutate({ id: c.id, isActive: checked })
                  }
                />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => deleteCriteria.mutate({ id: c.id })}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 text-sm">
              {c.minCapRate && (
                <div>
                  <span className="text-muted-foreground">Min Cap Rate: </span>
                  <span className="font-medium">{c.minCapRate}%</span>
                </div>
              )}
              {c.minCashOnCash && (
                <div>
                  <span className="text-muted-foreground">Min CoC: </span>
                  <span className="font-medium">{c.minCashOnCash}%</span>
                </div>
              )}
              {c.maxPrice && (
                <div>
                  <span className="text-muted-foreground">Max Price: </span>
                  <span className="font-medium">
                    ${c.maxPrice.toLocaleString()}
                  </span>
                </div>
              )}
              {c.propertyTypes && c.propertyTypes.length > 0 && (
                <div>
                  <span className="text-muted-foreground">Types: </span>
                  <span className="font-medium">
                    {(c.propertyTypes as string[]).join(", ")}
                  </span>
                </div>
              )}
              {c.targetMarkets && c.targetMarkets.length > 0 && (
                <div>
                  <span className="text-muted-foreground">Markets: </span>
                  <span className="font-medium">
                    {(c.targetMarkets as string[]).join(", ")}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
