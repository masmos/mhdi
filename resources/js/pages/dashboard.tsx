import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard } from '@/routes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardPageProps } from '@/types/inertia';
import { AlertCircle, AlertTriangle, Building2, ClipboardList, Package, Pill, TrendingUp } from 'lucide-react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    Cell,
    ResponsiveContainer,
} from 'recharts';
import Heading from '@/components/heading';

const COLORS = ['#22c55e', '#eab308', '#ef4444', '#3b82f6', '#8b5cf6'];

interface StatCardProps {
    title: string;
    value: number | string;
    icon: React.ElementType;
    color: string;
    subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    icon: Icon,
    color,
    subtitle,
}) => (
    <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
                {title}
            </CardTitle>

            <div className={`p-2 rounded-full bg-${color}-100`}>
                <Icon className={`h-4 w-4 text-${color}-600`} />
            </div>
        </CardHeader>

        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            {subtitle && (
                <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            )}
        </CardContent>
    </Card>
);

export default function Dashboard({
    stats,
    usageTrend,
    expiryDistribution,
    topDrugs,
    departmentUsage,
}: DashboardPageProps) {
    const { auth } = usePage<DashboardPageProps>().props;

    return (
        <>
            <Head title="Pharmacy Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4 );">
                {/* Welcome */}
                
               <Heading
                    title={`Welcome back, ${auth.user.name}`}
                    description="Here's what's happening in your pharmacy today"
                />

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <StatCard title="Total Drugs" value={stats.totalDrugs} icon={Pill} color="blue" />

                    <StatCard
                        title="Total Stock"
                        value={stats.totalStock}
                        icon={Package}
                        color="green"
                        subtitle={`${stats.lowStockDrugs} drugs below reorder level`}
                    />

                    <StatCard
                        title="Expiring Soon"
                        value={stats.expiringSoon}
                        icon={AlertTriangle}
                        color="yellow"
                        subtitle={`${stats.expiredBatches} already expired`}
                    />

                    <StatCard
                        title="Total Suppliers"
                        value={stats.totalSuppliers}
                        icon={Building2}
                        color="purple"
                    />
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Usage Trend */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5" />
                                Usage Trend (Last 7 Days)
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={usageTrend}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="total_usage"
                                        stroke="#3b82f6"
                                        strokeWidth={2}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Expiry Distribution */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertCircle className="h-5 w-5" />
                                Stock Status Distribution
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={expiryDistribution}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        dataKey="value"
                                        label={({ name, percent = 0 }) =>
                                            `${name} ${(percent * 100).toFixed(0)}%`
                                        }
                                    >
                                        {expiryDistribution.map((_, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={COLORS[index % COLORS.length]}
                                            />
                                        ))}
                                    </Pie>

                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Bottom Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Top Drugs */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Top 5 Most Used Drugs (Monthly)</CardTitle>
                        </CardHeader>

                        <CardContent className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={topDrugs}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="used" fill="#8b5cf6" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Department Usage */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Department Usage (Monthly)</CardTitle>
                        </CardHeader>

                        <CardContent className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={departmentUsage}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="department" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="used" fill="#f59e0b" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Link
                        href="/drugs/create"
                        className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition text-center"
                    >
                        <Pill className="h-6 w-6 text-blue-600 mx-auto" />
                        <span className="text-sm text-blue-600 mt-2 block">Add Drug</span>
                    </Link>

                    <Link
                        href="/batches/create"
                        className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition text-center"
                    >
                        <Package className="h-6 w-6 text-green-600 mx-auto" />
                        <span className="text-sm text-green-600 mt-2 block">Add Batch</span>
                    </Link>

                    <Link
                        href="/inventory/expiry"
                        className="p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition text-center"
                    >
                        <AlertTriangle className="h-6 w-6 text-yellow-600 mx-auto" />
                        <span className="text-sm text-yellow-600 mt-2 block">Check Expiry</span>
                    </Link>

                    <Link
                        href="/usage"
                        className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition text-center"
                    >
                        <ClipboardList className="h-6 w-6 text-purple-600 mx-auto" />
                        <span className="text-sm text-purple-600 mt-2 block">Record Usage</span>
                    </Link>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
