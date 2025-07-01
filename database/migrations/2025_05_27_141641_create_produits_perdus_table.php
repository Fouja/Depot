<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('produits_perdus', function (Blueprint $table) {
            $table->id();
            $table->foreignId('produit_id')->constrained(); // Must match produits.id type
            $table->integer('quantity');
            $table->text('description');
            $table->dateTime('date_perte');
            $table->foreignId('user_id')->constrained();
            $table->decimal('prix_unitaire', 12, 2)->nullable();
            $table->decimal('prix_total', 12, 2)->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('produits_perdus');
    }
};
