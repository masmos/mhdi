<?php

namespace Database\Seeders;

use App\Models\Batch;
use App\Models\Drug;
use App\Models\Supplier;
use App\Models\UsageRecord;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class MockDataSeeder extends Seeder
{
    public function run(): void
    {
        // Supplier data
        $supplierNames = [
            'MediCare Supplies Ltd',
            'PharmaDistributors Inc',
            'HealthFirst Medical',
            'Global Drug Solutions',
            'MediLink Pharmaceuticals',
            'CareMed Distributors',
            'VitalHealth Supplies',
            'PharmaBridge Ltd',
            'MediSource International',
            'TrustMed Distributors'
        ];

        $contactPersons = [
            'John Mukasa', 'Sarah Nakato', 'Peter Okello', 'Grace Auma', 
            'Robert Ssali', 'Jane Namusoke', 'David Ochen', 'Mary Akello',
            'James Ochieng', 'Catherine Nanyonga'
        ];

        $bankNames = ['Stanbic Bank', 'Centenary Bank', 'DFCU Bank', 'Absa Bank', 'Equity Bank'];
        
        $suppliers = [];
        for ($i = 0; $i < 10; $i++) {
            $suppliers[] = Supplier::create([
                'name' => $supplierNames[$i],
                'contact_person' => $contactPersons[$i],
                'phone' => '07' . rand(10000000, 99999999),
                'email' => strtolower(str_replace(' ', '', $supplierNames[$i])) . '@gmail.com',
                'address' => 'Plot ' . rand(1, 500) . ', Kampala, Uganda',
                'tax_id' => 'TIN-' . rand(10000000, 99999999),
                'bank_name' => $bankNames[array_rand($bankNames)],
                'bank_account' => 'ACC' . rand(10000000, 99999999),
                'notes' => rand(0, 1) ? 'Preferred supplier' : null,
                'is_active' => true,
            ]);
        }

        // Drug data
        $drugNames = [
            'Paracetamol', 'Amoxicillin', 'Ibuprofen', 'Metronidazole', 
            'Ciprofloxacin', 'Artemether-Lumefantrine', 'Omeprazole', 
            'Diclofenac', 'Azithromycin', 'Cetirizine',
            'Amoxicillin-Clavulanate', 'Doxycycline', 'Ceftriaxone',
            'Metformin', 'Amlodipine', 'Lisinopril', 'Atorvastatin',
            'Pantoprazole', 'Levothyroxine', 'Losartan'
        ];
        
        $genericNames = [
            'Acetaminophen', 'Amoxicillin', 'Ibuprofen', 'Metronidazole',
            'Ciprofloxacin', 'Artemether', 'Omeprazole',
            'Diclofenac', 'Azithromycin', 'Cetirizine'
        ];
        
        $categories = ['Analgesic', 'Antibiotic', 'Antimalarial', 'Antihistamine', 'Anti-inflammatory'];
        $manufacturers = ['Pfizer', 'GlaxoSmithKline', 'Novartis', 'Sanofi', 'Merck', 'Bayer', 'AstraZeneca'];
        $units = ['Tablet', 'Capsule', 'Bottle', 'Ampoule', 'Vial'];
        $dosageForms = ['Tablet', 'Capsule', 'Injection', 'Syrup', 'Cream'];
        $strengths = ['250mg', '500mg', '650mg', '1g', '5mg/ml', '10mg', '20mg', '50mg'];

        $drugs = [];
        for ($i = 0; $i < 20; $i++) {
            $drugs[] = Drug::create([
                'name' => $drugNames[$i % count($drugNames)],
                'generic_name' => $genericNames[array_rand($genericNames)],
                'category' => $categories[array_rand($categories)],
                'manufacturer' => $manufacturers[array_rand($manufacturers)],
                'unit' => $units[array_rand($units)],
                'dosage_form' => $dosageForms[array_rand($dosageForms)],
                'strength' => $strengths[array_rand($strengths)],
                'reorder_level' => rand(10, 100),
                'is_active' => true,
            ]);
        }

        // Get a nurse user for administered_by field
        $nurse = User::role('nurse')->first();
        $nurseId = $nurse ? $nurse->id : 1;

        // For each drug, create 1-3 batches
        foreach ($drugs as $drug) {
            $batchCount = rand(1, 3);
            for ($i = 0; $i < $batchCount; $i++) {
                $quantity = rand(50, 500);
                $expiry = Carbon::now()->addMonths(rand(1, 24));
                
                $batch = Batch::create([
                    'drug_id' => $drug->id,
                    'batch_number' => 'BATCH-' . strtoupper(uniqid()),
                    'quantity' => $quantity,
                    'initial_quantity' => $quantity,
                    'unit_cost' => rand(100, 5000),
                    'selling_price' => rand(200, 6000),
                    'manufacture_date' => Carbon::now()->subMonths(rand(1, 12)),
                    'expiry_date' => $expiry,
                    'supplier_id' => $suppliers[array_rand($suppliers)]->id,
                    'received_date' => Carbon::now()->subDays(rand(1, 60)),
                    'location' => 'Shelf ' . rand(1, 10),
                    'status' => 'active',
                ]);

                // Create some usage records for this batch
                $usageCount = rand(0, 5);
                for ($j = 0; $j < $usageCount; $j++) {
                    $departments = ['Outpatient', 'Emergency', 'Maternity', 'Surgery'];
                    UsageRecord::create([
                        'batch_id' => $batch->id,
                        'drug_id' => $drug->id,
                        'quantity_used' => rand(1, 20),
                        'department' => $departments[array_rand($departments)],
                        'patient_id' => 'P' . rand(1000, 9999),
                        'administered_by' => $nurseId,
                        'usage_date' => Carbon::now()->subDays(rand(1, 30)),
                    ]);
                }
            }
        }

        // Create some expired batches
        $expiredBatches = Batch::take(3)->get();
        foreach ($expiredBatches as $batch) {
            $batch->update([
                'expiry_date' => Carbon::now()->subDays(rand(1, 100)),
                'status' => 'expired',
            ]);
        }

        // Create some depleted batches
        $depletedBatches = Batch::take(2)->get();
        foreach ($depletedBatches as $batch) {
            $batch->update([
                'quantity' => 0,
                'status' => 'depleted',
            ]);
        }
        
        $this->command->info('Mock data seeded successfully!');
        $this->command->info('Suppliers: ' . Supplier::count());
        $this->command->info('Drugs: ' . Drug::count());
        $this->command->info('Batches: ' . Batch::count());
        $this->command->info('Usage Records: ' . UsageRecord::count());
    }
}