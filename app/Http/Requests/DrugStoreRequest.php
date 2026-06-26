<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DrugStoreRequest extends FormRequest
{
     public function authorize(): bool
    {
        return $this->user()->can('create_drugs');
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'generic_name' => 'nullable|string|max:255',
            'category' => 'nullable|string|max:100',
            'manufacturer' => 'nullable|string|max:255',
            'unit' => 'required|string|max:50',
            'dosage_form' => 'nullable|string|max:100',
            'strength' => 'nullable|string|max:100',
            'reorder_level' => 'required|integer|min:0',
            'is_active' => 'boolean',
        ];
    }
}
