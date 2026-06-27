<?php

namespace App\Models;

use App\Exceptions\InsufficientStockException;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Batch extends Model
{
    use HasFactory, LogsActivity;
    
    protected $fillable = [
        'drug_id',
        'batch_number',
        'quantity',
        'initial_quantity',
        'unit_cost',
        'selling_price',
        'manufacture_date',
        'expiry_date',
        'supplier_id',
        'received_date',
        'location',
        'status',
        'notes'
    ];

    protected $casts = [
        'expiry_date' => 'date',
        'manufacture_date' => 'date',
        'received_date' => 'date',
        'unit_cost' => 'decimal:2',
        'selling_price' => 'decimal:2',
        'quantity' => 'integer',
        'initial_quantity' => 'integer',
    ];

    public function drug()
    {
        return $this->belongsTo(Drug::class);
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    public function usageRecords()
    {
        return $this->hasMany(UsageRecord::class);
    }

    public function adjustments()
    {
        return $this->hasMany(InventoryAdjustment::class);
    }

    public function notifications()
    {
        return $this->hasMany(ExpiryNotification::class);
    }

    public function getIsExpiredAttribute(): bool
    {
        return $this->expiry_date->isPast();
    }

    public function getIsExpiringSoonAttribute(): bool
    {
        return !$this->is_expired && $this->expiry_date->diffInDays(now()) <= 30;
    }

    public function getRemainingDaysAttribute(): int
    {
        if ($this->is_expired) return 0;
        return max(0, now()->diffInDays($this->expiry_date));
    }

    public function getTotalValueAttribute(): float
    {
        return (float) ($this->quantity * ($this->unit_cost ?? 0));
    }

    public function deductStock(int $quantity, string $department, ?int $administeredBy = null, ?int $prescribedBy = null, ?string $patientId = null): UsageRecord
    {
        if ($this->quantity < $quantity) {
            throw new InsufficientStockException("Insufficient stock. Available: {$this->quantity}");
        }
        if ($this->is_expired) {
            throw new \Exception('Cannot use an expired batch.');
        }

        return DB::transaction(function () use ($quantity, $department, $administeredBy, $prescribedBy, $patientId) {
            $this->decrement('quantity', $quantity);

            $usage = UsageRecord::create([
                'batch_id' => $this->id,
                'drug_id' => $this->drug_id,
                'quantity_used' => $quantity,
                'department' => $department,
                'patient_id' => $patientId,
                'prescribed_by' => $prescribedBy,
                'administered_by' => $administeredBy,
                'usage_date' => now(),
            ]);

            if ($this->quantity <= 0) {
                $this->update(['status' => 'depleted']);
            }

            $this->checkReorderLevel();
            return $usage;
        });
    }

    public function addStock(int $quantity, string $reason, int $performedBy): bool
    {
        return DB::transaction(function () use ($quantity, $reason, $performedBy) {
            $this->increment('quantity', $quantity);

            InventoryAdjustment::create([
                'batch_id' => $this->id,
                'adjustment_type' => 'add',
                'quantity' => $quantity,
                'reason' => $reason,
                'performed_by' => $performedBy,
            ]);

            if ($this->status === 'depleted') {
                $this->update(['status' => 'active']);
            }
            return true;
        });
    }

    /* private function checkReorderLevel(): void
    {
        $totalStock = $this->drug->total_stock;
        if ($totalStock <= $this->drug->reorder_level) {
            event(new \App\Events\LowStockAlert($this->drug));
        }
    } */

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeExpired($query)
    {
        return $query->where('status', 'expired');
    }

    public function scopeExpiringIn($query, int $days)
    {
        return $query->active()
            ->whereBetween('expiry_date', [now(), now()->addDays($days)]);
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }
}
