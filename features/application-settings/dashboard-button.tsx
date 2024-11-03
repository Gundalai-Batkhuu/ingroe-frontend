import { LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardButtonProps {
  isNavbarExpanded: boolean;
}

export function DashboardButton({ isNavbarExpanded }: DashboardButtonProps) {
  return (
    <div className="w-full flex justify-center rounded-lg px-2">
      <Button 
        variant="ghost" 
        className={`${
          isNavbarExpanded 
            ? 'w-full justify-between bg-brand-green hover:bg-gray-100 dark:hover:bg-gray-800 group' 
            : 'w-10 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 group'
        }`}
      >
        {isNavbarExpanded ? (
          <>
            <span className="text-white text-md font-bold group-hover:text-muted-foreground">
              Dashboard
            </span>
            <LayoutGrid className="size-5 text-white transition-colors group-hover:text-brand-green" />
          </>
        ) : (
          <LayoutGrid className="size-5 text-muted-foreground transition-colors group-hover:text-brand-green" />
        )}
      </Button>
    </div>
  )
}