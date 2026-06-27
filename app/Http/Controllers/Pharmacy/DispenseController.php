<?php

namespace App\Http\Controllers\Pharmacy;

use App\Http\Controllers\Controller;
use App\Http\Requests\DispenseStoreRequest;
use App\Models\Batch;
use App\Models\UsageRecord;
use App\Models\User;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DispenseController extends Controller
{
    use AuthorizesRequests;

    public function create(): Response
    {
        $this->authorize('create_usage');

        // Get available batches (active, in stock, not expired)
        $availableBatches = Batch::with(['drug'])
            ->where('status', 'active')
            ->where('quantity', '>', 0)
            ->where('expiry_date', '>', now())
            ->orderBy('expiry_date')
            ->get();

        // Get doctors for prescription dropdown
        $doctors = User::role('doctor')->get(['id', 'name']);

        return Inertia::render('pharmacy/dispense/create', [
            'availableBatches' => $availableBatches,
            'doctors' => $doctors,
        ]);
    }

    public function store(DispenseStoreRequest $request): RedirectResponse
    {
        try {
            DB::transaction(function () use ($request) {
                $validated = $request->validated();

                foreach ($validated['items'] as $item) {
                    $batch = Batch::findOrFail($item['batch_id']);

                    // Check if enough stock
                    if ($batch->quantity < $item['quantity']) {
                        throw new \Exception("Insufficient stock for batch: {$batch->batch_number}. Available: {$batch->quantity}");
                    }

                    // Deduct stock
                    $batch->decrement('quantity', $item['quantity']);

                    // Create usage record
                    UsageRecord::create([
                        'batch_id' => $item['batch_id'],
                        'drug_id' => $item['drug_id'],
                        'quantity_used' => $item['quantity'],
                        'department' => $validated['department'],
                        'patient_id' => $validated['patient_id'] ?? $item['patient_id'] ?? null,
                        'prescribed_by' => $validated['prescribed_by'] ?? null,
                        'administered_by' => Auth::user()->id,
                        'usage_date' => $validated['dispense_date'],
                        'notes' => $validated['notes'] ?? null,
                    ]);

                    // Update batch status if depleted
                    if ($batch->quantity <= 0) {
                        $batch->update(['status' => 'depleted']);
                    }
                }
            });

            return redirect()->route('dashboard')
                ->with('success', 'Medication dispensed successfully.');

        } catch (\Exception $e) {
            return redirect()->back()
                ->withInput()
                ->with('error', 'Failed to dispense medication: ' . $e->getMessage());
        }
    }
}