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
        // Suppliers
        $suppliers = Supplier::factory(10)->create();

        // Drugs
        $drugs = Drug::factory(20)->create();

        // For each drug, create 1-3 batches
        $drugs->each(function ($drug) use ($suppliers) {
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
                    'supplier_id' => $suppliers->random()->id,
                    'received_date' => Carbon::now()->subDays(rand(1, 60)),
                    'location' => 'Shelf ' . rand(1, 10),
                    'status' => 'active',
                ]);

                // Create some usage records for this batch
                $usageCount = rand(0, 5);
                for ($j = 0; $j < $usageCount; $j++) {
                    UsageRecord::create([
                        'batch_id' => $batch->id,
                        'drug_id' => $drug->id,
                        'quantity_used' => rand(1, 20),
                        'department' => ['Outpatient', 'Emergency', 'Maternity', 'Surgery'][rand(0, 3)],
                        'patient_id' => 'P' . rand(1000, 9999),
                        'administered_by' => User::role('nurse')->first()?->id ?? 1,
                        'usage_date' => Carbon::now()->subDays(rand(1, 30)),
                    ]);
                }
            }
        });

        // Create some expired batches
        Batch::take(3)->each(function ($batch) {
            $batch->update([
                'expiry_date' => Carbon::now()->subDays(rand(1, 100)),
                'status' => 'expired',
            ]);
        });

        // Create some depleted batches
        Batch::take(2)->each(function ($batch) {
            $batch->update([
                'quantity' => 0,
                'status' => 'depleted',
            ]);
        });
    }
}
