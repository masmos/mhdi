<?php

namespace App\Console\Commands;

use App\Models\Batch;
use App\Models\ExpiryNotification;
use Illuminate\Console\Command;

class CheckExpiryAndStock extends Command
{
    protected $signature = 'pharmacy:check-alerts';
    protected $description = 'Check for expired, expiring, and low stock items';

    public function handle()
    {
        $this->info('Checking for alerts...');

        // 1. Check expired batches
        $expiredBatches = Batch::where('expiry_date', '<', now())
            ->where('status', '!=', 'expired')
            ->get();

        foreach ($expiredBatches as $batch) {
            ExpiryNotification::firstOrCreate(
                [
                    'batch_id' => $batch->id,
                    'notification_type' => 'expired',
                ],
                [
                    'sent_at' => now(),
                    'sent_to' => [], // Will be populated when user views
                    'is_read' => false,
                ]
            );
            
            // Update batch status
            $batch->update(['status' => 'expired']);
        }

        // 2. Check expiring soon (within 30 days)
        $expiringSoon = Batch::whereBetween('expiry_date', [now(), now()->addDays(30)])
            ->where('status', 'active')
            ->get();

        foreach ($expiringSoon as $batch) {
            ExpiryNotification::firstOrCreate(
                [
                    'batch_id' => $batch->id,
                    'notification_type' => 'warning',
                ],
                [
                    'sent_at' => now(),
                    'sent_to' => [],
                    'is_read' => false,
                ]
            );
        }

        $this->info('Alerts check completed.');
    }
}
