import { Home, Target, MapPin, Heart, TrendingUp, Calendar, BarChart3, MapPinned } from "lucide-react";
import { NavigationLink } from "./NavigationLink";

export const DashboardHeader = () => {
  return (
    <div className="border-b bg-card/50 backdrop-blur-xl">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              PropFlow AI
            </h1>
            <p className="text-muted-foreground mt-2 text-sm font-medium">Autonomous Deal Discovery Platform</p>
          </div>
        </div>

        <nav className="flex gap-2 mb-8">
          <NavigationLink to="/" icon={Home}>Dashboard</NavigationLink>
          <NavigationLink to="/criteria" icon={Target}>Criteria</NavigationLink>
          <NavigationLink to="/markets" icon={MapPin}>Markets</NavigationLink>
          <NavigationLink to="/favorites" icon={Heart}>Favorites</NavigationLink>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="group relative p-6 rounded-xl border bg-gradient-to-br from-card to-card/50 hover:shadow-lg transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-success/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-muted-foreground">Hot Deals</p>
                <div className="p-2 rounded-lg bg-success/10">
                  <TrendingUp className="h-4 w-4 text-success" />
                </div>
              </div>
              <p className="text-3xl font-bold mb-1">4</p>
              <p className="text-xs text-muted-foreground">Score ≥ 80</p>
            </div>
          </div>
          
          <div className="group relative p-6 rounded-xl border bg-gradient-to-br from-card to-card/50 hover:shadow-lg transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-muted-foreground">New Today</p>
                <div className="p-2 rounded-lg bg-primary/10">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
              </div>
              <p className="text-3xl font-bold mb-1">2</p>
              <p className="text-xs text-muted-foreground">Properties added</p>
            </div>
          </div>
          
          <div className="group relative p-6 rounded-xl border bg-gradient-to-br from-card to-card/50 hover:shadow-lg transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-warning/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-muted-foreground">Avg Deal Score</p>
                <div className="p-2 rounded-lg bg-warning/10">
                  <BarChart3 className="h-4 w-4 text-warning" />
                </div>
              </div>
              <p className="text-3xl font-bold mb-1">76</p>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </div>
          </div>
          
          <div className="group relative p-6 rounded-xl border bg-gradient-to-br from-card to-card/50 hover:shadow-lg transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-chart-3/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-muted-foreground">Markets Tracked</p>
                <div className="p-2 rounded-lg bg-chart-3/10">
                  <MapPinned className="h-4 w-4 text-[hsl(var(--chart-3))]" />
                </div>
              </div>
              <p className="text-3xl font-bold mb-1">2</p>
              <p className="text-xs text-muted-foreground">Tampa, Orlando</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
