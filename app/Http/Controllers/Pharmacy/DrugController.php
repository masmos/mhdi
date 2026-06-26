<?php

namespace App\Http\Controllers\Pharmacy;

use App\Http\Controllers\Controller;
use App\Http\Requests\DrugStoreRequest;
use App\Models\Drug;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DrugController extends Controller
{
    use AuthorizesRequests;

    public function index(Request $request): Response
    {
        $this->authorize('view_drugs');

        $drugs = Drug::withCount(['batches as total_stock' => function ($q) {
            $q->where('status', 'active')->select(DB::raw('SUM(quantity)'));
        }])
            ->when($request->search, fn($q, $s) => $q->where('name', 'LIKE', "%{$s}%")->orWhere('generic_name', 'LIKE', "%{$s}%"))
            ->when($request->category, fn($q, $c) => $q->where('category', $c))
            ->when($request->status === 'active', fn($q) => $q->where('is_active', true))
            ->when($request->status === 'inactive', fn($q) => $q->where('is_active', false))
            ->paginate(15);

        $categories = Drug::distinct()->pluck('category')->filter()->values();

        return Inertia::render('Pharmacy/Drugs/Index', [
            'drugs' => $drugs,
            'filters' => $request->only(['search', 'category', 'status']),
            'categories' => $categories,
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create_drugs');
        return Inertia::render('Pharmacy/Drugs/Create');
    }

    public function store(DrugStoreRequest $request): RedirectResponse
    {
        $drug = Drug::create($request->validated());
        return redirect()->route('drugs.index')->with('success', "Drug '{$drug->name}' created.");
    }

    public function edit(Drug $drug): Response
    {
        $this->authorize('edit_drugs');
        return Inertia::render('Pharmacy/Drugs/Edit', ['drug' => $drug]);
    }

    public function update(DrugStoreRequest $request, Drug $drug): RedirectResponse
    {
        $drug->update($request->validated());
        return redirect()->route('drugs.index')->with('success', "Drug '{$drug->name}' updated.");
    }

    public function destroy(Drug $drug): RedirectResponse
    {
        $this->authorize('delete_drugs');
        if ($drug->batches()->where('status', 'active')->exists()) {
            return back()->with('error', 'Cannot delete drug with active batches.');
        }
        $drug->delete();
        return redirect()->route('drugs.index')->with('success', 'Drug deleted.');
    }
}
