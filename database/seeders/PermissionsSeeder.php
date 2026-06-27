<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionsSeeder extends Seeder
{
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Define all permissions
        $permissions = [
            // Suppliers
            'view_suppliers',
            'create_suppliers',
            'edit_suppliers',
            'delete_suppliers',
            // Drugs
            'view_drugs',
            'create_drugs',
            'edit_drugs',
            'delete_drugs',
            // Batches
            'view_batches',
            'create_batches',
            'edit_batches',
            'delete_batches',
            // Usage
            'view_usage',
            'create_usage',
            // Inventory
            'view_inventory',
            'adjust_inventory',
            // Reports
            'view_reports',
            // Users
            'manage_users',
            'manage_roles',

            // activity logs
            'view_activity_logs',
            'clear_activity_logs',
        ];

        foreach ($permissions as $perm) {
            Permission::firstOrCreate(['name' => $perm]);
        }

        // Roles
        $superAdmin = Role::firstOrCreate(['name' => 'super_admin']);
        $superAdmin->givePermissionTo(Permission::all());

        $pharmacist = Role::firstOrCreate(['name' => 'pharmacist']);
        $pharmacist->givePermissionTo([
            'view_suppliers',
            'create_suppliers',
            'edit_suppliers',
            'delete_suppliers',
            'view_drugs',
            'create_drugs',
            'edit_drugs',
            'delete_drugs',
            'view_batches',
            'create_batches',
            'edit_batches',
            'delete_batches',
            'view_usage',
            'create_usage',
            'view_inventory',
            'adjust_inventory',
            'view_reports',
        ]);

        $nurse = Role::firstOrCreate(['name' => 'nurse']);
        $nurse->givePermissionTo([
            'view_drugs',
            'view_batches',
            'view_inventory',
            'view_usage',
            'create_usage'
        ]);

        $doctor = Role::firstOrCreate(['name' => 'doctor']);
        $doctor->givePermissionTo([
            'view_drugs',
            'view_batches',
            'view_inventory',
            'view_usage',
            'view_reports'
        ]);

        $director = Role::firstOrCreate(['name' => 'director']);
        $director->givePermissionTo([
            'view_drugs',
            'view_batches',
            'view_inventory',
            'view_usage',
            'view_reports'
        ]);

        // Assign to roles
        $superAdmin = Role::findByName('super_admin');
        $superAdmin->givePermissionTo(['view_activity_logs', 'clear_activity_logs']);

        $pharmacist = Role::findByName('pharmacist');
        $pharmacist->givePermissionTo(['view_activity_logs']);

        $director = Role::findByName('director');
        $director->givePermissionTo(['view_activity_logs']);

        // Create admin user
        $admin = User::firstOrCreate([
            'email' => 'mmasaba085@gmail.com'
        ], [
            'name' => 'Moses Masaba - Admin',
            'password' => Hash::make('password'),
        ]);
        $admin->assignRole('super_admin');

        // Create pharmacist
        $pharmacistUser = User::firstOrCreate([
            'email' => 'pharmacist@hospital.com'
        ], [
            'name' => 'Pharmacist',
            'password' => Hash::make('password'),
        ]);
        $pharmacistUser->assignRole('pharmacist');

        // Create nurse
        $nurseUser = User::firstOrCreate([
            'email' => 'nurse@hospital.com'
        ], [
            'name' => 'Nurse',
            'password' => Hash::make('password'),
        ]);
        $nurseUser->assignRole('nurse');

        // Create doctor
        $doctorUser = User::firstOrCreate([
            'email' => 'doctor@hospital.com'
        ], [
            'name' => 'Doctor',
            'password' => Hash::make('password'),
        ]);
        $doctorUser->assignRole('doctor');

        // Create director
        $directorUser = User::firstOrCreate([
            'email' => 'director@hospital.com'
        ], [
            'name' => 'Director',
            'password' => Hash::make('password'),
        ]);
        $directorUser->assignRole('director');
    }
}
