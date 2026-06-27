<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DispenseStoreRequest extends FormRequest
{
   public function authorize(): bool
    {
        return $this->user()->can('create_usage');
    }

    public function rules(): array
    {
        return [
            'patient_name' => 'required|string|max:255',
            'patient_id' => 'nullable|string|max:100',
            'department' => 'required|string|max:100',
            'prescribed_by' => 'nullable|exists:users,id',
            'dispense_date' => 'required|date',
            'notes' => 'nullable|string|max:1000',
            'items' => 'required|array|min:1',
            'items.*.batch_id' => 'required|exists:batches,id',
            'items.*.drug_id' => 'required|exists:drugs,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.patient_id' => 'nullable|string|max:100',
        ];
    }

    public function messages(): array
    {
        return [
            'patient_name.required' => 'Patient name is required.',
            'department.required' => 'Department is required.',
            'items.required' => 'At least one medication is required.',
            'items.*.batch_id.required' => 'Batch is required for each item.',
            'items.*.drug_id.required' => 'Drug is required for each item.',
            'items.*.quantity.required' => 'Quantity is required for each item.',
            'items.*.quantity.min' => 'Quantity must be at least 1.',
        ];
    }
}