// resources/js/Pages/Pharmacy/Reports/Index.tsx
import { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import type { PageProps } from '@inertiajs/core';
import { 
    FileSpreadsheet, 
    FileText, 
    Download, 
    Package, 
    Truck, 
    Pill, 
    ClipboardList,
    Users,
    Calendar,
    TrendingUp,
    Printer
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Heading from '@/components/heading';
import { Separator } from '@/components/ui/separator';

interface ReportModule {
    id: string;
    title: string;
    description: string;
    icon: React.ElementType;
    count: number;
    countLabel: string;
    excelRoute: string;
    pdfRoute: string;
    color: string;
}

interface ReportsPageProps extends PageProps {
    stats: {
        drugs: number;
        suppliers: number;
        batches: number;
        usage_records: number;
    };
}

const ReportsIndex: React.FC<ReportsPageProps> = ({ stats }) => {
    const [isExporting, setIsExporting] = useState<string | null>(null);

    const reportModules: ReportModule[] = [
        {
            id: 'drugs',
            title: 'Drug Catalogue',
            description: 'All drugs in inventory',
            icon: Pill,
            count: stats.drugs,
            countLabel: 'records',
            excelRoute: '/reports/drugs/excel',
            pdfRoute: '/reports/drugs/pdf',
            color: 'blue',
        },
        {
            id: 'suppliers',
            title: 'Suppliers',
            description: 'Registered suppliers',
            icon: Truck,
            count: stats.suppliers,
            countLabel: 'records',
            excelRoute: '/reports/suppliers/excel',
            pdfRoute: '/reports/suppliers/pdf',
            color: 'purple',
        },
        {
            id: 'batches',
            title: 'Stock Batches',
            description: 'Current batches & expiry',
            icon: Package,
            count: stats.batches,
            countLabel: 'records',
            excelRoute: '/reports/batches/excel',
            pdfRoute: '/reports/batches/pdf',
            color: 'green',
        },
        {
            id: 'usage',
            title: 'Dispensing Log',
            description: 'Recent dispensings',
            icon: ClipboardList,
            count: stats.usage_records,
            countLabel: 'records',
            excelRoute: '/reports/usage/excel',
            pdfRoute: '/reports/usage/pdf',
            color: 'orange',
        },
    ];

    const handleExport = (route: string, format: 'excel' | 'pdf') => {
        setIsExporting(route);
        
        // Open in new tab or download directly
        window.open(route, '_blank');
        
        setTimeout(() => {
            setIsExporting(null);
        }, 2000);
    };

    const getColorClasses = (color: string) => {
        const colors: Record<string, { bg: string; hover: string; icon: string; border: string }> = {
            blue: {
                bg: 'bg-blue-50',
                hover: 'hover:bg-blue-100',
                icon: 'text-blue-600',
                border: 'border-blue-200',
            },
            purple: {
                bg: 'bg-purple-50',
                hover: 'hover:bg-purple-100',
                icon: 'text-purple-600',
                border: 'border-purple-200',
            },
            green: {
                bg: 'bg-green-50',
                hover: 'hover:bg-green-100',
                icon: 'text-green-600',
                border: 'border-green-200',
            },
            orange: {
                bg: 'bg-orange-50',
                hover: 'hover:bg-orange-100',
                icon: 'text-orange-600',
                border: 'border-orange-200',
            },
            red: {
                bg: 'bg-red-50',
                hover: 'hover:bg-red-100',
                icon: 'text-red-600',
                border: 'border-red-200',
            },
        };
        return colors[color] || colors.blue;
    };

    return (
        <>
            <Head title="Reports" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="flex items-center justify-between">
                    <Heading
                        title="Reports"
                        description="Export inventory data to Excel or PDF."
                    />
                    <div className="flex items-center gap-2">
                        <Badge className="bg-blue-100 text-blue-800">
                            {Object.values(stats).reduce((a, b) => a + b, 0)} Total Records
                        </Badge>
                    </div>
                </div>

                {/* Stats Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="pt-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Drugs</p>
                                    <p className="text-2xl font-bold">{stats.drugs}</p>
                                </div>
                                <div className="p-2 bg-blue-100 rounded-full">
                                    <Pill className="h-5 w-5 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Suppliers</p>
                                    <p className="text-2xl font-bold">{stats.suppliers}</p>
                                </div>
                                <div className="p-2 bg-purple-100 rounded-full">
                                    <Truck className="h-5 w-5 text-purple-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Batches</p>
                                    <p className="text-2xl font-bold">{stats.batches}</p>
                                </div>
                                <div className="p-2 bg-green-100 rounded-full">
                                    <Package className="h-5 w-5 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Dispensing Log</p>
                                    <p className="text-2xl font-bold">{stats.usage_records}</p>
                                </div>
                                <div className="p-2 bg-orange-100 rounded-full">
                                    <ClipboardList className="h-5 w-5 text-orange-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Report Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {reportModules.map((module) => {
                        const colors = getColorClasses(module.color);
                        const Icon = module.icon;

                        return (
                            <Card 
                                key={module.id} 
                                className={`hover:shadow-lg transition-all duration-200 border-2 ${colors.border}`}
                            >
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${colors.bg}`}>
                                            <Icon className={`h-6 w-6 ${colors.icon}`} />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">{module.title}</CardTitle>
                                            <CardDescription>{module.description}</CardDescription>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className="text-sm">
                                        {module.count} {module.countLabel}
                                    </Badge>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-end gap-2 mt-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="gap-2"
                                            onClick={() => handleExport(module.excelRoute, 'excel')}
                                            disabled={isExporting === module.excelRoute}
                                        >
                                            {isExporting === module.excelRoute ? (
                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-t-transparent" />
                                            ) : (
                                                <FileSpreadsheet className="h-4 w-4 text-green-600" />
                                            )}
                                            Excel
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="gap-2"
                                            onClick={() => handleExport(module.pdfRoute, 'pdf')}
                                            disabled={isExporting === module.pdfRoute}
                                        >
                                            {isExporting === module.pdfRoute ? (
                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-t-transparent" />
                                            ) : (
                                                <FileText className="h-4 w-4 text-red-600" />
                                            )}
                                            PDF
                                        </Button>
                                        <Separator orientation="vertical" className="h-8" />
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="gap-2"
                                            onClick={() => handleExport(module.excelRoute, 'excel')}
                                        >
                                            <Download className="h-4 w-4" />
                                            Export
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Additional Reports Section */}
                <Card className="mt-4">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            Advanced Reports
                        </CardTitle>
                        <CardDescription>
                            Generate custom reports for detailed analysis
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Button variant="outline" className="justify-start gap-2 h-auto py-4 px-6">
                                <Calendar className="h-5 w-5 text-blue-600" />
                                <div className="text-left">
                                    <div className="font-medium">Expiry Report</div>
                                    <div className="text-xs text-gray-500">View all expiring/expired batches</div>
                                </div>
                            </Button>
                            <Button variant="outline" className="justify-start gap-2 h-auto py-4 px-6">
                                <Package className="h-5 w-5 text-green-600" />
                                <div className="text-left">
                                    <div className="font-medium">Stock Value Report</div>
                                    <div className="text-xs text-gray-500">Total inventory valuation</div>
                                </div>
                            </Button>
                            <Button variant="outline" className="justify-start gap-2 h-auto py-4 px-6">
                                <Users className="h-5 w-5 text-purple-600" />
                                <div className="text-left">
                                    <div className="font-medium">Department Usage</div>
                                    <div className="text-xs text-gray-500">Usage by department</div>
                                </div>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

export default ReportsIndex;