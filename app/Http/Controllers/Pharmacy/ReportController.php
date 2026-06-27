<?php

namespace App\Http\Controllers\Pharmacy;

use App\Http\Controllers\Controller;
use App\Models\Batch;
use App\Models\Drug;
use App\Models\Supplier;
use App\Models\UsageRecord;
use App\Services\ReportService;
use Carbon\Carbon;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

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

        $stats = [
            'drugs' => Drug::count(),
            'suppliers' => Supplier::count(),
            'batches' => Batch::count(),
            'usage_records' => UsageRecord::count(),
        ];

        return Inertia::render('pharmacy/reports/index', [
            'stats' => $stats,
        ]);
    }

    // Drug Reports
    public function drugsExcel(): BinaryFileResponse
    {
        $this->authorize('view_reports');
        return $this->reportService->exportDrugsToExcel();
    }

    public function drugsPdf()
    {
        $this->authorize('view_reports');
        return $this->reportService->exportDrugsToPdf();
    }

    // Supplier Reports
    public function suppliersExcel(): BinaryFileResponse
    {
        $this->authorize('view_reports');
        return $this->reportService->exportSuppliersToExcel();
    }

    public function suppliersPdf()
    {
        $this->authorize('view_reports');
        return $this->reportService->exportSuppliersToPdf();
    }

    // Batch Reports
    public function batchesExcel(): BinaryFileResponse
    {
        $this->authorize('view_reports');
        return $this->reportService->exportBatchesToExcel();
    }

    public function batchesPdf()
    {
        $this->authorize('view_reports');
        return $this->reportService->exportBatchesToPdf();
    }

    // Usage Reports
    public function usageExcel(): BinaryFileResponse
    {
        $this->authorize('view_reports');
        return $this->reportService->exportUsageToExcel();
    }

    public function usagePdf()
    {
        $this->authorize('view_reports');
        return $this->reportService->exportUsageToPdf();
    }

    // Additional Reports
    public function expiryReport()
    {
        $this->authorize('view_reports');
        return $this->reportService->exportExpiryReport();
    }

    public function stockValueReport()
    {
        $this->authorize('view_reports');
        return $this->reportService->exportStockValueReport();
    }

    public function departmentUsageReport()
    {
        $this->authorize('view_reports');
        return $this->reportService->exportDepartmentUsageReport();
    }
}