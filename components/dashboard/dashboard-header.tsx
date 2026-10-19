import { ThemeToggle } from "@/components/shared/theme-toggle";
import {
  DateRangeCaption,
  DateRangePicker,
} from "@/components/dashboard/date-range-picker";
import { ScenarioMenu } from "@/components/dashboard/scenario-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { dashboardCopy } from "@/content/dashboard";

export function DashboardHeader({ title }: { title: string }) {
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-sm sm:px-6">
      <SidebarTrigger
        className="size-11 sm:size-8"
        aria-label={dashboardCopy.toggleSidebar}
      />
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-lg font-semibold tracking-tight">
          {title}
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative">
          <DateRangePicker />
          <DateRangeCaption className="absolute top-full right-0 mt-1" />
        </div>
        <ScenarioMenu />
        <ThemeToggle className="size-11 sm:size-8" />
        <Tooltip>
          <TooltipTrigger asChild>
            <Avatar size="sm" className="size-8">
              <AvatarFallback>MC</AvatarFallback>
            </Avatar>
          </TooltipTrigger>
          <TooltipContent>{dashboardCopy.avatar}</TooltipContent>
        </Tooltip>
      </div>
    </header>
  );
}
