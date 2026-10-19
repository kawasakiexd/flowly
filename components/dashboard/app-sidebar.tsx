"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Megaphone,
  Package,
  Settings,
  ShoppingBag,
  Users,
} from "lucide-react";

import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { dashboardCopy } from "@/content/dashboard";

import { useOrdersParams } from "./orders/use-orders-params";

const ANALYTICS = [
  {
    href: "/dashboard" as Route,
    label: dashboardCopy.nav.overview,
    icon: LayoutDashboard,
  },
  {
    href: "/dashboard/orders" as Route,
    label: dashboardCopy.nav.orders,
    icon: ShoppingBag,
  },
] as const;

const STORE = [
  { label: dashboardCopy.nav.customers, icon: Users },
  { label: dashboardCopy.nav.products, icon: Package },
  { label: dashboardCopy.nav.marketing, icon: Megaphone },
] as const;

function preservedQuery(params: {
  range: string;
  from: string | null;
  to: string | null;
  demo: string;
}) {
  const search = new URLSearchParams();
  if (params.range !== "30d") {
    search.set("range", params.range);
  }
  if (params.range === "custom" && params.from) {
    search.set("from", params.from);
  }
  if (params.range === "custom" && params.to) {
    search.set("to", params.to);
  }
  if (params.demo !== "normal") {
    search.set("demo", params.demo);
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export function AppSidebar() {
  const pathname = usePathname();
  const { params } = useOrdersParams();
  const query = preservedQuery(params);

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader className="gap-3 p-3">
        <Logo gradientId="flowly-sidebar" className="px-1" />
        <div className="px-1 group-data-[collapsible=icon]:hidden">
          <p className="text-sm font-medium">{dashboardCopy.storeName}</p>
          <p className="text-xs text-muted-foreground">
            {dashboardCopy.storeHint}
          </p>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {dashboardCopy.groups.analytics}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {ANALYTICS.map((item) => {
                const active = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={item.label}
                      className={
                        active
                          ? "bg-primary/10 text-primary data-active:bg-primary/10 data-active:text-primary"
                          : undefined
                      }
                    >
                      <Link
                        href={`${item.href}${query}` as Route}
                        aria-current={active ? "page" : undefined}
                      >
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>{dashboardCopy.groups.store}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {STORE.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SidebarMenuButton
                        disabled
                        tooltip={dashboardCopy.soonTooltip}
                      >
                        <item.icon />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      {dashboardCopy.soonTooltip}
                    </TooltipContent>
                  </Tooltip>
                  <SidebarMenuBadge>{dashboardCopy.soon}</SidebarMenuBadge>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <Tooltip>
              <TooltipTrigger asChild>
                <SidebarMenuButton disabled tooltip={dashboardCopy.soonTooltip}>
                  <Settings />
                  <span>{dashboardCopy.nav.settings}</span>
                </SidebarMenuButton>
              </TooltipTrigger>
              <TooltipContent side="right">
                {dashboardCopy.soonTooltip}
              </TooltipContent>
            </Tooltip>
            <SidebarMenuBadge>{dashboardCopy.soon}</SidebarMenuBadge>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarSeparator className="group-data-[collapsible=icon]:hidden" />
        <div className="rounded-lg border-sidebar-border bg-sidebar-accent/40 p-3 group-data-[collapsible=icon]:hidden">
          <p className="text-sm font-medium">{dashboardCopy.promo.title}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {dashboardCopy.promo.text}
          </p>
          <Button className="mt-3 w-full" size="sm" asChild>
            <Link href={"/" as Route}>{dashboardCopy.promo.cta}</Link>
          </Button>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
