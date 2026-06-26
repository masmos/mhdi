<?php

namespace Database\Factories;

use App\Models\Supplier;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Supplier>
 */
class SupplierFactory extends Factory
{
    protected $model = Supplier::class;

    public function definition(): array
    {
        return [
            'name' => fake()->company(),
            'contact_person' => fake()->name(),
            'phone' => fake()->phoneNumber(),
            'email' => fake()->safeEmail(),
            'address' => fake()->address(),
            'tax_id' => strtoupper(fake()->bothify('TIN-########')),
            'bank_name' => fake()->randomElement([
                'Stanbic Bank',
                'Centenary Bank',
                'DFCU Bank',
                'Absa Bank',
                'Equity Bank'
            ]),
            'bank_account' => fake()->bankAccountNumber(),
            'notes' => fake()->optional()->sentence(),
            'is_active' => true,
        ];
    }
}
