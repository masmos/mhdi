import { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import type { PageProps } from '@inertiajs/core';
import { Bell, AlertTriangle, Package, CheckCircle, XCircle, Clock, Calendar, AlertCircle } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import Heading from '@/components/heading';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface AlertItem {
    id: number;
    type: 'expiring_soon' | 'expired' | 'low_stock' | 'out_of_stock';
    title: string;
    description: string;
    batch_id?: number;
    drug_id?: number;
    expiry_date?: string;
    remaining_days?: number;
    current_stock?: number;
    reorder_level?: number;
    created_at: string;
    is_read: boolean;
}

interface AlertsPageProps extends PageProps {
    alerts: AlertItem[];
    stats: {
        total: number;
        expiring_soon: number;
        expired: number;
        low_stock: number;
        out_of_stock: number;
    };
}

const AlertsIndex: React.FC<AlertsPageProps> = ({ alerts, stats }) => {
    const [selectedTab, setSelectedTab] = useState('all');

    const getAlertIcon = (type: string) => {
        switch (type) {
            case 'expired':
                return <XCircle className="h-5 w-5 text-red-500" />;
            case 'expiring_soon':
                return <Clock className="h-5 w-5 text-yellow-500" />;
            case 'low_stock':
                return <AlertTriangle className="h-5 w-5 text-orange-500" />;
            case 'out_of_stock':
                return <AlertCircle className="h-5 w-5 text-red-600" />;
            default:
                return <Bell className="h-5 w-5 text-blue-500" />;
        }
    };

    const getAlertBadge = (type: string) => {
        switch (type) {
            case 'expired':
                return <Badge variant="destructive">Expired</Badge>;
            case 'expiring_soon':
                return <Badge className="bg-yellow-500">Expiring Soon</Badge>;
            case 'low_stock':
                return <Badge className="bg-orange-500">Low Stock</Badge>;
            case 'out_of_stock':
                return <Badge variant="destructive">Out of Stock</Badge>;
            default:
                return <Badge variant="outline">Info</Badge>;
        }
    };

    const getAlertBgColor = (type: string) => {
        switch (type) {
            case 'expired':
                return 'bg-red-50 border-red-200';
            case 'expiring_soon':
                return 'bg-yellow-50 border-yellow-200';
            case 'low_stock':
                return 'bg-orange-50 border-orange-200';
            case 'out_of_stock':
                return 'bg-red-50 border-red-300';
            default:
                return 'bg-gray-50 border-gray-200';
        }
    };

    const handleResolve = (alertId: number) => {
        router.post(`/alerts/${alertId}/resolve`, {}, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const handleResolveAll = () => {
        router.post('/alerts/resolve-all', {}, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const filteredAlerts = alerts.filter(alert => {
        if (selectedTab === 'all') return true;
        if (selectedTab === 'unread') return !alert.is_read;
        return alert.type === selectedTab;
    });

    return (
        <>
            <Head title="Alerts & Notifications" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="flex items-center justify-between">
                    <Heading
                        title="Alerts"
                        description="Monitor expiry dates and stock levels."
                    />
                    <div className="flex items-center gap-2">
                        <Badge className="bg-blue-100 text-blue-800">
                            {stats.total} Alert{stats.total !== 1 ? 's' : ''}
                        </Badge>
                        {alerts.filter(a => !a.is_read).length > 0 && (
                            <Button variant="outline" size="sm" onClick={handleResolveAll}>
                                Resolve All
                            </Button>
                        )}
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="bg-yellow-50 border-yellow-200">
                        <CardContent className="pt-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-yellow-700">Expiring Soon</p>
                                    <p className="text-2xl font-bold text-yellow-800">{stats.expiring_soon}</p>
                                </div>
                                <Clock className="h-8 w-8 text-yellow-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-red-50 border-red-200">
                        <CardContent className="pt-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-red-700">Expired</p>
                                    <p className="text-2xl font-bold text-red-800">{stats.expired}</p>
                                </div>
                                <XCircle className="h-8 w-8 text-red-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-orange-50 border-orange-200">
                        <CardContent className="pt-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-orange-700">Low Stock</p>
                                    <p className="text-2xl font-bold text-orange-800">{stats.low_stock}</p>
                                </div>
                                <AlertTriangle className="h-8 w-8 text-orange-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-red-100 border-red-300">
                        <CardContent className="pt-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-red-800">Out of Stock</p>
                                    <p className="text-2xl font-bold text-red-900">{stats.out_of_stock}</p>
                                </div>
                                <AlertCircle className="h-8 w-8 text-red-700" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Alerts List */}
                <Card className="flex-1">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="h-5 w-5" />
                            Notifications
                        </CardTitle>
                        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-[400px]">
                            <TabsList>
                                <TabsTrigger value="all">All</TabsTrigger>
                                <TabsTrigger value="unread">Unread</TabsTrigger>
                                <TabsTrigger value="expiring_soon">Expiring</TabsTrigger>
                                <TabsTrigger value="expired">Expired</TabsTrigger>
                                <TabsTrigger value="low_stock">Low Stock</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[500px] pr-4">
                            {filteredAlerts.length === 0 ? (
                                <div className="text-center py-12">
                                    <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500">No alerts to display</p>
                                    <p className="text-sm text-gray-400">Everything is looking good!</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {filteredAlerts.map((alert) => (
                                        <Alert
                                            key={alert.id}
                                            className={`border ${getAlertBgColor(alert.type)} relative`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="mt-0.5">
                                                    {getAlertIcon(alert.type)}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <AlertTitle className="flex items-center gap-2">
                                                                {alert.title}
                                                                {getAlertBadge(alert.type)}
                                                            </AlertTitle>
                                                            <AlertDescription className="mt-1">
                                                                {alert.description}
                                                            </AlertDescription>
                                                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                                                <span>
                                                                    {format(new Date(alert.created_at), 'dd MMM yyyy, HH:mm')}
                                                                </span>
                                                                {alert.expiry_date && (
                                                                    <span className="flex items-center gap-1">
                                                                        <Calendar className="h-3 w-3" />
                                                                        Expires: {format(new Date(alert.expiry_date), 'yyyy-MM-dd')}
                                                                    </span>
                                                                )}
                                                                {alert.remaining_days !== undefined && alert.remaining_days > 0 && (
                                                                    <span className="text-yellow-600">
                                                                        {alert.remaining_days} days remaining
                                                                    </span>
                                                                )}
                                                                {alert.current_stock !== undefined && (
                                                                    <span className="text-orange-600">
                                                                        Stock: {alert.current_stock} units
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="h-8 gap-1"
                                                                onClick={() => handleResolve(alert.id)}
                                                            >
                                                                <CheckCircle className="h-4 w-4" />
                                                                Resolve
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Alert>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

export default AlertsIndex;