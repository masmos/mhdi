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
        // Try to get faker from the container or create a new instance
        try {
            $faker = app(\Faker\Generator::class);
        } catch (\Exception $e) {
            // Fallback: use the factory's faker property
            $faker = $this->faker;
        }
        
        return [
            'name' => $faker->company(),
            'contact_person' => $faker->name(),
            'phone' => $faker->phoneNumber(),
            'email' => $faker->safeEmail(),
            'address' => $faker->address(),
            'tax_id' => strtoupper($faker->bothify('TIN-########')),
            'bank_name' => $faker->randomElement([
                'Stanbic Bank',
                'Centenary Bank',
                'DFCU Bank',
                'Absa Bank',
                'Equity Bank'
            ]),
            'bank_account' => $faker->bankAccountNumber(),
            'notes' => $faker->optional()->sentence(),
            'is_active' => true,
        ];
    }
}