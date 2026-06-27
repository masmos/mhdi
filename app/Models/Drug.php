<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Drug extends Model
{
    use SoftDeletes, HasFactory, LogsActivity;

    protected $fillable = [
        'name',
        'generic_name',
        'category',
        'manufacturer',
        'unit',
        'dosage_form',
        'strength',
        'reorder_level',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'reorder_level' => 'integer',
    ];

    public function batches()
    {
        return $this->hasMany(Batch::class);
    }

    public function usageRecords()
    {
        return $this->hasMany(UsageRecord::class);
    }

    public function getTotalStockAttribute(): int
    {
        return (int) $this->batches()->where('status', 'active')->sum('quantity');
    }

    public function getTotalValueAttribute(): float
    {
        return (float) $this->batches()
            ->where('status', 'active')
            ->get()
            ->sum(fn($batch) => $batch->quantity * ($batch->unit_cost ?? 0));
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function scopeLowStock(Builder $query): Builder
    {
        return $query->whereHas('batches', function ($q) {
            $q->where('status', 'active')
                ->havingRaw('SUM(quantity) < drugs.reorder_level');
        });
    }

    public function scopeExpiring(Builder $query, int $days = 30): Builder
    {
        return $query->whereHas('batches', function ($q) use ($days) {
            $q->where('status', 'active')
                ->whereBetween('expiry_date', [now(), now()->addDays($days)]);
        });
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }
}
