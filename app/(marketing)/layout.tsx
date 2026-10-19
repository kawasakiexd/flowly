import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { MotionProvider } from "@/components/motion/motion-provider";

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <MotionProvider>
      <SiteHeader variant="page" />
      <main id="main">{children}</main>
      <SiteFooter />
    </MotionProvider>
  );
}
