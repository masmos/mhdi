<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SupplierUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('edit_suppliers');
    }

    public function rules(): array
    {
        $id = $this->route('supplier')->id ?? $this->supplier;
        return [
            'name' => 'required|string|max:255',
            'contact_person' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:50',
            'email' => ['nullable', 'email', 'max:255', Rule::unique('suppliers', 'email')->ignore($id)],
            'address' => 'nullable|string|max:1000',
            'tax_id' => ['nullable', 'string', 'max:50', Rule::unique('suppliers', 'tax_id')->ignore($id)],
            'bank_name' => 'nullable|string|max:255',
            'bank_account' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:1000',
            'is_active' => 'boolean',
        ];
    }
}
