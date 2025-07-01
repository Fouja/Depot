<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('produits_perdus', function (Blueprint $table) {
            $table->decimal('prix_unitaire', 12, 2)->nullable()->after('user_id');
            $table->decimal('prix_total', 12, 2)->nullable()->after('prix_unitaire');
        });
    }

    public function down()
    {
        Schema::table('produits_perdus', function (Blueprint $table) {
            $table->dropColumn(['prix_unitaire', 'prix_total']);
        });
    }
}; 