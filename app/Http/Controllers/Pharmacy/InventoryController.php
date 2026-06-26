<?php

namespace App\Http\Controllers\Pharmacy;

use App\Http\Controllers\Controller;
use App\Models\Batch;
use App\Models\Drug;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class InventoryController extends Controller
{
    use AuthorizesRequests;

    public function index(Request $request): Response
    {
        $this->authorize('view_inventory');

        $drugs = Drug::withCount(['batches as total_stock' => function ($q) {
            $q->where('status', 'active')->select(DB::raw('SUM(quantity)'));
        }])
            ->having('total_stock', '>', 0)
            ->orderBy('name')
            ->paginate(20);

        return Inertia::render('Pharmacy/Inventory/Index', [
            'drugs' => $drugs,
        ]);
    }

    public function expiryView(Request $request): Response
    {
        $this->authorize('view_inventory');

        $batches = Batch::with(['drug', 'supplier'])
            ->where('expiry_date', '<=', now()->addDays(30))
            ->where('status', '!=', 'expired')
            ->orderBy('expiry_date')
            ->paginate(20);

        return Inertia::render('Pharmacy/Inventory/Expiry', [
            'batches' => $batches,
        ]);
    }

    public function lowStock(Request $request): Response
    {
        $this->authorize('view_inventory');

        $drugs = Drug::withCount(['batches as total_stock' => function ($q) {
            $q->where('status', 'active')->select(DB::raw('SUM(quantity)'));
        }])
            ->having('total_stock', '<', DB::raw('reorder_level'))
            ->orderBy('name')
            ->paginate(20);

        return Inertia::render('Pharmacy/Inventory/LowStock', [
            'drugs' => $drugs,
        ]);
    }
}
