<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UsageRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'batch_id', 'drug_id', 'quantity_used', 'department',
        'patient_id', 'prescribed_by', 'administered_by',
        'usage_date', 'notes'
    ];

    protected $casts = [
        'usage_date' => 'date',
        'quantity_used' => 'integer',
    ];

    public function batch()
    {
        return $this->belongsTo(Batch::class);
    }

    public function drug()
    {
        return $this->belongsTo(Drug::class);
    }

    public function prescriber()
    {
        return $this->belongsTo(User::class, 'prescribed_by');
    }

    public function administrator()
    {
        return $this->belongsTo(User::class, 'administered_by');
    }

    public function scopeByDepartment($query, $department)
    {
        return $query->where('department', $department);
    }

    public function scopeDateRange($query, $start, $end)
    {
        return $query->whereBetween('usage_date', [$start, $end]);
    }
}
