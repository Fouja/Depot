<?php

namespace Database\Seeders;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('users')->insert([
            'name' => 'Test User',
            'email' => 'test@test.com',
            'password' => Hash::make('test'),  // Keep this line
            'created_at' => now(),
            'updated_at' => now()
        ]);
    }
}
