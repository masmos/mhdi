<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class ExpiryNotification extends Model
{
    use LogsActivity;
    
    protected $fillable = [
        'batch_id',
        'notification_type',
        'sent_at',
        'sent_to',
        'is_read'
    ];

    protected $casts = [
        'sent_to' => 'array',
        'is_read' => 'boolean',
        'sent_at' => 'datetime',
    ];

    public function batch()
    {
        return $this->belongsTo(Batch::class);
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }
}
