<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BatchUseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create_usage');
    }

    public function rules(): array
    {
        return [
            'quantity' => 'required|integer|min:1',
            'department' => 'required|string|max:100',
            'patient_id' => 'nullable|string|max:100',
            'prescribed_by' => 'nullable|exists:users,id',
            'notes' => 'nullable|string|max:500',
        ];
    }
}
