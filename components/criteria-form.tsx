"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  minCapRate: z.coerce.number().min(0).max(100).optional(),
  minCashOnCash: z.coerce.number().min(0).max(100).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  propertyTypes: z.array(z.string()).optional(),
  targetMarkets: z.array(z.string()).optional(),
});

type FormData = z.infer<typeof formSchema>;

const propertyTypeOptions = [
  { value: "single_family", label: "Single Family" },
  { value: "multi_family", label: "Multi Family" },
  { value: "condo", label: "Condo" },
  { value: "townhouse", label: "Townhouse" },
];

const marketOptions = [
  { value: "Tampa, FL", label: "Tampa, FL" },
  { value: "Orlando, FL", label: "Orlando, FL" },
  { value: "Jacksonville, FL", label: "Jacksonville, FL" },
  { value: "Miami, FL", label: "Miami, FL" },
];

interface CriteriaFormProps {
  onSuccess: () => void;
}

export function CriteriaForm({ onSuccess }: CriteriaFormProps) {
  const utils = trpc.useUtils();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      propertyTypes: [],
      targetMarkets: [],
    },
  });

  const createCriteria = trpc.criteria.create.useMutation({
    onSuccess: () => {
      utils.criteria.list.invalidate();
      toast.success("Criteria created successfully");
      onSuccess();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data: FormData) => {
    createCriteria.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Criteria Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., BRRRR Strategy" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="minCapRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Min Cap Rate (%)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" placeholder="6" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="minCashOnCash"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Min Cash on Cash (%)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" placeholder="8" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="maxPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Max Price ($)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="500000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="propertyTypes"
          render={() => (
            <FormItem>
              <FormLabel>Property Types</FormLabel>
              <div className="grid grid-cols-2 gap-2">
                {propertyTypeOptions.map((option) => (
                  <FormField
                    key={option.value}
                    control={form.control}
                    name="propertyTypes"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(option.value)}
                            onCheckedChange={(checked) => {
                              const current = field.value || [];
                              if (checked) {
                                field.onChange([...current, option.value]);
                              } else {
                                field.onChange(
                                  current.filter((v) => v !== option.value)
                                );
                              }
                            }}
                          />
                        </FormControl>
                        <Label className="font-normal">{option.label}</Label>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="targetMarkets"
          render={() => (
            <FormItem>
              <FormLabel>Target Markets</FormLabel>
              <div className="grid grid-cols-2 gap-2">
                {marketOptions.map((option) => (
                  <FormField
                    key={option.value}
                    control={form.control}
                    name="targetMarkets"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(option.value)}
                            onCheckedChange={(checked) => {
                              const current = field.value || [];
                              if (checked) {
                                field.onChange([...current, option.value]);
                              } else {
                                field.onChange(
                                  current.filter((v) => v !== option.value)
                                );
                              }
                            }}
                          />
                        </FormControl>
                        <Label className="font-normal">{option.label}</Label>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3">
          <Button type="submit" disabled={createCriteria.isPending}>
            {createCriteria.isPending ? "Creating..." : "Create Criteria"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
