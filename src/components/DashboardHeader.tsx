import { Home, Target, MapPin, Heart } from "lucide-react";
import { NavigationLink } from "./NavigationLink";

export const DashboardHeader = () => {
  return (
    <div className="border-b bg-card">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">PropFlow AI</h1>
            <p className="text-muted-foreground mt-1">Autonomous Deal Discovery Platform</p>
          </div>
        </div>

        <nav className="flex gap-1 mb-6">
          <NavigationLink to="/" icon={Home}>Dashboard</NavigationLink>
          <NavigationLink to="/criteria" icon={Target}>Criteria</NavigationLink>
          <NavigationLink to="/markets" icon={MapPin}>Markets</NavigationLink>
          <NavigationLink to="/favorites" icon={Heart}>Favorites</NavigationLink>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 border rounded-lg bg-muted/30">
            <p className="text-sm text-muted-foreground mb-1">Hot Deals</p>
            <p className="text-2xl font-bold">4</p>
            <p className="text-xs text-muted-foreground mt-1">Score ≥ 80</p>
          </div>
          <div className="p-4 border rounded-lg bg-muted/30">
            <p className="text-sm text-muted-foreground mb-1">New Today</p>
            <p className="text-2xl font-bold">2</p>
            <p className="text-xs text-muted-foreground mt-1">Properties added</p>
          </div>
          <div className="p-4 border rounded-lg bg-muted/30">
            <p className="text-sm text-muted-foreground mb-1">Avg Deal Score</p>
            <p className="text-2xl font-bold">76</p>
            <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
          </div>
          <div className="p-4 border rounded-lg bg-muted/30">
            <p className="text-sm text-muted-foreground mb-1">Markets Tracked</p>
            <p className="text-2xl font-bold">2</p>
            <p className="text-xs text-muted-foreground mt-1">Tampa, Orlando</p>
          </div>
        </div>
      </div>
    </div>
  );
};
