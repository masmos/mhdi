<?php

namespace App\Services;

use App\Models\Batch;
use App\Models\Drug;
use App\Models\Supplier;
use App\Models\UsageRecord;
use Barryvdh\DomPDF\Facade\Pdf;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Illuminate\Http\Response;

class ReportService
{
    private function createExcelFile(string $title, array $headers, array $data, string $filename): BinaryFileResponse
    {
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        // Set title
        $sheet->setCellValue('A1', $title);
        $sheet->mergeCells('A1:' . $this->getColumnLetter(count($headers)) . '1');
        $sheet->getStyle('A1')->getFont()->setBold(true)->setSize(14);
        $sheet->getStyle('A1')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

        // Add headers
        $col = 'A';
        foreach ($headers as $header) {
            $sheet->setCellValue($col . '3', $header);
            $sheet->getStyle($col . '3')->getFont()->setBold(true);
            $sheet->getStyle($col . '3')->getFill()
                ->setFillType(Fill::FILL_SOLID)
                ->getStartColor()->setARGB('FFE0E0E0');
            $col++;
        }

        // Add data
        $row = 4;
        foreach ($data as $rowData) {
            $col = 'A';
            foreach ($rowData as $value) {
                $sheet->setCellValue($col . $row, $value);
                $col++;
            }
            $row++;
        }

        // Auto-size columns
        $col = 'A';
        foreach (range('A', $this->getColumnLetter(count($headers))) as $col) {
            $sheet->getColumnDimension($col)->setAutoSize(true);
        }

        // Apply borders
        $lastRow = $row - 1;
        $lastCol = $this->getColumnLetter(count($headers));
        $sheet->getStyle('A3:' . $lastCol . $lastRow)
            ->getBorders()
            ->getAllBorders()
            ->setBorderStyle(Border::BORDER_THIN);

        // Create file
        $writer = new Xlsx($spreadsheet);
        $tempFile = tempnam(sys_get_temp_dir(), 'report');
        $writer->save($tempFile);

        return response()->download($tempFile, $filename, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ])->deleteFileAfterSend(true);
    }

    private function getColumnLetter(int $index): string
    {
        $letter = '';
        while ($index > 0) {
            $remainder = ($index - 1) % 26;
            $letter = chr(65 + $remainder) . $letter;
            $index = intval(($index - $remainder) / 26);
        }
        return $letter;
    }

    private function createPdfResponse(string $view, array $data, string $filename): Response
    {
        $pdf = Pdf::loadView($view, $data);
        return $pdf->download($filename);
    }

    // Drug Reports
    public function exportDrugsToExcel(): BinaryFileResponse
    {
        $drugs = Drug::with(['batches' => function ($q) {
            $q->where('status', 'active');
        }])->get();

        $headers = ['ID', 'Name', 'Generic Name', 'Category', 'Manufacturer', 'Unit', 'Dosage Form', 'Strength', 'Total Stock', 'Reorder Level', 'Status'];

        $data = $drugs->map(fn($drug) => [
            $drug->id,
            $drug->name,
            $drug->generic_name ?? 'N/A',
            $drug->category ?? 'N/A',
            $drug->manufacturer ?? 'N/A',
            $drug->unit,
            $drug->dosage_form ?? 'N/A',
            $drug->strength ?? 'N/A',
            $drug->total_stock,
            $drug->reorder_level,
            $drug->is_active ? 'Active' : 'Inactive',
        ])->toArray();

        return $this->createExcelFile('Drug Catalogue', $headers, $data, 'drug_catalogue_' . now()->format('Ymd_His') . '.xlsx');
    }

    public function exportDrugsToPdf(): Response
    {
        $drugs = Drug::with(['batches' => function ($q) {
            $q->where('status', 'active');
        }])->get();

        $data = [
            'title' => 'Drug Catalogue',
            'date' => now()->format('Y-m-d H:i'),
            'drugs' => $drugs,
        ];

        return $this->createPdfResponse('reports.drugs', $data, 'drug_catalogue_' . now()->format('Ymd_His') . '.pdf');
    }

    // Supplier Reports
    public function exportSuppliersToExcel(): BinaryFileResponse
    {
        $suppliers = Supplier::all();

        $headers = ['ID', 'Name', 'Contact Person', 'Phone', 'Email', 'Address', 'Tax ID', 'Status'];

        $data = $suppliers->map(fn($supplier) => [
            $supplier->id,
            $supplier->name,
            $supplier->contact_person ?? 'N/A',
            $supplier->phone ?? 'N/A',
            $supplier->email ?? 'N/A',
            $supplier->address ?? 'N/A',
            $supplier->tax_id ?? 'N/A',
            $supplier->is_active ? 'Active' : 'Inactive',
        ])->toArray();

        return $this->createExcelFile('Suppliers', $headers, $data, 'suppliers_' . now()->format('Ymd_His') . '.xlsx');
    }

    public function exportSuppliersToPdf(): Response
    {
        $suppliers = Supplier::all();

        $data = [
            'title' => 'Suppliers',
            'date' => now()->format('Y-m-d H:i'),
            'suppliers' => $suppliers,
        ];

        return $this->createPdfResponse('reports.suppliers', $data, 'suppliers_' . now()->format('Ymd_His') . '.pdf');
    }

    // Batch Reports
    public function exportBatchesToExcel(): BinaryFileResponse
    {
        $batches = Batch::with(['drug', 'supplier'])->get();

        $headers = ['ID', 'Batch Number', 'Drug', 'Supplier', 'Quantity', 'Unit Cost', 'Expiry Date', 'Received Date', 'Status'];

        $data = $batches->map(fn($batch) => [
            $batch->id,
            $batch->batch_number,
            $batch->drug->name ?? 'N/A',
            $batch->supplier->name ?? 'N/A',
            $batch->quantity,
            $batch->unit_cost ?? 'N/A',
            $batch->expiry_date->format('Y-m-d'),
            $batch->received_date->format('Y-m-d'),
            ucfirst($batch->status),
        ])->toArray();

        return $this->createExcelFile('Stock Batches', $headers, $data, 'stock_batches_' . now()->format('Ymd_His') . '.xlsx');
    }

    public function exportBatchesToPdf(): Response
    {
        $batches = Batch::with(['drug', 'supplier'])->get();

        $data = [
            'title' => 'Stock Batches',
            'date' => now()->format('Y-m-d H:i'),
            'batches' => $batches,
        ];

        return $this->createPdfResponse('reports.batches', $data, 'stock_batches_' . now()->format('Ymd_His') . '.pdf');
    }

    // Usage Reports
    public function exportUsageToExcel(): BinaryFileResponse
    {
        $usage = UsageRecord::with(['drug', 'batch', 'administrator'])->latest()->get();

        $headers = ['ID', 'Drug', 'Batch Number', 'Quantity', 'Department', 'Patient ID', 'Administered By', 'Usage Date'];

        $data = $usage->map(fn($record) => [
            $record->id,
            $record->drug->name ?? 'N/A',
            $record->batch->batch_number ?? 'N/A',
            $record->quantity_used,
            $record->department ?? 'N/A',
            $record->patient_id ?? 'N/A',
            $record->administrator->name ?? 'N/A',
            $record->usage_date->format('Y-m-d H:i'),
        ])->toArray();

        return $this->createExcelFile('Dispensing Log', $headers, $data, 'dispensing_log_' . now()->format('Ymd_His') . '.xlsx');
    }

    public function exportUsageToPdf(): Response
{
    $usage = UsageRecord::with(['drug', 'batch', 'administrator'])->latest()->get();

    $data = [
        'title' => 'Dispensing Log',
        'date' => now()->format('Y-m-d H:i'),
        'usage_records' => $usage,
        'period' => 'All Time', // Add this line
        'total_used' => $usage->sum('quantity_used'), // Optional: total quantity used
    ];

    return $this->createPdfResponse('reports.usage', $data, 'dispensing_log_' . now()->format('Ymd_His') . '.pdf');
}
    // Advanced Reports (Return Response directly)
    public function exportExpiryReport(): Response
    {
        $expired = Batch::where('expiry_date', '<', now())
            ->where('status', '!=', 'expired')
            ->with('drug')
            ->get();

        $expiringSoon = Batch::whereBetween('expiry_date', [now(), now()->addDays(30)])
            ->where('status', 'active')
            ->with('drug')
            ->get();

        $data = [
            'title' => 'Expiry Report',
            'date' => now()->format('Y-m-d H:i'),
            'expired' => $expired,
            'expiring_soon' => $expiringSoon,
        ];

        return $this->createPdfResponse('reports.expiry', $data, 'expiry_report_' . now()->format('Ymd_His') . '.pdf');
    }

    public function exportStockValueReport(): Response
    {
        $drugs = Drug::with(['batches' => function ($q) {
            $q->where('status', 'active');
        }])->get();

        $totalValue = $drugs->sum(fn($d) => $d->batches->sum(fn($b) => $b->quantity * ($b->unit_cost ?? 0)));

        $data = [
            'title' => 'Stock Value Report',
            'date' => now()->format('Y-m-d H:i'),
            'drugs' => $drugs,
            'total_value' => $totalValue,
        ];

        return $this->createPdfResponse('reports.stock_value', $data, 'stock_value_report_' . now()->format('Ymd_His') . '.pdf');
    }

    public function exportDepartmentUsageReport(): Response
    {
        $usage = UsageRecord::selectRaw('department, SUM(quantity_used) as total_used')
            ->groupBy('department')
            ->orderBy('total_used', 'DESC')
            ->get();

        $data = [
            'title' => 'Department Usage Report',
            'date' => now()->format('Y-m-d H:i'),
            'usage' => $usage,
        ];

        return $this->createPdfResponse('reports.department_usage', $data, 'department_usage_report_' . now()->format('Ymd_His') . '.pdf');
    }
}