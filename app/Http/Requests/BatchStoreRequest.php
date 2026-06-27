<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BatchStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create_batches');
    }

    public function rules(): array
    {
        return [
            'supplier_id' => 'required|exists:suppliers,id',
            'received_date' => 'required|date',
            'notes' => 'nullable|string|max:1000',
            'items' => 'required|array|min:1',
            'items.*.drug_id' => 'required|exists:drugs,id',
            'items.*.batch_number' => [
                'required',
                'string',
                'max:100',
                Rule::unique('batches', 'batch_number'),
            ],
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_cost' => 'nullable|numeric|min:0',
            'items.*.expiry_date' => 'required|date|after:today',
            'items.*.manufacture_date' => 'nullable|date',
            'items.*.location' => 'nullable|string|max:100',
            'items.*.notes' => 'nullable|string|max:1000',
        ];
    }

    public function messages(): array
    {
        return [
            'supplier_id.required' => 'Please select a supplier.',
            'items.required' => 'At least one item is required.',
            'items.*.drug_id.required' => 'Drug is required for item #{position}.',
            'items.*.batch_number.required' => 'Batch number is required for item #{position}.',
            'items.*.batch_number.unique' => 'Batch number "{value}" already exists.',
            'items.*.quantity.required' => 'Quantity is required for item #{position}.',
            'items.*.quantity.min' => 'Quantity must be at least 1 for item #{position}.',
            'items.*.expiry_date.required' => 'Expiry date is required for item #{position}.',
            'items.*.expiry_date.after' => 'Expiry date must be in the future for item #{position}.',
        ];
    }
}
