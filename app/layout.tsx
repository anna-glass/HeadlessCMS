import type { Metadata } from "next";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SidebarWrapper } from "@/components/sidebar-wrapper";
import { stackServerApp } from "./stack";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chapter Street",
  description: "Chapter Street",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StackProvider app={stackServerApp}>
          <StackTheme>
            <SidebarProvider>
              <div className="flex min-h-screen min-w-full">
                <SidebarWrapper />
                <main className="flex flex-1 flex-col p-4">
                  <SidebarTrigger className="mb-4 self-start" />
                  <div className="flex flex-1 min-w-full p-12">
                    {children}
                  </div>
                </main>
              </div>
            </SidebarProvider>
          </StackTheme>
        </StackProvider>
      </body>
    </html>
  );
}
