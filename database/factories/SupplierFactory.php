<?php

namespace Database\Factories;

use App\Models\Supplier;
use Illuminate\Database\Eloquent\Factories\Factory;
use Faker\Generator as Faker;

/**
 * @extends Factory<Supplier>
 */
class SupplierFactory extends Factory
{
    protected $model = Supplier::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->company(),
            'contact_person' => $this->faker->name(),
            'phone' => $this->faker->phoneNumber(),
            'email' => $this->faker->safeEmail(),
            'address' => $this->faker->address(),
            'tax_id' => strtoupper($this->faker->bothify('TIN-########')),
            'bank_name' => $this->faker->randomElement([
                'Stanbic Bank',
                'Centenary Bank',
                'DFCU Bank',
                'Absa Bank',
                'Equity Bank'
            ]),
            'bank_account' => $this->faker->bankAccountNumber(),
            'notes' => $this->faker->optional()->sentence(),
            'is_active' => true,
        ];
    }
}