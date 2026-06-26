<?php

namespace App\Http\Controllers\Pharmacy;

use App\Http\Controllers\Controller;
use App\Models\UsageRecord;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UsageController extends Controller
{
    use AuthorizesRequests;

    public function index(Request $request): Response
    {
        $this->authorize('view_usage');

        $records = UsageRecord::with(['drug', 'batch', 'administrator', 'prescriber'])
            ->when($request->search, fn($q, $s) => $q->whereHas('drug', fn($q) => $q->where('name', 'LIKE', "%{$s}%")))
            ->when($request->department, fn($q, $d) => $q->where('department', $d))
            ->when($request->from, fn($q, $f) => $q->whereDate('usage_date', '>=', $f))
            ->when($request->to, fn($q, $t) => $q->whereDate('usage_date', '<=', $t))
            ->orderBy('usage_date', 'desc')
            ->paginate(20);

        $departments = UsageRecord::distinct()->pluck('department')->filter()->values();

        return Inertia::render('Pharmacy/Usage/Index', [
            'records' => $records,
            'filters' => $request->only(['search', 'department', 'from', 'to']),
            'departments' => $departments,
        ]);
    }
}
