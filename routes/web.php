<?php

use App\Http\Controllers\Pharmacy\DashboardController;
use App\Http\Controllers\Settings\PermissionController;
use App\Http\Controllers\Settings\RoleController;
use App\Http\Controllers\Settings\UserController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
   // Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // User Management
    Route::resource('users', UserController::class);
    Route::post('/users/bulk', [UserController::class, 'bulkAction'])->name('users.bulk');
    
    // Role Management
    Route::resource('roles', RoleController::class);
    
    // Permission Management
    Route::resource('permissions', PermissionController::class);
});

require __DIR__.'/settings.php';
require __DIR__.'/pharmacy.php';
