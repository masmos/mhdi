<?php

namespace App\Services;

use App\Exceptions\InsufficientStockException;
use App\Models\Batch;
use App\Models\Drug;
use App\Models\InventoryAdjustment;
use Illuminate\Support\Facades\DB;

class InventoryService
{
   public function getLowStockDrugs()
    {
        return Drug::withCount(['batches as total_stock' => function ($query) {
            $query->where('status', 'active')->select(DB::raw('SUM(quantity)'));
        }])->having('total_stock', '<', DB::raw('reorder_level'))->get();
    }

    public function getExpirySummary(): array
    {
        return [
            'expired' => Batch::expired()->count(),
            'expiring_7_days' => Batch::expiringIn(7)->count(),
            'expiring_30_days' => Batch::expiringIn(30)->count(),
            'safe_stock' => Batch::active()->where('expiry_date', '>', now()->addDays(30))->count(),
        ];
    }

    public function transferStock(int $batchId, string $fromLocation, string $toLocation, int $quantity, int $performedBy): void
    {
        $batch = Batch::findOrFail($batchId);
        if ($batch->quantity < $quantity) {
            throw new InsufficientStockException("Insufficient stock for transfer.");
        }

        DB::transaction(function () use ($batch, $fromLocation, $toLocation, $quantity, $performedBy) {
            if ($batch->quantity == $quantity) {
                $batch->update(['location' => $toLocation]);
            } else {
                $newBatch = $batch->replicate();
                $newBatch->quantity = $quantity;
                $newBatch->location = $toLocation;
                $newBatch->batch_number = $batch->batch_number . '-TRANS-' . now()->timestamp;
                $newBatch->save();
                $batch->decrement('quantity', $quantity);
            }

            InventoryAdjustment::create([
                'batch_id' => $batch->id,
                'adjustment_type' => 'subtract',
                'quantity' => $quantity,
                'reason' => "Transferred from {$fromLocation} to {$toLocation}",
                'performed_by' => $performedBy,
            ]);
        });
    }
}
