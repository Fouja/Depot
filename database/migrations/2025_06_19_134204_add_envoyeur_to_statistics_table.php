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
        Schema::table('statistics', function (Blueprint $table) {
            if (!Schema::hasColumn('statistics', 'envoyeur')) {
                $table->string('envoyeur')->nullable()->after('personnel');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('statistics', function (Blueprint $table) {
            if (Schema::hasColumn('statistics', 'envoyeur')) {
                $table->dropColumn('envoyeur');
            }
        });
    }
};
