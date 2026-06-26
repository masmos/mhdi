<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BatchStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create_batches');
    }

    public function rules(): array
    {
        return [
            'drug_id' => 'required|exists:drugs,id',
            'batch_number' => 'required|string|max:100|unique:batches',
            'quantity' => 'required|integer|min:1',
            'unit_cost' => 'nullable|numeric|min:0',
            'selling_price' => 'nullable|numeric|min:0',
            'manufacture_date' => 'nullable|date',
            'expiry_date' => 'required|date|after:today',
            'supplier_id' => 'nullable|exists:suppliers,id',
            'received_date' => 'required|date',
            'location' => 'nullable|string|max:100',
            'notes' => 'nullable|string|max:1000',
        ];
    }
}
