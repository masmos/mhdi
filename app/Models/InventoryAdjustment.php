<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class InventoryAdjustment extends Model
{
    use LogsActivity;

    protected $fillable = [
        'batch_id',
        'adjustment_type',
        'quantity',
        'reason',
        'performed_by'
    ];

    public function batch()
    {
        return $this->belongsTo(Batch::class);
    }

    public function performer()
    {
        return $this->belongsTo(User::class, 'performed_by');
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }
}
