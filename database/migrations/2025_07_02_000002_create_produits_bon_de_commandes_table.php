<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('produits_bon_de_commandes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bon_id')->constrained('bon_de_commandes')->onDelete('cascade');
            $table->string('nom');
            $table->integer('quantite');
            $table->string('unite');
            $table->string('type');
            $table->string('marque')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('produits_bon_de_commandes');
    }
};
