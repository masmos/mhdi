<?php

namespace App\Http\Controllers\Pharmacy;

use App\Http\Controllers\Controller;
use App\Models\Batch;
use App\Models\Drug;
use App\Models\ExpiryNotification;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AlertController extends Controller
{
    use AuthorizesRequests;

    public function index(): Response
    {
        $this->authorize('view_inventory');

        // Get all unresolved alerts
        $alerts = $this->generateAlerts();

        // Calculate stats
        $stats = [
            'total' => $alerts->count(),
            'expiring_soon' => $alerts->where('type', 'expiring_soon')->count(),
            'expired' => $alerts->where('type', 'expired')->count(),
            'low_stock' => $alerts->where('type', 'low_stock')->count(),
            'out_of_stock' => $alerts->where('type', 'out_of_stock')->count(),
        ];

        return Inertia::render('pharmacy/alerts/index', [
            'alerts' => $alerts,
            'stats' => $stats,
        ]);
    }

    public function resolve($id): \Illuminate\Http\RedirectResponse
    {
        $this->authorize('view_inventory');

        // Mark notification as read
        $notification = ExpiryNotification::findOrFail($id);
        $notification->update(['is_read' => true]);

        return redirect()->back()->with('success', 'Alert resolved.');
    }

    public function resolveAll(): \Illuminate\Http\RedirectResponse
    {
        $this->authorize('view_inventory');

        ExpiryNotification::where('is_read', false)->update(['is_read' => true]);

        return redirect()->back()->with('success', 'All alerts resolved.');
    }

    private function generateAlerts()
    {
        $alerts = collect();

        // 1. Expired batches
        $expiredBatches = Batch::where('expiry_date', '<', now())
            ->where('status', '!=', 'expired')
            ->with('drug')
            ->get();

        foreach ($expiredBatches as $batch) {
            // Create notification if not exists
            $notification = ExpiryNotification::firstOrCreate(
                [
                    'batch_id' => $batch->id,
                    'notification_type' => 'expired',
                ],
                [
                    'sent_at' => now(),
                    'sent_to' => [Auth::user()->id],
                    'is_read' => false,
                ]
            );

            if (!$notification->wasRecentlyCreated && $notification->is_read) {
                continue;
            }

            $alerts->push([
                'id' => $notification->id,
                'type' => 'expired',
                'title' => $batch->drug->name . ' has expired',
                'description' => "Batch {$batch->batch_number} expired on {$batch->expiry_date->format('Y-m-d')} ({$batch->quantity} units to remove).",
                'batch_id' => $batch->id,
                'drug_id' => $batch->drug_id,
                'expiry_date' => $batch->expiry_date->format('Y-m-d'),
                'created_at' => $notification->created_at,
                'is_read' => $notification->is_read,
            ]);
        }

        // 2. Expiring soon (within 30 days)
        $expiringSoon = Batch::whereBetween('expiry_date', [now(), now()->addDays(30)])
            ->where('status', 'active')
            ->with('drug')
            ->get();

        foreach ($expiringSoon as $batch) {
            $daysRemaining = now()->diffInDays($batch->expiry_date, false);

            $notification = ExpiryNotification::firstOrCreate(
                [
                    'batch_id' => $batch->id,
                    'notification_type' => 'warning',
                ],
                [
                    'sent_at' => now(),
                    'sent_to' => [Auth::user()->id],
                    'is_read' => false,
                ]
            );

            if (!$notification->wasRecentlyCreated && $notification->is_read) {
                continue;
            }

            $alerts->push([
                'id' => $notification->id,
                'type' => 'expiring_soon',
                'title' => $batch->drug->name . ' is expiring soon',
                'description' => "Batch {$batch->batch_number} expires on {$batch->expiry_date->format('Y-m-d')}.",
                'batch_id' => $batch->id,
                'drug_id' => $batch->drug_id,
                'expiry_date' => $batch->expiry_date->format('Y-m-d'),
                'remaining_days' => $daysRemaining,
                'created_at' => $notification->created_at,
                'is_read' => $notification->is_read,
            ]);
        }

        // 3. Low stock alerts
        $lowStockDrugs = Drug::withCount(['batches as total_stock' => function ($query) {
            $query->where('status', 'active')->select(DB::raw('SUM(quantity)'));
        }])
        ->having('total_stock', '<', DB::raw('reorder_level'))
        ->having('total_stock', '>', 0)
        ->get();

        foreach ($lowStockDrugs as $drug) {
            $notification = ExpiryNotification::firstOrCreate(
                [
                    'batch_id' => null, 
                    'notification_type' => 'low_stock',
                ],
                [
                    'sent_at' => now(),
                    'sent_to' => [Auth::user()->id],
                    'is_read' => false,
                ]
            );

            $alerts->push([
                'id' => $notification->id,
                'type' => 'low_stock',
                'title' => $drug->name . ' is low on stock',
                'description' => "{$drug->name} is low: {$drug->total_stock} units left (reorder level {$drug->reorder_level}).",
                'drug_id' => $drug->id,
                'current_stock' => $drug->total_stock,
                'reorder_level' => $drug->reorder_level,
                'created_at' => $notification->created_at,
                'is_read' => $notification->is_read,
            ]);
        }

        // 4. Out of stock
        $outOfStock = Drug::withCount(['batches as total_stock' => function ($query) {
            $query->where('status', 'active')->select(DB::raw('SUM(quantity)'));
        }])
        ->having('total_stock', '=', 0)
        ->get();

        foreach ($outOfStock as $drug) {
            $notification = ExpiryNotification::firstOrCreate(
                [
                    'batch_id' => 0,
                    'notification_type' => 'out_of_stock',
                ],
                [
                    'sent_at' => now(),
                    'sent_to' => [Auth::user()->id],
                    'is_read' => false,
                ]
            );

            $alerts->push([
                'id' => $notification->id,
                'type' => 'out_of_stock',
                'title' => $drug->name . ' is out of stock',
                'description' => "{$drug->name} is OUT OF STOCK (reorder level {$drug->reorder_level}).",
                'drug_id' => $drug->id,
                'current_stock' => 0,
                'reorder_level' => $drug->reorder_level,
                'created_at' => $notification->created_at,
                'is_read' => $notification->is_read,
            ]);
        }

        return $alerts->sortByDesc('created_at')->values();
    }
}