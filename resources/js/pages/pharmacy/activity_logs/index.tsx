import { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import type { PageProps } from '@inertiajs/core';
import {
    Activity,
    Search,
    Calendar,
    Filter,
    User,
    Package,
    Pill,
    Truck,
    Users,
    FileText,
    Clock,
    Eye,
    Trash2,
    RefreshCw,
    AlertCircle,
    CheckCircle,
    XCircle,
    MoreVertical,
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import Heading from '@/components/heading';
import { usePermissions } from '@/hooks/usePermissions';

interface ActivityLog {
    id: number;
    description: string;
    subject_type: string | null;
    subject_id: number | null;
    causer_id: number | null;
    causer_name: string;
    causer_email: string;
    properties: Record<string, any>;
    created_at: string;
    log_name: string;
    event: string | null;
    batch_uuid: string | null;
}

interface ActivityLogsPageProps extends PageProps {
    logs: {
        data: ActivityLog[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: {
        search?: string;
        event_type?: string;
        subject_type?: string;
        date_from?: string;
        date_to?: string;
    };
    eventTypes: string[];
    subjectTypes: string[];
    stats: {
        total: number;
        today: number;
        this_week: number;
        this_month: number;
        by_event: Record<string, number>;
    };
}

const ActivityLogsIndex: React.FC<ActivityLogsPageProps> = ({
    logs,
    filters,
    eventTypes,
    subjectTypes,
    stats,
}) => {
    const { can } = usePermissions();
    const [search, setSearch] = useState(filters.search || '');
    const [eventType, setEventType] = useState(filters.event_type || '');
    const [subjectType, setSubjectType] = useState(filters.subject_type || '');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');
    const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null);
    const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);

    const getEventIcon = (description: string) => {
        const lower = description.toLowerCase();
        if (lower.includes('created') || lower.includes('added')) {
            return <CheckCircle className="h-4 w-4 text-green-500" />;
        }
        if (lower.includes('updated') || lower.includes('edited')) {
            return <RefreshCw className="h-4 w-4 text-blue-500" />;
        }
        if (lower.includes('deleted') || lower.includes('removed')) {
            return <Trash2 className="h-4 w-4 text-red-500" />;
        }
        if (lower.includes('dispensed') || lower.includes('used')) {
            return <Activity className="h-4 w-4 text-purple-500" />;
        }
        if (lower.includes('login') || lower.includes('logout')) {
            return <User className="h-4 w-4 text-indigo-500" />;
        }
        return <Activity className="h-4 w-4 text-gray-500" />;
    };

    const getSubjectIcon = (subjectType: string | null) => {
        if (!subjectType) return <Activity className="h-4 w-4 text-gray-400" />;
        const type = subjectType.toLowerCase();
        if (type.includes('drug')) return <Pill className="h-4 w-4 text-blue-500" />;
        if (type.includes('batch')) return <Package className="h-4 w-4 text-green-500" />;
        if (type.includes('supplier')) return <Truck className="h-4 w-4 text-purple-500" />;
        if (type.includes('user')) return <Users className="h-4 w-4 text-indigo-500" />;
        if (type.includes('usage') || type.includes('record')) {
            return <FileText className="h-4 w-4 text-orange-500" />;
        }
        return <Activity className="h-4 w-4 text-gray-400" />;
    };

    const getEventBadgeColor = (description: string) => {
        const lower = description.toLowerCase();
        if (lower.includes('created') || lower.includes('added')) {
            return 'bg-green-100 text-green-800';
        }
        if (lower.includes('updated') || lower.includes('edited')) {
            return 'bg-blue-100 text-blue-800';
        }
        if (lower.includes('deleted') || lower.includes('removed')) {
            return 'bg-red-100 text-red-800';
        }
        if (lower.includes('dispensed') || lower.includes('used')) {
            return 'bg-purple-100 text-purple-800';
        }
        if (lower.includes('login')) {
            return 'bg-indigo-100 text-indigo-800';
        }
        if (lower.includes('logout')) {
            return 'bg-gray-100 text-gray-800';
        }
        return 'bg-gray-100 text-gray-800';
    };

    const handleSearch = () => {
        router.get('/activity-logs', {
            search,
            event_type: eventType,
            subject_type: subjectType,
            date_from: dateFrom,
            date_to: dateTo,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleClearFilters = () => {
        setSearch('');
        setEventType('');
        setSubjectType('');
        setDateFrom('');
        setDateTo('');
        router.get('/activity-logs');
    };

    const handleClearLogs = () => {
        router.post('/activity-logs/clear', {}, {
            onSuccess: () => setIsClearDialogOpen(false),
        });
    };

    const handleViewLog = (log: ActivityLog) => {
        setSelectedLog(log);
    };

    return (
        <>
            <Head title="Activity Logs" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="flex items-center justify-between">
                    <Heading
                        title="Activity Logs"
                        description="Track all system activities and user actions."
                    />
                    {can('clear_activity_logs') && (
                        <AlertDialog open={isClearDialogOpen} onOpenChange={setIsClearDialogOpen}>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Clear All Logs
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Clear All Activity Logs</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete all activity logs.
                                        Are you sure you want to continue?
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleClearLogs} className="bg-red-600 hover:bg-red-700">
                                        Yes, Clear All
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="pt-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Total Activities</p>
                                    <p className="text-2xl font-bold">{stats.total}</p>
                                </div>
                                <div className="p-2 bg-blue-100 rounded-full">
                                    <Activity className="h-5 w-5 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Today</p>
                                    <p className="text-2xl font-bold">{stats.today}</p>
                                </div>
                                <div className="p-2 bg-green-100 rounded-full">
                                    <Clock className="h-5 w-5 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">This Week</p>
                                    <p className="text-2xl font-bold">{stats.this_week}</p>
                                </div>
                                <div className="p-2 bg-purple-100 rounded-full">
                                    <Calendar className="h-5 w-5 text-purple-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">This Month</p>
                                    <p className="text-2xl font-bold">{stats.this_month}</p>
                                </div>
                                <div className="p-2 bg-orange-100 rounded-full">
                                    <FileText className="h-5 w-5 text-orange-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filters</CardTitle>
                        <CardDescription>Filter activity logs by various criteria.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                            <div>
                                <Input
                                    placeholder="Search by action, user..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <Select
                                    value={eventType}
                                    onValueChange={(value) => setEventType(value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Events" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Events</SelectItem>
                                        {eventTypes.map((type) => (
                                            <SelectItem key={type} value={type}>
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Select
                                    value={subjectType}
                                    onValueChange={(value) => setSubjectType(value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Subjects" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Subjects</SelectItem>
                                        {subjectTypes.map((type) => (
                                            <SelectItem key={type} value={type}>
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Input
                                    type="date"
                                    value={dateFrom}
                                    onChange={(e) => setDateFrom(e.target.value)}
                                    placeholder="Date From"
                                />
                            </div>

                            <div>
                                <Input
                                    type="date"
                                    value={dateTo}
                                    onChange={(e) => setDateTo(e.target.value)}
                                    placeholder="Date To"
                                />
                            </div>
                        </div>

                        <div className="flex mt-4 gap-2">
                            <Button onClick={handleSearch}>
                                <Search className="h-4 w-4 mr-2" />
                                Apply Filters
                            </Button>
                            <Button variant="outline" onClick={handleClearFilters}>
                                Clear Filters
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Logs Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>Activity Logs</span>
                            <Badge className="bg-blue-100 text-blue-800">
                                {logs.total} entries
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Action</TableHead>
                                    <TableHead>Subject</TableHead>
                                    <TableHead>User</TableHead>
                                    <TableHead>Details</TableHead>
                                    <TableHead>Time</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {logs.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                            <Activity className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                            No activity logs found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    logs.data.map((log) => (
                                        <TableRow key={log.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {getEventIcon(log.description)}
                                                    <Badge className={getEventBadgeColor(log.description)}>
                                                        {log.description}
                                                    </Badge>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {getSubjectIcon(log.subject_type)}
                                                    <span className="text-sm">
                                                        {log.subject_type || 'N/A'}
                                                        {log.subject_id && ` #${log.subject_id}`}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
                                                        {log.causer_name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium">{log.causer_name}</div>
                                                        <div className="text-xs text-gray-500">{log.causer_email}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {log.properties ? (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleViewLog(log)}
                                                    >
                                                        <Eye className="h-3 w-3 mr-1" />
                                                        View Details
                                                    </Button>
                                                ) : (
                                                    <span className="text-sm text-gray-400">No details</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm">
                                                    {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {format(new Date(log.created_at), 'MMM dd, yyyy HH:mm')}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem onClick={() => handleViewLog(log)}>
                                                            <Eye className="h-4 w-4 mr-2" />
                                                            View Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-red-600"
                                                            onClick={() => {
                                                                // Add delete single log functionality if needed
                                                            }}
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-2" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>

                        {/* Pagination */}
                        {logs.total > 0 && (
                            <div className="p-4 border-t mt-4">
                                <div className="flex justify-between items-center">
                                    <p className="text-sm text-gray-500">
                                        Showing {logs.from} to {logs.to} of {logs.total} results
                                    </p>
                                    <div className="flex space-x-2">
                                        {logs.links.map((link, index) => (
                                            <Button
                                                key={index}
                                                size="sm"
                                                variant={link.active ? 'default' : 'outline'}
                                                onClick={() => link.url && router.get(link.url)}
                                                disabled={!link.url}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* View Log Details Dialog */}
            <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5" />
                            Activity Log Details
                        </DialogTitle>
                        <DialogDescription>
                            Detailed information about this activity.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedLog && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Action</label>
                                    <p className="font-medium">{selectedLog.description}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Event</label>
                                    <p className="font-medium">{selectedLog.event || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Subject</label>
                                    <p className="font-medium">
                                        {selectedLog.subject_type || 'N/A'}
                                        {selectedLog.subject_id && ` (#${selectedLog.subject_id})`}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">User</label>
                                    <p className="font-medium">{selectedLog.causer_name}</p>
                                    <p className="text-sm text-gray-500">{selectedLog.causer_email}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Created At</label>
                                    <p className="font-medium">{format(new Date(selectedLog.created_at), 'MMM dd, yyyy HH:mm:ss')}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Log Name</label>
                                    <p className="font-medium">{selectedLog.log_name || 'N/A'}</p>
                                </div>
                                <div className="col-span-2">
                                    <label className="text-sm font-medium text-gray-500">Properties</label>
                                    <div className="bg-gray-50 rounded p-4 mt-1 overflow-auto max-h-60">
                                        <pre className="text-sm">
                                            {JSON.stringify(selectedLog.properties, null, 2)}
                                        </pre>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ActivityLogsIndex;