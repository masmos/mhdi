<?php

namespace App\Http\Controllers\Pharmacy;

use App\Http\Controllers\Controller;
use App\Http\Requests\BatchStoreRequest;
use App\Http\Requests\BatchUseRequest;
use App\Models\Batch;
use App\Models\Drug;
use App\Models\Supplier;
use App\Services\InventoryService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class BatchController extends Controller
{
    use AuthorizesRequests;

    protected InventoryService $inventoryService;

    public function __construct(InventoryService $inventoryService)
    {
        $this->inventoryService = $inventoryService;
    }

    public function index(Request $request): Response
    {
        $this->authorize('view_batches');

        $batches = Batch::with(['drug', 'supplier'])
            ->when($request->search, function ($q, $s) {
                $q->where('batch_number', 'LIKE', "%{$s}%")
                    ->orWhereHas('drug', fn($q) => $q->where('name', 'LIKE', "%{$s}%"));
            })
            ->when($request->status, fn($q, $s) => $q->where('status', $s))
            ->when($request->expiry === 'expired', fn($q) => $q->where('expiry_date', '<', now()))
            ->when($request->expiry === 'soon', fn($q) => $q->whereBetween('expiry_date', [now(), now()->addDays(30)]))
            ->orderBy('expiry_date')
            ->get();

        return Inertia::render('pharmacy/batches/index', [
            'batches' => $batches,
            'filters' => $request->only(['search', 'status', 'expiry']),
            'suppliers' => Supplier::all(),
            'drugs' => Drug::all(),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create_batches');
        return Inertia::render('pharmacy/batches/create', [
            'drugs' => \App\Models\Drug::active()->get(['id', 'name']),
            'suppliers' => \App\Models\Supplier::active()->get(['id', 'name']),
        ]);
    }

    public function store(BatchStoreRequest $request): RedirectResponse
    {
        try {
            DB::transaction(function () use ($request) {
                $validated = $request->validated();

                foreach ($validated['items'] as $item) {
                    Batch::create([
                        'supplier_id' => $validated['supplier_id'],
                        'received_date' => $validated['received_date'],
                        'notes' => $validated['notes'] ?? null,
                        'drug_id' => $item['drug_id'],
                        'batch_number' => $item['batch_number'],
                        'quantity' => $item['quantity'],
                        'initial_quantity' => $item['quantity'],
                        'unit_cost' => $item['unit_cost'] ?? null,
                        'manufacture_date' => $item['manufacture_date'] ?? null,
                        'expiry_date' => $item['expiry_date'],
                        'location' => $item['location'] ?? null,
                        'notes' => $item['notes'] ?? null,
                        'status' => 'active',
                    ]);
                }
            });

            return redirect()->route('batches.index')
                ->with('success', 'Stock received successfully.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->withInput()
                ->with('error', 'Failed to create batches: ' . $e->getMessage());
        }
    }

    public function show(Batch $batch): Response
    {
        $this->authorize('view_batches');
        $batch->load(['drug', 'supplier', 'usageRecords.administrator', 'adjustments.performer']);
        return Inertia::render('Pharmacy/Batches/Show', ['batch' => $batch]);
    }

    public function edit(Batch $batch): Response
    {
        $this->authorize('edit_batches');
        return Inertia::render('Pharmacy/Batches/Edit', [
            'batch' => $batch,
            'drugs' => Drug::active()->get(['id', 'name']),
            'suppliers' => Supplier::active()->get(['id', 'name']),
        ]);
    }

    public function update(BatchStoreRequest $request, Batch $batch): RedirectResponse
    {
        $batch->update($request->validated());
        return redirect()->route('batches.index')->with('success', "Batch {$batch->batch_number} updated.");
    }

    public function destroy(Batch $batch): RedirectResponse
    {
        $this->authorize('delete_batches');
        $batch->delete();
        return redirect()->route('batches.index')->with('success', 'Batch deleted.');
    }

    public function useStock(BatchUseRequest $request, Batch $batch): RedirectResponse
    {
        try {
            $usage = $batch->deductStock(
                $request->quantity,
                $request->department,
                request()->user()->id,
                $request->prescribed_by,
                $request->patient_id
            );
            return back()->with('success', "Used {$request->quantity} units.");
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function adjustStock(Request $request, Batch $batch): RedirectResponse
    {
        $this->authorize('adjust_inventory');
        $request->validate([
            'quantity' => 'required|integer|min:1',
            'type' => 'required|in:add,subtract',
            'reason' => 'required|string|max:500',
        ]);

        try {
            if ($request->type === 'add') {
                $batch->addStock($request->quantity, $request->reason, request()->user()->id);
                $msg = "Added {$request->quantity} units.";
            } else {
                $batch->deductStock($request->quantity, 'Adjustment', request()->user()->id);
                $msg = "Removed {$request->quantity} units.";
            }
            return back()->with('success', $msg);
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}
