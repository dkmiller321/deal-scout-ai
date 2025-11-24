import { Link, useLocation } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationLinkProps {
  to: string;
  icon: LucideIcon;
  children: React.ReactNode;
}

export const NavigationLink = ({ to, icon: Icon, children }: NavigationLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={cn(
        "relative flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
        isActive
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
      )}
    >
      <Icon className="h-4 w-4" />
      {children}
      {isActive && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-primary rounded-full" />
      )}
    </Link>
  );
};
