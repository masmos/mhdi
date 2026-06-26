<?php

namespace Database\Factories;

use App\Models\Drug;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Drug>
 */
class DrugFactory extends Factory
{
    protected $model = Drug::class;

    public function definition(): array
    {
        return [
            'name' => fake()->randomElement([
                'Paracetamol',
                'Amoxicillin',
                'Ibuprofen',
                'Metronidazole',
                'Ciprofloxacin',
                'Artemether-Lumefantrine',
                'Omeprazole',
                'Diclofenac',
                'Azithromycin',
                'Cetirizine',
            ]),
            'generic_name' => fake()->randomElement([
                'Acetaminophen',
                'Amoxicillin',
                'Ibuprofen',
                'Metronidazole',
                'Ciprofloxacin',
            ]),
            'category' => fake()->randomElement([
                'Analgesic',
                'Antibiotic',
                'Antimalarial',
                'Antihistamine',
                'Anti-inflammatory',
            ]),
            'manufacturer' => fake()->company(),
            'unit' => fake()->randomElement([
                'Tablet',
                'Capsule',
                'Bottle',
                'Ampoule',
                'Vial',
            ]),
            'dosage_form' => fake()->randomElement([
                'Tablet',
                'Capsule',
                'Injection',
                'Syrup',
                'Cream',
            ]),
            'strength' => fake()->randomElement([
                '250mg',
                '500mg',
                '650mg',
                '1g',
                '5mg/ml',
            ]),
            'reorder_level' => fake()->numberBetween(10, 100),
            'is_active' => true,
        ];
    }
}
