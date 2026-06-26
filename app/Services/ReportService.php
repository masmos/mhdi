<?php

namespace App\Services;

use App\Models\Batch;
use App\Models\Drug;
use App\Models\UsageRecord;
use Barryvdh\DomPDF\Facade\Pdf;

class ReportService
{
     public function generateStockReport()
    {
        $drugs = Drug::with(['batches' => function ($q) {
            $q->where('status', 'active');
        }])->get();

        $data = [
            'title' => 'Stock Report',
            'date' => now()->format('Y-m-d H:i'),
            'drugs' => $drugs,
            'total_value' => $drugs->sum(fn($d) => $d->batches->sum(fn($b) => $b->quantity * ($b->unit_cost ?? 0))),
        ];
        return Pdf::loadView('reports.stock', $data);
    }

    public function generateExpiryReport()
    {
        $expired = Batch::where('expiry_date', '<', now())->where('status', '!=', 'expired')->with('drug')->get();
        $soon = Batch::whereBetween('expiry_date', [now(), now()->addDays(30)])->where('status', 'active')->with('drug')->get();

        $data = [
            'title' => 'Expiry Report',
            'date' => now()->format('Y-m-d H:i'),
            'expired' => $expired,
            'soon' => $soon,
        ];
        return Pdf::loadView('reports.expiry', $data);
    }

    public function generateUsageReport($start, $end)
    {
        $usage = UsageRecord::whereBetween('usage_date', [$start, $end])
            ->with('drug')
            ->get()
            ->groupBy('drug_id')
            ->map(fn($records) => [
                'drug' => $records->first()->drug->name,
                'total' => $records->sum('quantity_used'),
            ]);

        $data = [
            'title' => 'Usage Report',
            'date' => now()->format('Y-m-d H:i'),
            'period' => $start->format('Y-m-d') . ' to ' . $end->format('Y-m-d'),
            'usage' => $usage,
        ];
        return Pdf::loadView('reports.usage', $data);
    }
}
