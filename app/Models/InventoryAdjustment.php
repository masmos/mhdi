<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InventoryAdjustment extends Model
{
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
}
