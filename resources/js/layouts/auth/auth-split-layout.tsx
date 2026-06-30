import { Link, usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';
import { Pill } from 'lucide-react';

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { name } = usePage().props;

    return (
        <div className="relative grid h-dvh flex-col items-center justify-center px-8 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0">
            {/* Left Column - Branding Sidebar */}
            <div className="relative hidden h-full flex-col bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 p-10 text-white lg:flex dark:border-r">
                <div className="absolute inset-0 bg-blue-900/50" />
                <div className="relative z-20 flex h-full flex-col justify-between">
                    <div>
                        <Link
                            href={home()}
                            className="relative z-20 flex items-center text-lg font-medium"
                        >
                            <AppLogoIcon className="mr-2 size-8 fill-current text-white" />
                            <span className="text-xl font-bold tracking-tight">
                                Mpigi Hospital
                            </span>
                        </Link>
                        <div className="mt-2 text-sm text-blue-200/80">
                            Pharmacy Management System
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-sm text-blue-100/90">
                            <Pill className="h-5 w-5 text-blue-300" />
                            <span>Batch Tracking & Expiry Alerts</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-blue-100/90">
                            <svg className="h-5 w-5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            <span>Real‑time Inventory & Low‑Stock Alerts</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-blue-100/90">
                            <svg className="h-5 w-5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                            </svg>
                            <span>Comprehensive Reports (Excel & PDF)</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-blue-100/90">
                            <svg className="h-5 w-5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            <span>Secure Role‑Based Access Control</span>
                        </div>
                    </div>

                    <div className="text-xs text-blue-300/60">
                        &copy; {new Date().getFullYear()} Mpigi Hospital. All rights reserved.
                    </div>
                </div>
            </div>

            {/* Right Column - Auth Form */}
            <div className="w-full lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    {/* Mobile Logo */}
                    <Link
                        href={home()}
                        className="relative z-20 flex items-center justify-center gap-2 lg:hidden"
                    >
                        <AppLogoIcon className="h-10 fill-current text-blue-700 sm:h-12" />
                        <span className="text-xl font-bold text-blue-700">
                            Mpigi Hospital
                        </span>
                    </Link>

                    <div className="flex flex-col items-start gap-2 text-left sm:items-center sm:text-center">
                        <h1 className="text-xl font-medium">{title}</h1>
                        <p className="text-sm text-balance text-muted-foreground">
                            {description}
                        </p>
                    </div>

                    {children}
                </div>
            </div>
        </div>
    );
}