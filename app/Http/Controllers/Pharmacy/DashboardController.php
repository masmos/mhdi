<?php

namespace App\Http\Controllers\Pharmacy;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Models\Batch;
use App\Models\Drug;
use App\Models\Supplier;
use App\Models\UsageRecord;
use App\Services\InventoryService;
use Carbon\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    use AuthorizesRequests;

    protected InventoryService $inventoryService;

    public function __construct(InventoryService $inventoryService)
    {
        $this->inventoryService = $inventoryService;
    }

    public function index(): Response
    {
        $this->authorize('view_inventory');

        $stats = [
            'totalDrugs' => Drug::active()->count(),
            'totalStock' => Batch::active()->sum('quantity'),
            'expiringSoon' => Batch::expiringIn(30)->count(),
            'expiredBatches' => Batch::expired()->count(),
            'lowStockDrugs' => $this->inventoryService->getLowStockDrugs()->count(),
            'totalSuppliers' => Supplier::count(),
        ];

        $usageTrend = UsageRecord::selectRaw('DATE(usage_date) as date, SUM(quantity_used) as total_usage')
            ->where('usage_date', '>=', Carbon::now()->subDays(7))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(fn($r) => [
                'date' => Carbon::parse($r->date)->format('M d'),
                'total_usage' => (int) $r->total_usage,
            ]);

        $expiryDistribution = [
            ['name' => 'Safe Stock', 'value' => Batch::active()->where('expiry_date', '>', now()->addDays(30))->count()],
            ['name' => 'Expiring Soon', 'value' => Batch::expiringIn(30)->count()],
            ['name' => 'Expired', 'value' => Batch::expired()->count()],
        ];

        $topDrugs = UsageRecord::selectRaw('drug_id, SUM(quantity_used) as total_used')
            ->with('drug')
            ->where('usage_date', '>=', Carbon::now()->subMonth())
            ->groupBy('drug_id')
            ->orderBy('total_used', 'DESC')
            ->limit(5)
            ->get()
            ->map(fn($r) => ['name' => $r->drug->name, 'used' => (int) $r->total_used]);

        $departmentUsage = UsageRecord::selectRaw('department, SUM(quantity_used) as total_used')
            ->where('usage_date', '>=', Carbon::now()->subMonth())
            ->whereNotNull('department')
            ->groupBy('department')
            ->orderBy('total_used', 'DESC')
            ->limit(5)
            ->get()
            ->map(fn($r) => ['department' => $r->department ?? 'Unspecified', 'used' => (int) $r->total_used]);

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'usageTrend' => $usageTrend,
            'expiryDistribution' => $expiryDistribution,
            'topDrugs' => $topDrugs,
            'departmentUsage' => $departmentUsage,
        ]);
    }
}
