<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExpiryNotification extends Model
{
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
}
