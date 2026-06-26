<?php

use App\Http\Controllers\Pharmacy\BatchController;
use App\Http\Controllers\Pharmacy\DrugController;
use App\Http\Controllers\Pharmacy\InventoryController;
use App\Http\Controllers\Pharmacy\ReportController;
use App\Http\Controllers\Pharmacy\SupplierController;
use App\Http\Controllers\Pharmacy\UsageController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
   
    // Suppliers
    Route::resource('suppliers', SupplierController::class);
    Route::post('/suppliers/{supplier}/toggle-status', [SupplierController::class, 'toggleStatus'])->name('suppliers.toggle-status');

    // Drugs
    Route::resource('drugs', DrugController::class);

    // Batches
    Route::resource('batches', BatchController::class);
    Route::post('/batches/{batch}/use', [BatchController::class, 'useStock'])->name('batches.use');
    Route::post('/batches/{batch}/adjust', [BatchController::class, 'adjustStock'])->name('batches.adjust');

    // Usage
    Route::get('/usage', [UsageController::class, 'index'])->name('usage.index');

    // Inventory
    Route::get('/inventory', [InventoryController::class, 'index'])->name('inventory.index');
    Route::get('/inventory/expiry', [InventoryController::class, 'expiryView'])->name('inventory.expiry');
    Route::get('/inventory/low-stock', [InventoryController::class, 'lowStock'])->name('inventory.low-stock');

    // Reports
    Route::prefix('reports')->name('reports.')->group(function () {
        Route::get('/', [ReportController::class, 'index'])->name('index');
        Route::get('/stock', [ReportController::class, 'stock'])->name('stock');
        Route::get('/expiry', [ReportController::class, 'expiry'])->name('expiry');
        Route::get('/usage', [ReportController::class, 'usage'])->name('usage');
    });
});
