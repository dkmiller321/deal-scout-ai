"use client";

import { DashboardHeader } from "@/components/dashboard-header";
import { CriteriaList } from "@/components/criteria-list";
import { CriteriaForm } from "@/components/criteria-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function CriteriaPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Investment Criteria</h1>
            <p className="text-muted-foreground mt-1">
              Define your deal requirements to find matching properties
            </p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Criteria
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Investment Criteria</DialogTitle>
              </DialogHeader>
              <CriteriaForm onSuccess={() => setOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        <CriteriaList />
      </main>
    </div>
  );
}
