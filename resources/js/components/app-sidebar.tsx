import { Link } from '@inertiajs/react';
import { BellRing, BookOpen, Boxes, BoxSelect, FileChartColumn, FolderGit2, HandHeart, LayoutGrid, Package, PackagePlus, Pill, ScrollText, Shield, Users } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Drugs',
        href: '/drugs',
        icon: Pill,
    },
    {
        title: 'Suppliers',
        href: '/suppliers',
        icon: Package,
    },
    {
        title: 'Batches',
        href: '/batches',
        icon: Boxes,
    },
    {
        title: 'Receive Stock',
        href: '/batches/create',
        icon: PackagePlus,
    },
    {
        title: 'Dispense',
        href: '/dispense',
        icon: HandHeart,
    },
    {
        title: 'Alerts',
        href: '/alerts',
        icon: BellRing,
    },
    {
        title: 'Reports',
        href: '/stock',
        icon: FileChartColumn,
    },
    {
        title: 'Audit Log',
        href: '/pharmacy/stock',
        icon: ScrollText,
    },
    {
        title: 'Roles & Permissions',
        href: '/roles',
        icon: Shield,
    },
    {
        title: 'User Management',
        href: '/users',
        icon: Users,
    },
];

const footerNavItems: NavItem[] = [
    /* {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    }, */
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
