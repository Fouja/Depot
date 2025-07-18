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
            if (!Schema::hasColumn('statistics', 'prix_unitaire')) {
                $table->decimal('prix_unitaire', 12, 2)->nullable();
            }
            if (!Schema::hasColumn('statistics', 'prix_total')) {
                $table->decimal('prix_total', 14, 2)->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('statistics', function (Blueprint $table) {
            if (Schema::hasColumn('statistics', 'prix_unitaire')) {
                $table->dropColumn('prix_unitaire');
            }
            if (Schema::hasColumn('statistics', 'prix_total')) {
                $table->dropColumn('prix_total');
            }
        });
    }
};
