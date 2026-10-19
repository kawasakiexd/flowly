import { cookies } from "next/headers";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { DemoBanner } from "@/components/dashboard/demo-banner";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false";

  return (
    <NuqsAdapter>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <SidebarInset id="main">
          <DemoBanner />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </NuqsAdapter>
  );
}
