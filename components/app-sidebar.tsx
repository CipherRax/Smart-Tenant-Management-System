"use client";

import * as React from "react";
import {
    IconCamera,
    IconChartBar,
    IconDashboard,
    IconDatabase,
    IconFileAi,
    IconFileDescription,
    IconFileWord,
    IconFolder,
    IconHelp,
    IconInnerShadowTop,
    IconListDetails,
    IconReport,
    IconSearch,
    IconSettings,
    IconUsers,
} from "@tabler/icons-react";

import { NavUser } from "@/components/nav-user";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

const data = {
    user: {
        name: "ellyon",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
        { title: "Dashboard", url: "/Dashboard", icon: IconDashboard },
        { title: "Transaction History", url: "/Dashboard/transaction", icon: IconListDetails },
        { title: "Report", url: "/Dashboard/report", icon: IconChartBar },
        { title: "Communication", url: "/Dashboard/communication", icon: IconFolder },
        { title: "Profile", url: "/Dashboard/profile", icon: IconUsers },
    ],
    documents: [
        { name: "CCTV Monitor", url: "/Dashboard/monitor", icon: IconDatabase },
        { name: "Reports", url: "/Dashboard/report", icon: IconReport },
        { name: "AI Assistant", url: "/Dashboard/ai", icon: IconFileWord },
    ],
    navSecondary: [
        { title: "Settings", url: "/Dashboard/settings", icon: IconSettings },
        { title: "Get Help", url: "/Dashboard/help", icon: IconHelp },
        { title: "Explore", url: "/Dashboard/explore", icon: IconSearch },
    ],
};

function SidebarLink({
                         href,
                         icon: Icon,
                         children,
                     }: {
    href: string;
    icon: React.ComponentType<any>;
    children: React.ReactNode;
}) {
    return (
        <SidebarMenuItem>
            <SidebarMenuButton asChild>
                <Link href={href} className="flex items-center gap-2 ">
                    <Icon className="!size-5" />
                    <span>{children}</span>
                </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
}

function NavItems({ items }: { items: typeof data.navMain | typeof data.documents | typeof data.navSecondary }) {
    return (
        <>
            {items.map((item) => (
                <SidebarLink key={(item as any).title || (item as any).name} href={item.url} icon={(item as any).icon}>
                    {(item as any).title || (item as any).name}
                </SidebarLink>
            ))}
        </>
    );
}

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="offcanvas" {...props} >
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
                            <Link href="/Dashboard" className="flex items-center gap-2">
                                <IconInnerShadowTop className="!size-5" />
                                <span className="text-base font-semibold">Elloyn APT.</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent >
                <NavItems items={data.navMain} />
                <NavItems items={data.documents} />
                <div className="mt-auto">
                    <NavItems items={data.navSecondary} />
                </div>
            </SidebarContent>

            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
        </Sidebar>
    );
}
