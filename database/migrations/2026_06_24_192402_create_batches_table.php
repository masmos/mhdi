<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('batches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('drug_id')->constrained()->onDelete('cascade');
            $table->string('batch_number')->unique();
            $table->integer('quantity')->default(0);
            $table->integer('initial_quantity');
            $table->decimal('unit_cost', 12, 2)->nullable();
            $table->decimal('selling_price', 12, 2)->nullable();
            $table->date('manufacture_date')->nullable();
            $table->date('expiry_date');
            $table->foreignId('supplier_id')->nullable()->constrained()->nullOnDelete();
            $table->date('received_date');
            $table->string('location', 100)->nullable();
            $table->enum('status', ['active', 'expired', 'depleted', 'quarantined'])->default('active');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['status', 'expiry_date']);
            $table->index('batch_number');
            $table->index('drug_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('batches');
    }
};
