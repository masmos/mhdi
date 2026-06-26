<?php

namespace App\Http\Controllers\Pharmacy;

use App\Http\Controllers\Controller;
use App\Services\ReportService;
use Carbon\Carbon;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    use AuthorizesRequests;

    protected ReportService $reportService;

    public function __construct(ReportService $reportService)
    {
        $this->reportService = $reportService;
    }

    public function index(): Response
    {
        $this->authorize('view_reports');
        return Inertia::render('Pharmacy/Reports/Index');
    }

    public function stock()
    {
        $this->authorize('view_reports');
        return $this->reportService->generateStockReport()->download('stock_report.pdf');
    }

    public function expiry()
    {
        $this->authorize('view_reports');
        return $this->reportService->generateExpiryReport()->download('expiry_report.pdf');
    }

    public function usage(Request $request)
    {
        $this->authorize('view_reports');
        $start = $request->start ? Carbon::parse($request->start) : now()->startOfMonth();
        $end = $request->end ? Carbon::parse($request->end) : now()->endOfMonth();
        return $this->reportService->generateUsageReport($start, $end)->download('usage_report.pdf');
    }
}
