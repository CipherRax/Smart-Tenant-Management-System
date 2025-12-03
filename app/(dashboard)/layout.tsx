import "../globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import React from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <div className="flex h-screen">
                {/* Sidebar */}
                <AppSidebar />

                {/* Main content area */}
                <main className="flex-1 p-6">
                    <SidebarTrigger />
                    {children}
                </main>
            </div>
        </SidebarProvider>
    );
}
