import type { Metadata } from "next";
import { WebAppConfigurator } from "@/widgets/telegram/ui/config";
import { WebAppLoader } from "@/widgets/telegram/ui/loader";
import { AnalyticsDebug } from "@/shared/ui/analytics-debug";


export const metadata: Metadata = {
  title: "",
  description: "",
};

export default async function BaseLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <WebAppLoader />
      <WebAppConfigurator />
      <main className='min-h-screen flex flex-col'>
        {children}
      </main>
      <AnalyticsDebug />
    </>
  );
}
