import { CircleHelp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HelpCenterProps {
  isNavbarExpanded: boolean;
  toggleNavbar: () => void;
}

export function HelpCenter({ isNavbarExpanded, toggleNavbar }: HelpCenterProps) {
  return (
    <>
      {isNavbarExpanded ? (
        <Button variant="ghost" className="group flex w-full items-center justify-between px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">
          <div className="flex items-center gap-3">
            <CircleHelp className="size-5 text-muted-foreground transition-colors group-hover:text-brand-green"/>
            <span className="text-sm font-bold text-foreground dark:text-foreground">Help Center</span>
          </div>
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
            8
          </div>
        </Button>
      ) : (
        <Button
          variant="ghost"
          className="group flex items-center justify-center px-2 hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={() => toggleNavbar()}
        >
          <CircleHelp className="size-5 text-muted-foreground transition-colors group-hover:text-brand-green"/>
        </Button>
      )}
    </>
  );
}