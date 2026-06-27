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
            'name' => $this->faker->randomElement([
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
            'generic_name' => $this->faker->randomElement([
                'Acetaminophen',
                'Amoxicillin',
                'Ibuprofen',
                'Metronidazole',
                'Ciprofloxacin',
            ]),
            'category' => $this->faker->randomElement([
                'Analgesic',
                'Antibiotic',
                'Antimalarial',
                'Antihistamine',
                'Anti-inflammatory',
            ]),
            'manufacturer' => $this->faker->company(),
            'unit' => $this->faker->randomElement([
                'Tablet',
                'Capsule',
                'Bottle',
                'Ampoule',
                'Vial',
            ]),
            'dosage_form' => $this->faker->randomElement([
                'Tablet',
                'Capsule',
                'Injection',
                'Syrup',
                'Cream',
            ]),
            'strength' => $this->faker->randomElement([
                '250mg',
                '500mg',
                '650mg',
                '1g',
                '5mg/ml',
            ]),
            'reorder_level' => $this->faker->numberBetween(10, 100),
            'is_active' => true,
        ];
    }
}
