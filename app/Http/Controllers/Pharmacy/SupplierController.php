<?php

namespace App\Http\Controllers\Pharmacy;

use App\Http\Controllers\Controller;
use App\Http\Requests\SupplierStoreRequest;
use App\Http\Requests\SupplierUpdateRequest;
use App\Models\Supplier;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SupplierController extends Controller
{
    use AuthorizesRequests;

    public function index(Request $request): Response
    {
        $this->authorize('view_suppliers');

        $suppliers = Supplier::search($request->search)
            ->when($request->status === 'active', fn($q) => $q->active())
            ->when($request->status === 'inactive', fn($q) => $q->where('is_active', false))
            ->orderBy($request->sort ?? 'name', $request->direction ?? 'asc')
            ->paginate($request->per_page ?? 15)
            ->through(fn($s) => [
                'id' => $s->id,
                'name' => $s->name,
                'contact_person' => $s->contact_person,
                'phone' => $s->phone,
                'email' => $s->email,
                'address' => $s->address,
                'tax_id' => $s->tax_id,
                'is_active' => $s->is_active,
                'total_batches' => $s->batches()->count(),
                'active_batches' => $s->batches()->where('status', 'active')->count(),
                'expired_batches' => $s->batches()->where('status', 'expired')->count(),
                'created_at' => $s->created_at,
            ]);

        return Inertia::render('Pharmacy/Suppliers/Index', [
            'suppliers' => $suppliers,
            'filters' => $request->only(['search', 'status', 'sort', 'direction']),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create_suppliers');
        return Inertia::render('Pharmacy/Suppliers/Create');
    }

    public function store(SupplierStoreRequest $request): RedirectResponse
    {
        $supplier = Supplier::create($request->validated());
        return redirect()->route('suppliers.index')->with('success', "Supplier '{$supplier->name}' created.");
    }

    public function show(Supplier $supplier): Response
    {
        $this->authorize('view_suppliers');
        $supplier->load(['batches.drug']);

        $stats = [
            'total_batches' => $supplier->batches()->count(),
            'active_batches' => $supplier->batches()->where('status', 'active')->count(),
            'expired_batches' => $supplier->batches()->where('status', 'expired')->count(),
            'depleted_batches' => $supplier->batches()->where('status', 'depleted')->count(),
            'total_drugs' => $supplier->batches()->distinct('drug_id')->count('drug_id'),
            'total_value' => $supplier->batches()->where('status', 'active')->get()->sum(fn($b) => $b->quantity * ($b->unit_cost ?? 0)),
        ];

        $recent = $supplier->batches()->with('drug')->orderBy('received_date', 'desc')->limit(10)->get()
            ->map(fn($b) => [
                'id' => $b->id,
                'batch_number' => $b->batch_number,
                'drug_name' => $b->drug->name,
                'quantity' => $b->quantity,
                'unit_cost' => $b->unit_cost,
                'expiry_date' => $b->expiry_date,
                'received_date' => $b->received_date,
                'status' => $b->status,
            ]);

        return Inertia::render('Pharmacy/Suppliers/Show', [
            'supplier' => $supplier,
            'stats' => $stats,
            'recentDeliveries' => $recent,
        ]);
    }

    public function edit(Supplier $supplier): Response
    {
        $this->authorize('edit_suppliers');
        return Inertia::render('Pharmacy/Suppliers/Edit', ['supplier' => $supplier]);
    }

    public function update(SupplierUpdateRequest $request, Supplier $supplier): RedirectResponse
    {
        $supplier->update($request->validated());
        return redirect()->route('suppliers.index')->with('success', "Supplier '{$supplier->name}' updated.");
    }

    public function destroy(Supplier $supplier): RedirectResponse
    {
        $this->authorize('delete_suppliers');
        if ($supplier->batches()->where('status', 'active')->exists()) {
            return back()->with('error', 'Cannot delete supplier with active batches.');
        }
        $name = $supplier->name;
        $supplier->delete();
        return redirect()->route('suppliers.index')->with('success', "Supplier '{$name}' deleted.");
    }

    public function toggleStatus(Supplier $supplier): RedirectResponse
    {
        $this->authorize('edit_suppliers');
        $supplier->update(['is_active' => !$supplier->is_active]);
        return back()->with('success', "Supplier status toggled.");
    }
}
