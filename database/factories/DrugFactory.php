<?php

namespace Database\Factories;

use App\Models\Drug;
use Illuminate\Database\Eloquent\Factories\Factory;
use Faker\Factory as FakerFactory;

/**
 * @extends Factory<Drug>
 */
class DrugFactory extends Factory
{
    protected $model = Drug::class;

    public function definition(): array
    {
        $faker = FakerFactory::create();
        
        return [
            'name' => $faker->randomElement([
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
            'generic_name' => $faker->randomElement([
                'Acetaminophen',
                'Amoxicillin',
                'Ibuprofen',
                'Metronidazole',
                'Ciprofloxacin',
            ]),
            'category' => $faker->randomElement([
                'Analgesic',
                'Antibiotic',
                'Antimalarial',
                'Antihistamine',
                'Anti-inflammatory',
            ]),
            'manufacturer' => $faker->company(),
            'unit' => $faker->randomElement([
                'Tablet',
                'Capsule',
                'Bottle',
                'Ampoule',
                'Vial',
            ]),
            'dosage_form' => $faker->randomElement([
                'Tablet',
                'Capsule',
                'Injection',
                'Syrup',
                'Cream',
            ]),
            'strength' => $faker->randomElement([
                '250mg',
                '500mg',
                '650mg',
                '1g',
                '5mg/ml',
            ]),
            'reorder_level' => $faker->numberBetween(10, 100),
            'is_active' => true,
        ];
    }
}